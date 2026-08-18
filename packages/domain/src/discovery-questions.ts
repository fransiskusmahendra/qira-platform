import type { ServiceId } from "./index.ts";

export type DiscoveryAnswerType = "short_text" | "long_text" | "single_select" | "number";

export interface DiscoveryQuestion {
  id: string;
  prompt: string;
  answerType: DiscoveryAnswerType;
  required: boolean;
  options?: readonly string[];
  stage?: "profile" | "process" | "sector" | "implementation";
  showWhen?: { questionId: string; equals: string };
}

export interface DiscoveryQuestionnaire {
  version: string;
  serviceId: ServiceId;
  questions: readonly DiscoveryQuestion[];
}

const COMMON_QUESTIONS: readonly DiscoveryQuestion[] = [
  { id: "business_profile", prompt: "Ceritakan jenis usaha, produk atau layanan, pelanggan, dan cara operasional utama Anda.", answerType: "long_text", required: true, stage: "profile" },
  { id: "business_goal", prompt: "Hasil bisnis apa yang ingin dicapai?", answerType: "long_text", required: true, stage: "profile" },
  { id: "current_process", prompt: "Bagaimana proses berjalan saat ini?", answerType: "long_text", required: true, stage: "process" },
  { id: "pain_point", prompt: "Di bagian mana masalah paling sering terjadi?", answerType: "long_text", required: true, stage: "process" },
  { id: "data_availability", prompt: "Data apa yang sudah tersedia dan dalam bentuk apa?", answerType: "long_text", required: true, stage: "implementation" },
  { id: "reporting_needs", prompt: "Laporan atau informasi apa yang paling perlu dilihat pemilik usaha?", answerType: "long_text", required: true, stage: "implementation" },
  { id: "integration_needed", prompt: "Apakah solusi perlu terhubung dengan aplikasi atau layanan lain?", answerType: "single_select", required: true, options: ["Tidak untuk tahap awal", "Ya, perlu integrasi"], stage: "implementation" },
  { id: "integration_details", prompt: "Aplikasi atau layanan apa yang perlu dihubungkan?", answerType: "long_text", required: true, stage: "implementation", showWhen: { questionId: "integration_needed", equals: "Ya, perlu integrasi" } },
  { id: "target_timeline", prompt: "Kapan hasil pertama perlu digunakan?", answerType: "short_text", required: true, stage: "implementation" },
  { id: "budget_range", prompt: "Berapa rentang anggaran yang dipertimbangkan?", answerType: "short_text", required: false, stage: "implementation" },
];

const SERVICE_QUESTIONS: Readonly<Record<ServiceId, readonly DiscoveryQuestion[]>> = {
  "ai-employees": [
    { id: "repetitive_work", prompt: "Pekerjaan berulang apa yang paling menyita waktu tim?", answerType: "long_text", required: true, stage: "process" },
    { id: "human_approval", prompt: "Keputusan apa yang wajib tetap disetujui manusia?", answerType: "long_text", required: true, stage: "process" },
  ],
  automation: [
    { id: "handoff_count", prompt: "Berapa kali pekerjaan berpindah orang atau sistem?", answerType: "number", required: true, stage: "process" },
    { id: "systems", prompt: "Sistem atau aplikasi apa yang terlibat?", answerType: "long_text", required: true, stage: "process" },
  ],
  "business-apps": [
    { id: "current_tools", prompt: "Spreadsheet, chat, atau aplikasi apa yang digunakan saat ini?", answerType: "long_text", required: true, stage: "process" },
    { id: "user_count", prompt: "Berapa pengguna yang akan menggunakan aplikasi?", answerType: "number", required: true, stage: "implementation" },
  ],
  discovery: [
    { id: "decision_needed", prompt: "Keputusan apa yang harus dihasilkan dari fase Discovery?", answerType: "long_text", required: true, stage: "process" },
    { id: "stakeholders", prompt: "Siapa sponsor dan pemilik proses utama?", answerType: "long_text", required: true, stage: "implementation" },
  ],
};

export function getDiscoveryQuestionnaire(serviceId: ServiceId): DiscoveryQuestionnaire {
  return {
    version: "2026-08-18.2",
    serviceId,
    questions: [...COMMON_QUESTIONS, ...SERVICE_QUESTIONS[serviceId]],
  };
}

export function findMissingRequiredAnswers(
  questionnaire: DiscoveryQuestionnaire,
  answers: Readonly<Record<string, string | number | undefined>>,
): string[] {
  return questionnaire.questions
    .filter((question) => question.required)
    .filter((question) => !question.showWhen || String(answers[question.showWhen.questionId] ?? "") === question.showWhen.equals)
    .filter((question) => {
      const answer = answers[question.id];
      return answer === undefined || (typeof answer === "string" && answer.trim() === "");
    })
    .map((question) => question.id);
}
