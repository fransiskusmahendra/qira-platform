"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { sendProposalDecisionEmail } from "../../../../lib/email/proposal-decision";
import { createClient } from "../../../../lib/supabase/server";

export async function decideProposal(formData: FormData) {
  const proposalId = String(formData.get("proposal_id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const comment = String(formData.get("comment") ?? "").trim();
  const path = `/client/proposals/${encodeURIComponent(proposalId)}`;

  if (!proposalId || !["accepted", "revision_requested"].includes(decision)) {
    redirect(`${path}?error=invalid`);
  }
  if (decision === "revision_requested" && !comment) {
    redirect(`${path}?error=comment`);
  }

  const supabase: any = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const actorId = claimsData?.claims?.sub;
  if (!actorId) redirect(`/login?next=${encodeURIComponent(path)}`);

  const { data: proposal } = await supabase
    .from("proposals")
    .select("id,organization_id,proposal_number,client_name,version,status")
    .eq("id", proposalId)
    .eq("status", "shared")
    .maybeSingle();
  if (!proposal) redirect(`${path}?error=unavailable`);

  const { error } = await supabase.from("proposal_client_decisions").insert({
    proposal_id: proposal.id,
    organization_id: proposal.organization_id,
    proposal_version: proposal.version,
    decision,
    comment: comment || null,
    decided_by: actorId,
  });
  if (error) redirect(`${path}?error=save`);

  try {
    const emailResult = await sendProposalDecisionEmail({
      proposalId: proposal.id,
      proposalNumber: proposal.proposal_number,
      clientName: proposal.client_name,
      proposalVersion: proposal.version,
      decision: decision as "accepted" | "revision_requested",
      comment: comment || null,
    });
    if (!emailResult.ok) console.error("proposal_decision_email_failed", { reason: emailResult.error });
  } catch (notificationError) {
    console.error("proposal_decision_notification_exception", {
      message: notificationError instanceof Error ? notificationError.message : "unknown",
    });
  }

  revalidatePath(path);
  revalidatePath(`/workspace/proposals/${proposalId}`);
  revalidatePath("/workspace");
  redirect(`${path}?saved=1`);
}
