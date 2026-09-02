"use server";

import {
  calculateDiscoveryScores,
  classifyDiscoveryTriage,
  findMissingRequiredAnswers,
  getDiscoveryQuestionnaire,
  getPublicDiscoveryQuestionnaire,
  getBusinessBlueprint,
  businessBlueprintSnapshot,
  type ServiceId,
} from "@qira/domain";
import { redirect } from "next/navigation";

import { createAdminClient } from "../../lib/supabase/admin";
import { createClient } from "../../lib/supabase/server";
import { sendDiscoveryReviewEmail } from "../../lib/email/discovery-review";

const CONTACT_PHONE_PATTERN = /^[0-9+() -]{8,24}$/;
const CONTACT_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PUBLIC_SERVICE_IDS = new Set(["ai-employees", "automation", "business-apps", "discovery"]);

interface SubmitDiscoveryInput {
  serviceId: ServiceId;
  businessTypeId?: string;
  answers: Record<string, string | number | undefined>;
  assessment: { impact: number; readiness: number; complexity: number };
  consented: boolean;
}

export interface PublicDiscoverySubmissionInput extends SubmitDiscoveryInput {
  contact: {
    fullName: string;
    businessName: string;
    whatsapp: string;
    email: string;
  };
  website: string;
}

export interface PublicDiscoverySubmissionState {
  status: "idle" | "success" | "error";
  message: string;
  reference?: string;
}

function clean(value: string, maxLength: number) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function fallbackReference() {
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  return `QIRA-EMAIL-${stamp}`;
}

