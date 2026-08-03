import type { ServiceId } from "./index.ts";

export type ProposalPackageId = "digital-foundation" | "growth-engine" | "connected-growth";

export interface ProposalPackage {
  id: ProposalPackageId;
  name: string;
  indicativePriceIdr: number;
  durationWeeks: readonly [number, number];
  deliverables: readonly string[];
}

export interface ProposalPreview {
  version: "preview-1";
  title: string;
  serviceId: ServiceId;
  package: ProposalPackage;
  objective: string;
  scope: readonly string[];
  exclusions: readonly string[];
  assumptions: readonly string[];
  risks: readonly string[];
  paymentTerms: readonly [
    { label: "DP"; percentage: 50; amountIdr: number },
    { label: "Setelah implementasi"; percentage: 50; amountIdr: number },
  ];
  commercialStatus: "indicative";
}

export interface CommercialTerms {
  basePriceIdr: number;
  discountPercentage: number;
  discountAmountIdr: number;
  subtotalIdr: number;
  taxPercentage: number;
  taxAmountIdr: number;
  totalIdr: number;
  paymentTerms: readonly [
    { label: "DP"; percentage: 50; amountIdr: number },
    { label: "Setelah implementasi"; percentage: 50; amountIdr: number },
  ];
}

function assertPercentage(name: string, value: number, maximum: number): void {
  if (!Number.isFinite(value) || value < 0 || value > maximum) {
    throw new RangeError(`${name} must be between 0 and ${maximum}`);
  }
}

export function calculateCommercialTerms(input: {
  basePriceIdr: number;
  discountPercentage: number;
  taxPercentage: number;
}): CommercialTerms {
  if (!Number.isInteger(input.basePriceIdr) || input.basePriceIdr < 0) {
    throw new RangeError("basePriceIdr must be a non-negative integer");
  }
  assertPercentage("discountPercentage", input.discountPercentage, 30);
  assertPercentage("taxPercentage", input.taxPercentage, 20);

  const discountAmountIdr = Math.round(input.basePriceIdr * (input.discountPercentage / 100));
  const subtotalIdr = input.basePriceIdr - discountAmountIdr;
  const taxAmountIdr = Math.round(subtotalIdr * (input.taxPercentage / 100));
  const totalIdr = subtotalIdr + taxAmountIdr;
  const dpAmountIdr = Math.round(totalIdr / 2);

  return {
    basePriceIdr: input.basePriceIdr,
    discountPercentage: input.discountPercentage,
    discountAmountIdr,
    subtotalIdr,
    taxPercentage: input.taxPercentage,
    taxAmountIdr,
    totalIdr,
    paymentTerms: [
      { label: "DP", percentage: 50, amountIdr: dpAmountIdr },
      { label: "Setelah implementasi", percentage: 50, amountIdr: totalIdr - dpAmountIdr },
    ],
  };
}

export function createProposalNumber(issueDate: string, sequence: number): string {
  const date = new Date(`${issueDate}T00:00:00.000Z`);
  if (Number.isNaN(date.valueOf()) || !Number.isInteger(sequence) || sequence < 1 || sequence > 9999) {
    throw new RangeError("Invalid proposal number input");
  }
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `PRP/QIRA/${year}/${month}/${String(sequence).padStart(3, "0")}`;
}

export function calculateValidUntil(issueDate: string, validityDays = 14): string {
  if (!Number.isInteger(validityDays) || validityDays < 1 || validityDays > 90) {
    throw new RangeError("validityDays must be between 1 and 90");
  }
  const date = new Date(`${issueDate}T00:00:00.000Z`);
  if (Number.isNaN(date.valueOf())) throw new RangeError("Invalid issue date");
  date.setUTCDate(date.getUTCDate() + validityDays);
  return date.toISOString().slice(0, 10);
}

export const PROPOSAL_PACKAGES: readonly ProposalPackage[] = Object.freeze([
  {
    id: "digital-foundation",
    name: "Digital Foundation",
    indicativePriceIdr: 4_900_000,
    durationWeeks: [2, 3],
    deliverables: ["Discovery terstruktur", "Solusi inti satu proses", "Dokumentasi dan handover"],
  },
  {
    id: "growth-engine",
    name: "Growth Engine",
    indicativePriceIdr: 9_900_000,
    durationWeeks: [4, 6],
    deliverables: ["Discovery dan blueprint", "Implementasi multi-step", "Dashboard dasar", "Pendampingan adopsi"],
  },
  {
    id: "connected-growth",
    name: "Connected Growth",
    indicativePriceIdr: 17_500_000,
    durationWeeks: [6, 10],
    deliverables: ["Discovery mendalam", "Integrasi beberapa sistem", "Automation dan monitoring", "Training dan support awal"],
  },
]);

const SERVICE_SCOPE: Readonly<Record<ServiceId, readonly string[]>> = {
  "ai-employees": ["Desain tanggung jawab AI Employee", "Knowledge dan guardrails", "Human approval workflow"],
  automation: ["Pemetaan proses prioritas", "Automation workflow", "Exception dan monitoring dasar"],
  "business-apps": ["User flow dan data model", "Aplikasi proses inti", "Role dan validation rules"],
  discovery: ["Workshop kebutuhan", "Opportunity dan readiness assessment", "Architecture dan implementation roadmap"],
};

export function findProposalPackage(id: ProposalPackageId): ProposalPackage {
  const proposalPackage = PROPOSAL_PACKAGES.find((item) => item.id === id);
  if (!proposalPackage) throw new RangeError(`Unknown proposal package: ${id}`);
  return proposalPackage;
}

export function createProposalPreview(input: {
  serviceId: ServiceId;
  packageId: ProposalPackageId;
  objective: string;
}): ProposalPreview {
  const proposalPackage = findProposalPackage(input.packageId);
  const half = proposalPackage.indicativePriceIdr / 2;

  return {
    version: "preview-1",
    title: `${proposalPackage.name} — QIRA ${input.serviceId}`,
    serviceId: input.serviceId,
    package: proposalPackage,
    objective: input.objective.trim() || "Meningkatkan efektivitas proses bisnis prioritas.",
    scope: [...SERVICE_SCOPE[input.serviceId], ...proposalPackage.deliverables],
    exclusions: ["Biaya layanan pihak ketiga", "Perubahan di luar scope yang disetujui", "Migrasi data historis kecuali dinyatakan"],
    assumptions: ["PIC dan data tersedia sesuai jadwal", "Feedback diberikan maksimal dua hari kerja", "Harga bersifat indikatif sampai Founder QIRA menyetujui"],
    risks: ["Perubahan kebutuhan setelah scope disetujui", "Keterlambatan akses data atau sistem", "Adopsi pengguna membutuhkan pendampingan tambahan"],
    paymentTerms: [
      { label: "DP", percentage: 50, amountIdr: half },
      { label: "Setelah implementasi", percentage: 50, amountIdr: half },
    ],
    commercialStatus: "indicative",
  };
}
