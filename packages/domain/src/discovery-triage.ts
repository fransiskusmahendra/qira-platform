import type { ServiceId } from "./index.ts";

export type DiscoveryTriageLevel = 1 | 2 | 3;

export interface DiscoveryTriageInput {
  serviceId: ServiceId;
  answers: Record<string, string | number | undefined>;
  assessment: { impact: number; readiness: number; complexity: number };
}

export interface DiscoveryTriageResult {
  level: DiscoveryTriageLevel;
  label: string;
  reasons: string[];
  requiresAdminReview: boolean;
  rulesetVersion: "2026-08-14.1";
}

const LEVEL_THREE_TERMS = [
  "bank", "perbankan", "asuransi", "kesehatan", "medis", "rekam medis", "hukum", "legal",
  "pemerintah", "pemerintahan", "data pribadi", "data sensitif", "biometrik", "underwriting",
  "klaim", "core banking", "erp", "legacy", "migrasi data",
];
const INTEGRATION_TERMS = ["api", "integrasi", "payment gateway", "whatsapp", "erp", "crm", "pos", "accounting", "akuntansi"];
const SCALE_TERMS = ["multi cabang", "banyak cabang", "nasional", "ratusan pengguna", "ribuan pengguna", "multi tenant"];

function normalizedContext(answers: DiscoveryTriageInput["answers"]) {
  return Object.values(answers).filter((value): value is string | number => value !== undefined).join(" ").toLowerCase();
}

function matchedTerms(context: string, terms: string[]) {
  return terms.filter((term) => context.includes(term));
}

export function classifyDiscoveryTriage(input: DiscoveryTriageInput): DiscoveryTriageResult {
  const context = normalizedContext(input.answers);
  const sensitive = matchedTerms(context, LEVEL_THREE_TERMS);
  const integrations = matchedTerms(context, INTEGRATION_TERMS);
  const scale = matchedTerms(context, SCALE_TERMS);
  const reasons: string[] = [];

  if (input.assessment.complexity >= 5) reasons.push("Kompleksitas dinilai sangat tinggi");
  if (sensitive.length) reasons.push(`Konteks berisiko/teregulasi terdeteksi: ${sensitive.slice(0, 3).join(", ")}`);
  if (integrations.length >= 3) reasons.push("Melibatkan beberapa sistem atau integrasi");

  if (input.assessment.complexity >= 5 || sensitive.length || integrations.length >= 3) {
    return { level: 3, label: "Discovery manual diperlukan", reasons, requiresAdminReview: true, rulesetVersion: "2026-08-14.1" };
  }

  if (input.assessment.complexity >= 3) reasons.push("Kompleksitas membutuhkan validasi QIRA");
  if (input.assessment.readiness <= 2) reasons.push("Kesiapan implementasi perlu diperdalam");
  if (integrations.length) reasons.push("Ada kebutuhan integrasi sistem");
  if (scale.length) reasons.push("Skala operasional membutuhkan review khusus");

  if (input.assessment.complexity >= 3 || input.assessment.readiness <= 2 || integrations.length || scale.length) {
    return { level: 2, label: "Review QIRA diperlukan", reasons, requiresAdminReview: true, rulesetVersion: "2026-08-14.1" };
  }

  return {
    level: 1,
    label: "Konsep otomatis siap ditinjau",
    reasons: ["Kebutuhan awal dapat dipetakan dengan pola solusi standar"],
    requiresAdminReview: false,
    rulesetVersion: "2026-08-14.1",
  };
}
