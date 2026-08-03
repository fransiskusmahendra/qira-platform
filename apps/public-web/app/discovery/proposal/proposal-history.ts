import type { ProposalPackageId } from "@qira/domain";

const HISTORY_KEY = "qira.proposal.preview.history.v1";
const MAX_VERSIONS = 10;

export interface ProposalProfile {
  organizationName: string;
  recipientName: string;
  recipientRole: string;
  recipientEmail: string;
}

export interface ProposalVersion {
  schemaVersion: 1;
  version: number;
  savedAt: string;
  proposalNumber: string;
  issueDate: string;
  validUntil: string;
  packageId: ProposalPackageId;
  profile: ProposalProfile;
  basePriceIdr: number;
  discountPercentage: number;
  taxPercentage: number;
  approved: boolean;
}

function isVersion(value: unknown): value is ProposalVersion {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<ProposalVersion>;
  return item.schemaVersion === 1 && typeof item.version === "number" && typeof item.proposalNumber === "string" && Boolean(item.profile);
}

export function readProposalHistory(): ProposalVersion[] {
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter(isVersion).slice(0, MAX_VERSIONS) : [];
  } catch {
    return [];
  }
}

export function saveProposalVersion(input: Omit<ProposalVersion, "schemaVersion" | "version" | "savedAt">): ProposalVersion[] {
  const current = readProposalHistory();
  const next: ProposalVersion = {
    ...input,
    schemaVersion: 1,
    version: (current[0]?.version ?? 0) + 1,
    savedAt: new Date().toISOString(),
  };
  const history = [next, ...current].slice(0, MAX_VERSIONS);
  sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return history;
}

