import type { ProposalPackageId } from "@qira/domain";

const KEY = "qira.proposal.preview.v1";
const SCHEMA_VERSION = 1;

export interface ClientProfile {
  organizationName: string;
  recipientName: string;
  recipientTitle: string;
  email: string;
}

export interface ProposalSettings {
  proposalNumber: string;
  issueDate: string;
  validUntil: string;
  packageId: ProposalPackageId;
  basePriceIdr: number;
  discountPercent: number;
  taxPercent: number;
  downPaymentPercent: number;
}

export interface ProposalVersion {
  version: number;
  savedAt: string;
  client: ClientProfile;
  settings: ProposalSettings;
}

export interface ProposalWorkspace {
  schemaVersion: typeof SCHEMA_VERSION;
  currentClient: ClientProfile;
  currentSettings: ProposalSettings;
  versions: ProposalVersion[];
}

export function createProposalWorkspace(today: string, validUntil = today): ProposalWorkspace {
  const [year, month] = today.split("-");

  return {
    schemaVersion: SCHEMA_VERSION,
    currentClient: { organizationName: "", recipientName: "", recipientTitle: "", email: "" },
    currentSettings: {
      proposalNumber: `PROP/QIRA/${year}/${month}/001`,
      issueDate: today,
      validUntil,
      packageId: "digital-foundation",
      basePriceIdr: 4_900_000,
      discountPercent: 0,
      taxPercent: 0,
      downPaymentPercent: 50,
    },
    versions: [],
  };
}

export function readProposalWorkspace(): ProposalWorkspace | undefined {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Partial<ProposalWorkspace>;
    return parsed.schemaVersion === SCHEMA_VERSION && parsed.currentClient && parsed.currentSettings && Array.isArray(parsed.versions)
      ? parsed as ProposalWorkspace
      : undefined;
  } catch {
    return undefined;
  }
}

export function writeProposalWorkspace(workspace: ProposalWorkspace): void {
  sessionStorage.setItem(KEY, JSON.stringify(workspace));
}

export function addProposalVersion(workspace: ProposalWorkspace): ProposalWorkspace {
  const version: ProposalVersion = {
    version: workspace.versions.length + 1,
    savedAt: new Date().toISOString(),
    client: structuredClone(workspace.currentClient),
    settings: structuredClone(workspace.currentSettings),
  };
  return { ...workspace, versions: [...workspace.versions, version] };
}
