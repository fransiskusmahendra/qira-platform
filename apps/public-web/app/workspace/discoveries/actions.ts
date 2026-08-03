"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../../../lib/supabase/server";

export async function transitionDiscovery(formData: FormData) {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) redirect("/login");

  const discoveryId = String(formData.get("discovery_id") ?? "");
  const targetStatus = String(formData.get("target_status") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (!discoveryId || !["approved", "draft"].includes(targetStatus)) redirect("/workspace");
  if (targetStatus === "draft" && !reason) redirect(`/workspace/discoveries/${discoveryId}?error=reason`);

  const { data: memberships } = await supabase.from("memberships").select("role").eq("status", "active");
  if (!memberships?.some(({ role }) => role === "qira_admin" || role === "qira_consultant")) {
    redirect(`/workspace/discoveries/${discoveryId}?error=permission`);
  }
  const { error } = await supabase.rpc("transition_discovery", {
    target_discovery_id: discoveryId,
    target_status: targetStatus,
    transition_reason: reason || null,
  });
  if (error) redirect(`/workspace/discoveries/${discoveryId}?error=transition`);

  revalidatePath("/workspace");
  revalidatePath(`/workspace/discoveries/${discoveryId}`);
  redirect(`/workspace/discoveries/${discoveryId}`);
}
