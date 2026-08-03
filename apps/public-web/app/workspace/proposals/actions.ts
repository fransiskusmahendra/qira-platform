"use server";

import { calculateCommercialTerms } from "@qira/domain";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../../../lib/supabase/server";

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
  const issueDate = String(formData.get("issue_date") ?? "");
  const validUntil = String(formData.get("valid_until") ?? "");
  const packageId = String(formData.get("package_id") ?? "digital-foundation");
  if (!client || !recipient || !issueDate || !validUntil) redirect("/workspace/proposals/new?error=required");

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
    proposal_no: proposalNumber,
    client,
    recipient,
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

  revalidatePath("/workspace");
  revalidatePath(`/workspace/proposals/${proposalId}`);
  redirect(`/workspace/proposals/${proposalId}`);
}
