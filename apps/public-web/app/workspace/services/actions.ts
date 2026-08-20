"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";

const choices = {
  customerType: new Set(["umkm", "company", "enterprise"]),
  packageId: new Set(["digital-foundation", "growth-engine", "connected-growth", "custom"]),
  managementModel: new Set(["qira_managed", "customer_managed", "hybrid"]),
};

export async function onboardCustomer(formData: FormData) {
  const value = (name: string) => String(formData.get(name) ?? "").trim();
  const customerName = value("customerName");
  const projectName = value("projectName");
  const customerType = value("customerType");
  const packageId = value("packageId");
  const managementModel = value("managementModel");
  const monthlyAmount = Number(value("monthlyAmount") || 0);
  const agreementConfirmed = formData.get("agreementConfirmed") === "on";
  const startPaymentConfirmed = formData.get("startPaymentConfirmed") === "on";
  const leadId = value("leadId");

  if (
    customerName.length < 2 || projectName.length < 2 ||
    !choices.customerType.has(customerType) || !choices.packageId.has(packageId) ||
    !choices.managementModel.has(managementModel) || !Number.isSafeInteger(monthlyAmount) || monthlyAmount < 0 ||
    !agreementConfirmed || !startPaymentConfirmed ||
    (leadId && !/^[0-9a-f-]{36}$/i.test(leadId))
  ) {
    redirect("/workspace/services/onboard?error=invalid");
  }

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/login");

  const { data: projectId, error } = await (supabase as any).rpc("onboard_managed_customer", {
    p_customer_name: customerName,
    p_customer_type: customerType,
    p_contact_name: value("contactName"),
    p_contact_email: value("contactEmail"),
    p_contact_whatsapp: value("contactWhatsapp"),
    p_project_name: projectName,
    p_package_id: packageId,
    p_management_model: managementModel,
    p_monthly_amount_idr: monthlyAmount,
  });
  if (error || !projectId) redirect("/workspace/services/onboard?error=save");

  const startedNote = "Syarat mulai dikonfirmasi: kebutuhan/hasil/waktu/harga disepakati dan pembayaran awal sudah diterima atau pengecualiannya disepakati secara tertulis.";
  await (supabase as any).from("managed_projects").update({ notes: startedNote }).eq("id", projectId);

  const { data: project } = await (supabase as any).from("managed_projects").select("customer_id").eq("id", projectId).maybeSingle();

  if (leadId) {
    const { data: lead } = await (supabase as any).from("public_leads").select("internal_notes").eq("id", leadId).maybeSingle();
    const dateLabel = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "medium" }).format(new Date());
    const dealNote = `[${dateLabel}] Deal dikonfirmasi dan onboarding project dimulai. Syarat kesepakatan serta pembayaran awal telah dikonfirmasi.`;
    const notes = [lead?.internal_notes, dealNote].filter(Boolean).join("\n\n").slice(0, 4000);
    await (supabase as any).from("public_leads").update({
      status: "won",
      next_follow_up_at: null,
      internal_notes: notes,
    }).eq("id", leadId);
  }

  revalidatePath("/workspace/services");
  revalidatePath("/workspace/leads");
  revalidatePath("/workspace");

  if (project?.customer_id) redirect(`/workspace/services/customers/${project.customer_id}?onboarded=1`);
  redirect("/workspace/services?onboarded=1");
}
