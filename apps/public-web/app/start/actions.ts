"use server";

import { createAdminClient } from "../../lib/supabase/admin";
import { createClient } from "../../lib/supabase/server";
import { sendLeadReceivedEmail } from "../../lib/email/lead-received";

export interface LeadFormState {
  status: "idle" | "success" | "error";
  message: string;
}

const packageIds = new Set(["digital-foundation", "growth-engine", "connected-growth", "custom"]);

function value(formData: FormData, key: string, max: number) {
  return String(formData.get(key) ?? "").trim().slice(0, max);
}

export async function submitPublicLead(_: LeadFormState, formData: FormData): Promise<LeadFormState> {
  if (value(formData, "website", 200)) return { status: "success", message: "Terima kasih. Kebutuhan Anda sudah diterima." };

  const fullName = value(formData, "fullName", 100);
  const businessName = value(formData, "businessName", 160);
  const whatsapp = value(formData, "whatsapp", 24);
  const email = value(formData, "email", 254);
  const rawPackage = value(formData, "packageInterest", 40);
  const packageInterest = packageIds.has(rawPackage) ? rawPackage : "custom";
  const businessNeed = value(formData, "businessNeed", 2000);
  const consented = formData.get("consented") === "on";

  if (fullName.length < 2 || businessName.length < 2 || !/^[0-9+() -]{8,24}$/.test(whatsapp) || businessNeed.length < 20 || !consented) {
    return { status: "error", message: "Lengkapi nama, usaha, WhatsApp, kebutuhan, dan persetujuan." };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Format email belum valid." };
  }

  let admin: any = null;
  try {
    admin = createAdminClient();
    const duplicateSince = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { data: duplicate } = await admin
      .from("public_leads")
      .select("id")
      .eq("whatsapp", whatsapp)
      .gte("created_at", duplicateSince)
      .limit(1);
    if (duplicate?.length) return { status: "success", message: "QIRA akan menghubungi Anda melalui WhatsApp." };
  } catch (error) {
    console.warn("public_lead_duplicate_check_skipped", { message: error instanceof Error ? error.message : "unknown" });
  }

  const nextFollowUp = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const supabase = await createClient();
  const { error } = await supabase.from("public_leads").insert({
    full_name: fullName,
    business_name: businessName,
    whatsapp,
    email: email || null,
    package_interest: packageInterest,
    business_need: businessNeed,
    budget_range: "Belum ditentukan",
    lead_temperature: "warm",
    source: "website",
    status: "new",
    consented_at: new Date().toISOString(),
    next_follow_up_at: nextFollowUp,
  });

  if (error) {
    console.error("public_lead_insert_failed", { code: error.code });
    return { status: "error", message: "Belum berhasil dikirim. Silakan coba lagi." };
  }

  try {
    admin ??= createAdminClient();
    const { data: memberships } = await admin
      .from("memberships")
      .select("organization_id")
      .eq("status", "active")
      .in("role", ["qira_admin", "qira_consultant"]);
    const organizationIds = [...new Set((memberships ?? []).map((item: any) => String(item.organization_id)))];
    const reference = crypto.randomUUID();
    if (organizationIds.length) {
      const notifications = organizationIds.map((organizationId) => ({
        organization_id: organizationId,
        proposal_id: null,
        kind: "lead_new",
        title: `Lead baru: ${businessName}`,
        body: `${fullName} · ${whatsapp}`,
        email_status: "unconfigured",
        dedupe_key: `lead-new:${organizationId}:${reference}`,
      }));
      const { error: notificationError } = await admin.from("notifications").insert(notifications);
      if (notificationError) console.error("public_lead_notification_failed", { code: notificationError.code });
    }

    const emailResult = await sendLeadReceivedEmail({
      fullName,
      businessName,
      whatsapp,
      email: email || null,
      businessNeed,
    });
    if (!emailResult.ok) console.error("public_lead_email_failed", { reason: emailResult.error });
  } catch (notificationError) {
    console.error("public_lead_post_submit_notification_failed", {
      message: notificationError instanceof Error ? notificationError.message : "unknown",
    });
  }

  return { status: "success", message: "QIRA akan menghubungi Anda melalui WhatsApp." };
}
