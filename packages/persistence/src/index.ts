import {
  assertProposalPermission,
  assertTenantAccess,
  TenantAccessDeniedError,
  type DiscoveryStatus,
  type ProposalPackageId,
  type ProposalStatus,
  type ScoreResult,
  type ServiceId,
  type TenantContext,
} from "@qira/domain";

export interface DiscoveryRecord {
  id: string;
  organizationId: string;
  serviceIds: readonly ServiceId[];
  status: DiscoveryStatus;
  version: number;
  responses: Readonly<Record<string, string | number>>;
  scores: readonly ScoreResult[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  occurredAt: string;
  actorId: string;
  organizationId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  result: "success" | "denied";
  reason?: string;
}

export interface ProposalCommercialTerms {
  packageId: ProposalPackageId;
  basePriceIdr: number;
  discountPercent: number;
  taxPercent: number;
  downPaymentPercent: number;
}

export interface ProposalRecord {
  id: string;
  organizationId: string;
  discoveryId: string;
  proposalNumber: string;
  status: ProposalStatus;
  version: number;
  clientName: string;
  recipientName: string;
  issueDate: string;
  validUntil: string;
  commercialTerms: ProposalCommercialTerms;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalVersionRecord {
  id: string;
  proposalId: string;
  organizationId: string;
  version: number;
  snapshot: ProposalRecord;
  createdBy: string;
  createdAt: string;
}

export interface DiscoveryRepository {
  findById(context: TenantContext, id: string): Promise<DiscoveryRecord | undefined>;
  list(context: TenantContext): Promise<readonly DiscoveryRecord[]>;
  save(context: TenantContext, record: DiscoveryRecord): Promise<void>;
}

export interface AuditRepository {
  append(event: AuditEvent): Promise<void>;
  listForOrganization(
    context: TenantContext,
    organizationId: string,
  ): Promise<readonly AuditEvent[]>;
}

export interface ProposalRepository {
  findProposalById(context: TenantContext, id: string): Promise<ProposalRecord | undefined>;
  listProposals(context: TenantContext): Promise<readonly ProposalRecord[]>;
  saveProposal(context: TenantContext, record: ProposalRecord): Promise<void>;
  approveProposal(context: TenantContext, id: string, approvedAt: string): Promise<ProposalRecord>;
  saveProposalVersion(context: TenantContext, version: ProposalVersionRecord): Promise<void>;
  listProposalVersions(context: TenantContext, proposalId: string): Promise<readonly ProposalVersionRecord[]>;
}

export class InMemoryPersistence implements DiscoveryRepository, AuditRepository, ProposalRepository {
  readonly #discoveries = new Map<string, DiscoveryRecord>();
  readonly #proposals = new Map<string, ProposalRecord>();
  readonly #proposalVersions = new Map<string, ProposalVersionRecord>();
  readonly #auditEvents: AuditEvent[] = [];

  async findById(
    context: TenantContext,
    id: string,
  ): Promise<DiscoveryRecord | undefined> {
    const record = this.#discoveries.get(id);
    if (!record) return undefined;
    assertTenantAccess(context, record);
    return structuredClone(record);
  }

  async list(context: TenantContext): Promise<readonly DiscoveryRecord[]> {
    return [...this.#discoveries.values()]
      .filter((record) => record.organizationId === context.organizationId)
      .map((record) => structuredClone(record));
  }

  async save(context: TenantContext, record: DiscoveryRecord): Promise<void> {
    assertTenantAccess(context, record);
    const existing = this.#discoveries.get(record.id);
    if (existing) assertTenantAccess(context, existing);
    this.#discoveries.set(record.id, structuredClone(record));
  }

  async append(event: AuditEvent): Promise<void> {
    this.#auditEvents.push(structuredClone(event));
  }

  async listForOrganization(
    context: TenantContext,
    organizationId: string,
  ): Promise<readonly AuditEvent[]> {
    assertTenantAccess(context, { organizationId });
    return this.#auditEvents
      .filter((event) => event.organizationId === organizationId)
      .map((event) => structuredClone(event));
  }

  async findProposalById(context: TenantContext, id: string): Promise<ProposalRecord | undefined> {
    assertProposalPermission(context, "proposal.read");
    const record = this.#proposals.get(id);
    if (!record) return undefined;
    assertTenantAccess(context, record);
    return structuredClone(record);
  }

  async listProposals(context: TenantContext): Promise<readonly ProposalRecord[]> {
    assertProposalPermission(context, "proposal.read");
    return [...this.#proposals.values()]
      .filter((record) => record.organizationId === context.organizationId)
      .map((record) => structuredClone(record));
  }

  async saveProposal(context: TenantContext, record: ProposalRecord): Promise<void> {
    assertProposalPermission(context, "proposal.write");
    assertTenantAccess(context, record);
    const existing = this.#proposals.get(record.id);
    if (existing) assertTenantAccess(context, existing);
    this.#proposals.set(record.id, structuredClone(record));
  }

  async approveProposal(context: TenantContext, id: string, approvedAt: string): Promise<ProposalRecord> {
    assertProposalPermission(context, "proposal.approve");
    const record = this.#proposals.get(id);
    if (!record) throw new RangeError(`Unknown proposal: ${id}`);
    assertTenantAccess(context, record);
    if (record.status !== "review") throw new RangeError("Proposal must be in review before approval");
    const approved: ProposalRecord = {
      ...record,
      status: "approved",
      approvedBy: context.actorId,
      approvedAt,
      updatedAt: approvedAt,
    };
    this.#proposals.set(id, structuredClone(approved));
    await this.append({
      id: `proposal-approved-${id}-${record.version}`,
      occurredAt: approvedAt,
      actorId: context.actorId,
      organizationId: record.organizationId,
      action: "proposal.approved",
      resourceType: "proposal",
      resourceId: id,
      result: "success",
    });
    return structuredClone(approved);
  }

  async saveProposalVersion(context: TenantContext, version: ProposalVersionRecord): Promise<void> {
    assertProposalPermission(context, "proposal.write");
    assertTenantAccess(context, version);
    const proposal = this.#proposals.get(version.proposalId);
    if (!proposal) throw new RangeError(`Unknown proposal: ${version.proposalId}`);
    assertTenantAccess(context, proposal);
    if (version.snapshot.organizationId !== version.organizationId) {
      throw new TenantAccessDeniedError();
    }
    const key = `${version.proposalId}:${version.version}`;
    if (this.#proposalVersions.has(key)) throw new RangeError("Proposal version is immutable");
    this.#proposalVersions.set(key, structuredClone(version));
  }

  async listProposalVersions(context: TenantContext, proposalId: string): Promise<readonly ProposalVersionRecord[]> {
    assertProposalPermission(context, "proposal.read");
    const proposal = this.#proposals.get(proposalId);
    if (!proposal) return [];
    assertTenantAccess(context, proposal);
    return [...this.#proposalVersions.values()]
      .filter((version) => version.proposalId === proposalId)
      .sort((left, right) => left.version - right.version)
      .map((version) => structuredClone(version));
  }
}
