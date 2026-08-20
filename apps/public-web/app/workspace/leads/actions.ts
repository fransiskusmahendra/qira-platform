"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../../lib/supabase/server";

const statuses = new Set(["new", "contacted", "discovery", "demo", "proposal", "negotiation", "won", "lost", "archived"]);
const terminalStatuses = new Set(["won", "lost", "archived"]);

function parseWibDateTime(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(`${value}:00+07:00`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export async function updateLeadCrm(formData: FormData) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return;

  const { data: memberships } = await supabase.from("memberships").select("role").eq("status", "active");
  if (!memberships?.some((item) => item.role === "qira_admin" || item.role === "qira_consultant")) return;

  const id = String(formData.get("lead_id") ?? "");
  const status = String(formData.get("status") ?? "new");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !statuses.has(status)) return;

  const followUp = String(formData.get("next_follow_up_at") ?? "").trim();
  const notes = String(formData.get("internal_notes") ?? "").trim().slice(0, 4000);
  const parsedFollowUp = followUp ? parseWibDateTime(followUp) : null;
  if (followUp && !parsedFollowUp) return;

  const { data: current } = await supabase.from("public_leads").select("status,last_contacted_at").eq("id", id).maybeSingle();
  if (!current) return;

  const update: Record<string, unknown> = {
    status,
    next_follow_up_at: terminalStatuses.has(status) ? null : parsedFollowUp,
    internal_notes: notes || null,
  };

  if (status === "contacted" && current.status !== "contacted") {
    update.last_contacted_at = new Date().toISOString();
  }

  await supabase.from("public_leads").update(update as never).eq("id", id);
  revalidatePath("/workspace/leads");
  revalidatePath("/workspace");
}
