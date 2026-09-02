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
  { id: "business_profile", prompt: "Usaha Anda bergerak di bidang apa, dan biasanya melayani siapa?", answerType: "long_text", required: true, stage: "profile" },
  { id: "business_goal", prompt: "Kalau satu hal bisa jadi lebih mudah, apa yang paling Anda inginkan?", answerType: "long_text", required: true, stage: "profile" },
  { id: "current_process", prompt: "Ceritakan singkat bagaimana pekerjaan ini dilakukan sekarang.", answerType: "long_text", required: true, stage: "process" },
  { id: "pain_point", prompt: "Bagian mana yang paling sering bikin repot, terlambat, atau salah?", answerType: "long_text", required: true, stage: "process" },
  { id: "data_availability", prompt: "Catatan apa yang sudah Anda punya? Misalnya Excel, buku, WhatsApp, atau belum ada.", answerType: "long_text", required: true, stage: "implementation" },
  { id: "reporting_needs", prompt: "Hal apa yang paling ingin Anda lihat dengan cepat setiap hari?", answerType: "long_text", required: true, stage: "implementation" },
  { id: "integration_needed", prompt: "Apakah ada aplikasi lain yang tetap ingin dipakai bersama QIRA?", answerType: "single_select", required: true, options: ["Tidak, cukup QIRA dulu", "Ya, ada aplikasi lain"], stage: "implementation" },
  { id: "integration_details", prompt: "Aplikasi apa yang ingin tetap dipakai?", answerType: "long_text", required: true, stage: "implementation", showWhen: { questionId: "integration_needed", equals: "Ya, ada aplikasi lain" } },
  { id: "target_timeline", prompt: "Kapan Anda ingin mulai mencoba hasil pertamanya?", answerType: "short_text", required: true, stage: "implementation" },
  { id: "budget_range", prompt: "Kalau sudah ada gambaran, kisaran biaya yang nyaman berapa?", answerType: "short_text", required: false, stage: "implementation" },
  { id: "qira_care_interest", prompt: "Setelah selesai, apakah Anda ingin QIRA tetap membantu jika ada kendala atau perubahan kecil?", answerType: "single_select", required: true, options: ["Ya, saya ingin dibantu", "Mungkin, jelaskan dulu", "Belum perlu"], stage: "implementation" },
];

const SERVICE_QUESTIONS: Readonly<Record<ServiceId, readonly DiscoveryQuestion[]>> = {
  "ai-employees": [
    { id: "repetitive_work", prompt: "Pekerjaan apa yang berulang hampir setiap hari atau setiap minggu?", answerType: "long_text", required: true, stage: "process" },
    { id: "human_approval", prompt: "Bagian apa yang tetap harus diputuskan oleh Anda atau tim?", answerType: "long_text", required: true, stage: "process" },
  ],
  automation: [
    { id: "handoff_count", prompt: "Biasanya pekerjaan ini berpindah ke berapa orang sebelum selesai?", answerType: "number", required: true, stage: "process" },
    { id: "systems", prompt: "Aplikasi apa saja yang sekarang dipakai sepanjang pekerjaan ini?", answerType: "long_text", required: true, stage: "process" },
  ],
  "business-apps": [
    { id: "current_tools", prompt: "Sekarang pekerjaan ini dicatat di mana?", answerType: "long_text", required: true, stage: "process" },
    { id: "user_count", prompt: "Kira-kira berapa orang yang akan memakainya?", answerType: "number", required: true, stage: "implementation" },
  ],
  discovery: [
    { id: "decision_needed", prompt: "Setelah pembahasan ini, keputusan apa yang ingin lebih mudah Anda ambil?", answerType: "long_text", required: true, stage: "process" },
    { id: "stakeholders", prompt: "Siapa saja yang perlu ikut memberi masukan?", answerType: "long_text", required: true, stage: "implementation" },
  ],
};

const PUBLIC_QUESTIONS: readonly DiscoveryQuestion[] = [
  { id: "business_profile", prompt: "Usahamu bergerak di bidang apa?", answerType: "long_text", required: true, stage: "profile" },
  { id: "current_process", prompt: "Bagian apa yang paling merepotkan sekarang?", answerType: "long_text", required: true, stage: "process" },
  { id: "business_goal", prompt: "Hasil apa yang paling ingin terasa?", answerType: "long_text", required: true, stage: "profile" },
  { id: "target_timeline", prompt: "Kapan ingin mulai?", answerType: "single_select", required: true, options: ["Secepatnya", "1–2 bulan", "Masih mencari arah"], stage: "implementation" },
];

export function getDiscoveryQuestionnaire(serviceId: ServiceId): DiscoveryQuestionnaire {
  return {
    version: "2026-08-19.1",
    serviceId,
    questions: [...COMMON_QUESTIONS, ...SERVICE_QUESTIONS[serviceId]],
  };
}

export function getPublicDiscoveryQuestionnaire(serviceId: ServiceId): DiscoveryQuestionnaire {
  return {
    version: "2026-09-02.public.2",
    serviceId,
    questions: PUBLIC_QUESTIONS,
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