export async function submitPublicDiscovery(input: PublicDiscoverySubmissionInput): Promise<PublicDiscoverySubmissionState> {
  if (!input || !input.contact || !PUBLIC_SERVICE_IDS.has(input.serviceId)) {
    return { status: "error", message: "Jawaban belum terbaca dengan benar. Muat ulang halaman lalu coba kembali." };
  }
  if (clean(input.website, 200)) {
    return { status: "success", message: "Cerita Anda sudah diterima." };
  }

  const fullName = clean(input.contact.fullName, 100);
  const businessName = clean(input.contact.businessName, 160);
  const whatsapp = clean(input.contact.whatsapp, 24);
  const email = clean(input.contact.email, 254).toLowerCase();
  const validEmail = !email || CONTACT_EMAIL_PATTERN.test(email);
  const assessmentValues = Object.values(input.assessment ?? {});
  const validAssessment = assessmentValues.length === 3
    && assessmentValues.every((value) => Number.isInteger(value) && value >= 0 && value <= 5);
  if (fullName.length < 2 || businessName.length < 2 || !CONTACT_PHONE_PATTERN.test(whatsapp) || !validEmail || !validAssessment) {
    return { status: "error", message: "Mohon periksa nama, nama usaha, WhatsApp, dan email Anda." };
  }

  const questionnaire = getPublicDiscoveryQuestionnaire(input.serviceId);
  const blueprint = getBusinessBlueprint(input.businessTypeId);
  const missing = findMissingRequiredAnswers(questionnaire, input.answers);
  if (missing.length || !input.consented) {
    return { status: "error", message: missing.length
      ? `Masih ada ${missing.length} jawaban yang perlu dilengkapi sebelum dikirim.`
      : "Centang persetujuan sebelum mengirim cerita Anda." };
  }

  const scores = calculateDiscoveryScores({
    opportunity: { expectedImpact: input.assessment.impact },
    readiness: { selfAssessment: input.assessment.readiness },
    complexity: { selfAssessment: input.assessment.complexity },
  });
  const triage = classifyDiscoveryTriage({ serviceId: input.serviceId, answers: input.answers, assessment: input.assessment });
  const responses = {
    ...Object.fromEntries(Object.entries(input.answers).filter((entry): entry is [string, string | number] => entry[1] !== undefined)),
    _contact: { fullName, businessName, whatsapp, email: email || null },
    _assessment: input.assessment,
    _consent: { accepted: true, textVersion: "public-discovery-consent-v1", acceptedAt: new Date().toISOString() },
    _questionnaire: { serviceId: input.serviceId, version: questionnaire.version, businessTypeId: blueprint?.id ?? null },
    _businessBlueprint: blueprint ? businessBlueprintSnapshot(blueprint) : null,
    _triage: {
      level: triage.level,
      label: triage.label,
      reasons: [...triage.reasons],
      requiresAdminReview: triage.requiresAdminReview,
      rulesetVersion: triage.rulesetVersion,
    },
  };

  const configuredRecipients = (process.env.QIRA_ADMIN_NOTIFICATION_EMAILS ?? process.env.QIRA_REPLY_TO ?? "hello@qirasolution.com")
    .split(",")
    .map((recipient) => recipient.trim().toLowerCase())
    .filter((recipient) => CONTACT_EMAIL_PATTERN.test(recipient));
  const contact = { fullName, businessName, whatsapp, email: email || null };

  async function sendFallbackEmail(reason: string): Promise<PublicDiscoverySubmissionState> {
    const reference = fallbackReference();
    const emailResult = await sendDiscoveryReviewEmail({
      discoveryId: reference,
      reference,
      persisted: false,
      recipients: configuredRecipients,
      triage,
      serviceId: input.serviceId,
      contact,
      answers: input.answers,
    });
    if (emailResult.ok) {
      console.warn("public_discovery_delivered_by_email", { reason, reference });
      return {
        status: "success",
        reference,
        message: "Cerita Anda sudah diterima tim QIRA melalui email.",
      };
    }
    console.error("public_discovery_fallback_email_failed", { reason, emailError: emailResult.error });
    return {
      status: "error",
      message: "Cerita belum berhasil dikirim. Jawaban Anda masih tersimpan di perangkat ini; silakan coba lagi atau hubungi QIRA.",
    };
  }

  let supabase: ReturnType<typeof createAdminClient>;
  let data: { discovery_id: string; reference: string }[] | null = null;
  let error: { code?: string; message?: string } | null = null;
  try {
    supabase = createAdminClient();
    const result = await supabase.rpc("submit_public_discovery", {
      p_full_name: fullName,
      p_business_name: businessName,
      p_whatsapp: whatsapp,
      p_email: email || null,
      p_service_id: input.serviceId,
      p_responses: responses,
      p_scores: scores.map((score) => ({ ...score, factors: { ...score.factors } })),
    });
    data = result.data;
    error = result.error;
  } catch (submissionError) {
    console.error("public_discovery_submission_exception", {
      message: submissionError instanceof Error ? submissionError.message : "unknown",
    });
    return sendFallbackEmail("database_exception");
  }
  if (error || !data?.[0]) {
    console.error("public_discovery_submission_failed", { code: error?.code });
    const duplicate = error?.message?.includes("submitted recently");
    if (!duplicate) return sendFallbackEmail(`database_${error?.code ?? "unknown"}`);
    return { status: "error", message: "Cerita dengan nomor ini baru saja dikirim. Tim QIRA sudah menerimanya." };
  }

  try {
    const { data: memberships } = await supabase
      .from("memberships")
      .select("user_id")
      .eq("role", "qira_admin")
      .eq("status", "active");
    const adminIds = new Set((memberships ?? []).map((membership) => membership.user_id));
    const { data: authUsers, error: usersError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (usersError) console.error("discovery_admin_recipient_lookup_failed", { code: usersError.code });
    const membershipRecipients = (authUsers?.users ?? [])
      .filter((user) => adminIds.has(user.id) && user.email)
      .map((user) => user.email!.toLowerCase());
    const recipients = [...new Set([...configuredRecipients, ...membershipRecipients])];
    const emailResult = await sendDiscoveryReviewEmail({
      discoveryId: data[0].discovery_id,
      reference: data[0].reference,
      persisted: true,
      recipients,
      triage,
      serviceId: input.serviceId,
      contact,
      answers: input.answers,
    });
    if (!emailResult.ok) console.error("discovery_review_email_failed", { reason: emailResult.error });
  } catch (notificationError) {
    console.error("discovery_review_notification_failed", {
      message: notificationError instanceof Error ? notificationError.message : "unknown",
    });
  }

  return {
    status: "success",
    reference: data[0].reference,
    message: "Cerita Anda sudah tersimpan. QIRA sedang menyiapkan ringkasannya.",
  };
}

export async function submitDiscovery(input: SubmitDiscoveryInput) {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) redirect("/login?next=/discovery");

  const questionnaire = getDiscoveryQuestionnaire(input.serviceId);
  const missing = findMissingRequiredAnswers(questionnaire, input.answers);
  if (missing.length || !input.consented) redirect("/discovery?error=incomplete");

  const { data: memberships } = await supabase
    .from("memberships")
    .select("organization_id, role")
    .eq("status", "active");
  const membership = memberships?.find(({ role }) => role === "qira_admin" || role === "qira_consultant");
  const organizationId = membership?.organization_id;
  if (!organizationId) redirect("/workspace?error=membership");

  const scores = calculateDiscoveryScores({
    opportunity: { expectedImpact: input.assessment.impact },
    readiness: { selfAssessment: input.assessment.readiness },
    complexity: { selfAssessment: input.assessment.complexity },
  });
  const responses = {
    ...Object.fromEntries(Object.entries(input.answers).filter((entry): entry is [string, string | number] => entry[1] !== undefined)),
    _assessment: input.assessment,
    _consent: { accepted: true, textVersion: "discovery-consent-v1", acceptedAt: new Date().toISOString() },
    _questionnaire: { serviceId: input.serviceId, version: questionnaire.version },
  };
  const { data: saved, error: saveError } = await supabase.rpc("save_discovery_draft", {
    target_organization_id: organizationId,
    target_discovery_id: null,
    selected_service_ids: [input.serviceId],
    response_payload: responses,
    score_payload: scores.map((score) => ({ ...score, factors: { ...score.factors } })),
  });
  const discovery = saved?.[0];
  if (saveError || !discovery) redirect("/discovery?error=save");

  const { error: submitError } = await supabase.rpc("transition_discovery", {
    target_discovery_id: discovery.id,
    target_status: "submitted",
    transition_reason: null,
  });
  if (submitError) redirect(`/workspace/discoveries/${discovery.id}?error=submit`);
  redirect(`/workspace/discoveries/${discovery.id}`);
}
