"use server";

import {
  calculateDiscoveryScores,
  findMissingRequiredAnswers,
  getDiscoveryQuestionnaire,
  type ServiceId,
} from "@qira/domain";
import { redirect } from "next/navigation";

import { createClient } from "../../lib/supabase/server";

interface SubmitDiscoveryInput {
  serviceId: ServiceId;
  answers: Record<string, string | number | undefined>;
  assessment: { impact: number; readiness: number; complexity: number };
  consented: boolean;
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
