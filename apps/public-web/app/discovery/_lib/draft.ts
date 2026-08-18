import type { ServiceId } from "@qira/domain";

export const DISCOVERY_DRAFT_KEY = "qira.discovery.preview.v1";
export const DISCOVERY_DRAFT_VERSION = 1;

export interface DiscoveryPreviewDraft {
  schemaVersion: typeof DISCOVERY_DRAFT_VERSION;
  serviceId: ServiceId;
  businessTypeId?: string;
  answers: Record<string, string | number | undefined>;
  assessment: {
    impact: number;
    readiness: number;
    complexity: number;
  };
  consented: boolean;
  savedAt: string;
}

export function isDiscoveryPreviewDraft(value: unknown): value is DiscoveryPreviewDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<DiscoveryPreviewDraft>;
  return (
    draft.schemaVersion === DISCOVERY_DRAFT_VERSION &&
    typeof draft.serviceId === "string" &&
    Boolean(draft.answers) &&
    typeof draft.assessment?.impact === "number" &&
    typeof draft.assessment.readiness === "number" &&
    typeof draft.assessment.complexity === "number" &&
    typeof draft.consented === "boolean" &&
    typeof draft.savedAt === "string"
  );
}

export function readDiscoveryDraft(): DiscoveryPreviewDraft | undefined {
  try {
    const raw = sessionStorage.getItem(DISCOVERY_DRAFT_KEY);
    if (!raw) return undefined;
    const parsed: unknown = JSON.parse(raw);
    return isDiscoveryPreviewDraft(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function writeDiscoveryDraft(draft: DiscoveryPreviewDraft): void {
  sessionStorage.setItem(DISCOVERY_DRAFT_KEY, JSON.stringify(draft));
}

export function clearDiscoveryDraft(): void {
  sessionStorage.removeItem(DISCOVERY_DRAFT_KEY);
}

