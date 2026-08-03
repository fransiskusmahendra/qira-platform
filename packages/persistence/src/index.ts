import {
  assertTenantAccess,
  type DiscoveryStatus,
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

export class InMemoryPersistence implements DiscoveryRepository, AuditRepository {
  readonly #discoveries = new Map<string, DiscoveryRecord>();
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
}

