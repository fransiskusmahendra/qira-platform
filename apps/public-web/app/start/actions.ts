"use server";

import { createClient } from "../../lib/supabase/server";

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
  });

  if (error) {
    console.error("public_lead_insert_failed", { code: error.code });
    return { status: "error", message: "Belum berhasil dikirim. Silakan coba lagi." };
  }

  return { status: "success", message: "QIRA akan menghubungi Anda melalui WhatsApp." };
}
