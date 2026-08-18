export type ServiceId =
  | "ai-employees"
  | "automation"
  | "business-apps"
  | "discovery";

export interface ServiceOffering {
  id: ServiceId;
  name: string;
  outcome: string;
  discoveryPrompt: string;
}

export const SERVICE_CATALOG: readonly ServiceOffering[] = Object.freeze([
  {
    id: "ai-employees",
    name: "AI Employees",
    outcome: "Membantu tim menangani pekerjaan berulang dengan pengawasan manusia.",
    discoveryPrompt: "Pekerjaan berulang apa yang paling banyak menyita waktu tim Anda?",
  },
  {
    id: "automation",
    name: "Business Automation",
    outcome: "Menghubungkan proses dan sistem agar pekerjaan mengalir lebih cepat.",
    discoveryPrompt: "Di tahap mana proses Anda paling sering tertunda atau diulang?",
  },
  {
    id: "business-apps",
    name: "Business Applications",
    outcome: "Membuat aplikasi operasional yang sesuai dengan cara bisnis Anda bekerja.",
    discoveryPrompt: "Proses apa yang saat ini masih bergantung pada spreadsheet atau chat?",
  },
  {
    id: "discovery",
    name: "AI & Digital Discovery",
    outcome: "Menentukan peluang, prioritas, arsitektur, dan roadmap implementasi yang terukur.",
    discoveryPrompt: "Hasil bisnis apa yang ingin Anda capai dalam 90 hari ke depan?",
  },
]);

export function findService(id: string): ServiceOffering | undefined {
  return SERVICE_CATALOG.find((service) => service.id === id);
}

export * from "./business-blueprints.ts";
export * from "./discovery-questions.ts";
export * from "./discovery-triage.ts";
export * from "./scoring.ts";
export * from "./proposal.ts";
export * from "./state-machine.ts";
export * from "./tenancy.ts";
export * from "./invitation.ts";
