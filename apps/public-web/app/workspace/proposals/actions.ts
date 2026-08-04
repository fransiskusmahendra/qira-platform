"use server";

import { calculateCommercialTerms } from "@qira/domain";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../../../lib/supabase/server";
import { sendProposalSharedEmail } from "../../../lib/email/proposal-shared";

const QIRA_ROLES = new Set(["qira_consultant", "qira_admin"]);

async function getAuthorizedContext() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect("/login");

  const { data: memberships } = await supabase
    .from("memberships")
    .select("organization_id, role")
    .eq("status", "active");
  const membership = memberships?.find((item) => QIRA_ROLES.has(item.role));
  if (!membership) redirect("/workspace?error=permission");
  return { supabase, organizationId: membership.organization_id };
}

function numberField(formData: FormData, name: string, maximum = Number.MAX_SAFE_INTEGER) {
  const value = Number(formData.get(name));
  if (!Number.isFinite(value) || value < 0 || value > maximum) redirect("/workspace/proposals/new?error=commercial");
  return value;
}

export async function createProposal(formData: FormData) {
  const { supabase, organizationId } = await getAuthorizedContext();
  const client = String(formData.get("client_name") ?? "").trim();
  const recipient = String(formData.get("recipient_name") ?? "").trim();
  const recipientEmail = String(formData.get("recipient_email") ?? "").trim().toLowerCase();
  const issueDate = String(formData.get("issue_date") ?? "");
  const validUntil = String(formData.get("valid_until") ?? "");
  const packageId = String(formData.get("package_id") ?? "digital-foundation");
  const discoveryId = String(formData.get("discovery_id") ?? "");
  if (!client || !recipient || !recipientEmail || !issueDate || !validUntil || !discoveryId) redirect("/workspace/proposals/new?error=required");

  const terms = {
    packageId,
    basePriceIdr: numberField(formData, "base_price"),
    discountPercent: numberField(formData, "discount_percent", 100),
    taxPercent: numberField(formData, "tax_percent", 100),
    downPaymentPercent: numberField(formData, "down_payment_percent", 100),
  };
  calculateCommercialTerms(terms);

  const now = new Date();
  const proposalNumber = `PROP/QIRA/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${String(Date.now()).slice(-6)}`;
  const { data: proposalId, error } = await supabase.rpc("create_proposal", {
    target_organization_id: organizationId,
    source_discovery_id: discoveryId,
    proposal_no: proposalNumber,
    client,
    recipient,
    recipient_email_address: recipientEmail,
    issued_on: issueDate,
    valid_through: validUntil,
    terms,
  });
  if (error || !proposalId) redirect("/workspace/proposals/new?error=save");

  revalidatePath("/workspace");
  redirect(`/workspace/proposals/${proposalId}`);
}

export async function transitionProposal(formData: FormData) {
  const { supabase } = await getAuthorizedContext();
  const proposalId = String(formData.get("proposal_id") ?? "");
  const targetStatus = String(formData.get("target_status") ?? "");
  if (!proposalId || !["review", "approved", "shared"].includes(targetStatus)) redirect("/workspace");

  const { error } = await supabase.rpc("transition_proposal", {
    target_proposal_id: proposalId,
    target_status: targetStatus,
  });
  if (error) redirect(`/workspace/proposals/${proposalId}?error=transition`);

  let emailResult: "sent" | "failed" | null = null;
  if (targetStatus === "shared") {
    const { data: proposal } = await (supabase as any)
      .from("proposals")
      .select("id,organization_id,proposal_number,client_name,recipient_name,recipient_email")
      .eq("id", proposalId)
      .single();

    if (proposal?.recipient_email) {
      const { data: delivery, error: deliveryError } = await (supabase as any)
        .from("proposal_email_deliveries")
        .insert({
          organization_id: proposal.organization_id,
          proposal_id: proposal.id,
          recipient_email: proposal.recipient_email,
          status: "pending",
        })
        .select("id")
        .single();

      if (!deliveryError && delivery) {
        const result = await sendProposalSharedEmail({
          proposalId: proposal.id,
          proposalNumber: proposal.proposal_number,
          clientName: proposal.client_name,
          recipientName: proposal.recipient_name,
          recipientEmail: proposal.recipient_email,
        });
        emailResult = result.ok ? "sent" : "failed";
        await (supabase as any).from("proposal_email_deliveries").update({
          status: emailResult,
          provider_message_id: result.ok ? result.messageId : null,
          error_message: result.ok ? null : result.error.slice(0, 500),
          updated_at: new Date().toISOString(),
        }).eq("id", delivery.id);
      }
    }
  }

  revalidatePath("/workspace");
  revalidatePath(`/workspace/proposals/${proposalId}`);
  redirect(`/workspace/proposals/${proposalId}${emailResult ? `?email=${emailResult}` : ""}`);
}

export async function createProposalRevision(formData: FormData) {
  const { supabase } = await getAuthorizedContext();
  const proposalId = String(formData.get("proposal_id") ?? "");
  const destination = `/workspace/proposals/${encodeURIComponent(proposalId)}`;
  const validUntil = String(formData.get("valid_until") ?? "");
  if (!proposalId || !validUntil) redirect(`${destination}?error=revision`);

  const readNumber = (name: string, maximum = Number.MAX_SAFE_INTEGER) => {
    const value = Number(formData.get(name));
    if (!Number.isFinite(value) || value < 0 || value > maximum) redirect(`${destination}?error=revision`);
    return value;
  };
  const revisedTerms = {
    packageId: String(formData.get("package_id") ?? "custom"),
    basePriceIdr: readNumber("base_price"),
    discountPercent: readNumber("discount_percent", 100),
    taxPercent: readNumber("tax_percent", 100),
    downPaymentPercent: readNumber("down_payment_percent", 100),
  };
  calculateCommercialTerms(revisedTerms);

  const { error } = await (supabase as any).rpc("create_proposal_revision", {
    target_proposal_id: proposalId,
    revised_terms: revisedTerms,
    valid_through: validUntil,
  });
  if (error) redirect(`${destination}?error=revision`);

  revalidatePath("/workspace");
  revalidatePath(destination);
  revalidatePath(`/client/proposals/${proposalId}`);
  redirect(`${destination}?revision=1`);
}
