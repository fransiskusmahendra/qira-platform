import type { ServiceId } from "./index.ts";

export type ProposalPackageId = "digital-foundation" | "growth-engine" | "connected-growth";

export interface ProposalPackage {
  id: ProposalPackageId;
  name: string;
  tagline: string;
  introductoryPriceIdr: number;
  priceLabel: "Mulai dari";
  durationWeeks: readonly [number, number];
  revisions: number;
  supportDays: number;
  deliverables: readonly string[];
  exclusions: readonly string[];
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
    { label: "Sebelum serah terima"; percentage: 50; amountIdr: number },
  ];
  commercialStatus: "indicative";
}

export interface CommercialCalculation {
  basePriceIdr: number;
  discountPercent: number;
  discountAmountIdr: number;
  subtotalIdr: number;
  taxPercent: number;
  taxAmountIdr: number;
  totalIdr: number;
  downPaymentPercent: number;
  downPaymentAmountIdr: number;
  finalPaymentPercent: number;
  finalPaymentAmountIdr: number;
}

function assertPercentage(label: string, value: number): void {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError(`${label} must be between 0 and 100`);
  }
}

export function calculateCommercialTerms(input: {
  basePriceIdr: number;
  discountPercent: number;
  taxPercent: number;
  downPaymentPercent: number;
}): CommercialCalculation {
  if (!Number.isFinite(input.basePriceIdr) || input.basePriceIdr < 0) {
    throw new RangeError("basePriceIdr must be zero or greater");
  }
  assertPercentage("discountPercent", input.discountPercent);
  assertPercentage("taxPercent", input.taxPercent);
  assertPercentage("downPaymentPercent", input.downPaymentPercent);

  const discountAmountIdr = Math.round(input.basePriceIdr * input.discountPercent / 100);
  const subtotalIdr = input.basePriceIdr - discountAmountIdr;
  const taxAmountIdr = Math.round(subtotalIdr * input.taxPercent / 100);
  const totalIdr = subtotalIdr + taxAmountIdr;
  const downPaymentAmountIdr = Math.round(totalIdr * input.downPaymentPercent / 100);

  return {
    ...input,
    discountAmountIdr,
    subtotalIdr,
    taxAmountIdr,
    totalIdr,
    downPaymentAmountIdr,
    finalPaymentPercent: 100 - input.downPaymentPercent,
    finalPaymentAmountIdr: totalIdr - downPaymentAmountIdr,
  };
}

export const PROPOSAL_PACKAGES: readonly ProposalPackage[] = Object.freeze([
  {
    id: "digital-foundation",
    name: "Digital Foundation",
    tagline: "Hadir profesional dan mudah dihubungi secara digital.",
    introductoryPriceIdr: 1_500_000,
    priceLabel: "Mulai dari",
    durationWeeks: [1, 2],
    revisions: 1,
    supportDays: 14,
    deliverables: [
      "Landing page responsif maksimal 5 bagian",
      "Profil usaha dan layanan atau produk unggulan",
      "Tombol WhatsApp dan form kontak sederhana",
      "Bantuan publikasi awal",
    ],
    exclusions: ["Login dan database khusus", "Dashboard atau sistem transaksi", "Domain, hosting, dan layanan berbayar"],
  },
  {
    id: "growth-engine",
    name: "Growth Engine",
    tagline: "Tangkap dan kelola calon pelanggan dengan lebih teratur.",
    introductoryPriceIdr: 2_900_000,
    priceLabel: "Mulai dari",
    durationWeeks: [1, 2],
    revisions: 2,
    supportDays: 14,
    deliverables: [
      "Seluruh fondasi digital yang relevan",
      "Form pemesanan atau pendaftaran",
      "Penyimpanan prospek dan dashboard sederhana",
      "Katalog terbatas dan notifikasi email dasar",
    ],
    exclusions: ["WhatsApp API resmi atau chatbot berbayar", "Payment gateway", "Integrasi API pihak ketiga"],
  },
  {
    id: "connected-growth",
    name: "Connected Growth",
    tagline: "Hubungkan proses inti agar operasional lebih ringan.",
    introductoryPriceIdr: 4_900_000,
    priceLabel: "Mulai dari",
    durationWeeks: [2, 3],
    revisions: 2,
    supportDays: 30,
    deliverables: [
      "Maksimal dua alur kerja utama",
      "Database dan dashboard operasional sederhana",
      "Status permintaan atau pesanan",
      "Dokumen atau notifikasi dasar dari data",
    ],
    exclusions: ["Integrasi enterprise atau sistem legacy", "Migrasi data historis", "Fitur tambahan di luar scope discovery"],
  },
]);

export const CARE_PLANS = Object.freeze([
  { name: "Basic Care", priceRange: "Rp150.000–Rp250.000/bulan", outcome: "Pemantauan dan perubahan konten ringan." },
  { name: "Growth Care", priceRange: "Rp350.000–Rp500.000/bulan", outcome: "Dukungan operasional dan perbaikan minor berkala." },
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
  const half = proposalPackage.introductoryPriceIdr / 2;

  return {
    version: "preview-1",
    title: `${proposalPackage.name} — QIRA ${input.serviceId}`,
    serviceId: input.serviceId,
    package: proposalPackage,
    objective: input.objective.trim() || "Meningkatkan efektivitas proses bisnis prioritas.",
    scope: [...SERVICE_SCOPE[input.serviceId], ...proposalPackage.deliverables],
    exclusions: [...proposalPackage.exclusions, "Biaya layanan pihak ketiga", "Perubahan di luar scope yang disetujui"],
    assumptions: [
      "Harga perkenalan tersedia untuk proyek portofolio terbatas",
      "PIC dan data tersedia sesuai jadwal",
      `Termasuk maksimal ${proposalPackage.revisions} kali revisi`,
      `Dukungan awal selama ${proposalPackage.supportDays} hari setelah serah terima`,
      "Harga final dikonfirmasi setelah discovery dan persetujuan Founder QIRA",
    ],
    risks: ["Perubahan kebutuhan setelah scope disetujui", "Keterlambatan akses data atau sistem", "Adopsi pengguna membutuhkan pendampingan tambahan"],
    paymentTerms: [
      { label: "DP", percentage: 50, amountIdr: half },
      { label: "Sebelum serah terima", percentage: 50, amountIdr: half },
    ],
    commercialStatus: "indicative",
  };
}
