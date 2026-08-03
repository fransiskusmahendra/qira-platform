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

