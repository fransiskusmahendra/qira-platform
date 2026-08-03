import type { ServiceId } from "./index.ts";

export type DiscoveryAnswerType = "short_text" | "long_text" | "single_select" | "number";

export interface DiscoveryQuestion {
  id: string;
  prompt: string;
  answerType: DiscoveryAnswerType;
  required: boolean;
  options?: readonly string[];
}

export interface DiscoveryQuestionnaire {
  version: string;
  serviceId: ServiceId;
  questions: readonly DiscoveryQuestion[];
}

const COMMON_QUESTIONS: readonly DiscoveryQuestion[] = [
  { id: "business_goal", prompt: "Hasil bisnis apa yang ingin dicapai?", answerType: "long_text", required: true },
  { id: "current_process", prompt: "Bagaimana proses berjalan saat ini?", answerType: "long_text", required: true },
  { id: "pain_point", prompt: "Di bagian mana masalah paling sering terjadi?", answerType: "long_text", required: true },
  { id: "target_timeline", prompt: "Kapan hasil pertama perlu digunakan?", answerType: "short_text", required: true },
  { id: "budget_range", prompt: "Berapa rentang anggaran yang dipertimbangkan?", answerType: "short_text", required: false },
];

const SERVICE_QUESTIONS: Readonly<Record<ServiceId, readonly DiscoveryQuestion[]>> = {
  "ai-employees": [
    { id: "repetitive_work", prompt: "Pekerjaan berulang apa yang paling menyita waktu tim?", answerType: "long_text", required: true },
    { id: "human_approval", prompt: "Keputusan apa yang wajib tetap disetujui manusia?", answerType: "long_text", required: true },
  ],
  automation: [
    { id: "handoff_count", prompt: "Berapa kali pekerjaan berpindah orang atau sistem?", answerType: "number", required: true },
    { id: "systems", prompt: "Sistem atau aplikasi apa yang terlibat?", answerType: "long_text", required: true },
  ],
  "business-apps": [
    { id: "current_tools", prompt: "Spreadsheet, chat, atau aplikasi apa yang digunakan saat ini?", answerType: "long_text", required: true },
    { id: "user_count", prompt: "Berapa pengguna yang akan menggunakan aplikasi?", answerType: "number", required: true },
  ],
  discovery: [
    { id: "decision_needed", prompt: "Keputusan apa yang harus dihasilkan dari fase Discovery?", answerType: "long_text", required: true },
    { id: "stakeholders", prompt: "Siapa sponsor dan pemilik proses utama?", answerType: "long_text", required: true },
  ],
};

export function getDiscoveryQuestionnaire(serviceId: ServiceId): DiscoveryQuestionnaire {
  return {
    version: "2026-08-03.1",
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
    .filter((question) => {
      const answer = answers[question.id];
      return answer === undefined || (typeof answer === "string" && answer.trim() === "");
    })
    .map((question) => question.id);
}

