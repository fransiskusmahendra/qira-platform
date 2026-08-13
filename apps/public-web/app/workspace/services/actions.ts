"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";

const choices = {
  customerType: new Set(["umkm","company","enterprise"]),
  packageId: new Set(["digital-foundation","growth-engine","connected-growth","custom"]),
  managementModel: new Set(["qira_managed","customer_managed","hybrid"]),
};

export async function onboardCustomer(formData: FormData) {
  const value=(name:string)=>String(formData.get(name)??"").trim();
  const customerName=value("customerName");
  const projectName=value("projectName");
  const customerType=value("customerType");
  const packageId=value("packageId");
  const managementModel=value("managementModel");
  const monthlyAmount=Number(value("monthlyAmount")||0);

  if(customerName.length<2||projectName.length<2||!choices.customerType.has(customerType)||!choices.packageId.has(packageId)||!choices.managementModel.has(managementModel)||!Number.isSafeInteger(monthlyAmount)||monthlyAmount<0) {
    redirect("/workspace/services/onboard?error=invalid");
  }

  const supabase=await createClient();
  const {data:claims}=await supabase.auth.getClaims();
  if(!claims?.claims?.sub) redirect("/login");

  const {error}=await (supabase as any).rpc("onboard_managed_customer",{
    p_customer_name:customerName,
    p_customer_type:customerType,
    p_contact_name:value("contactName"),
    p_contact_email:value("contactEmail"),
    p_contact_whatsapp:value("contactWhatsapp"),
    p_project_name:projectName,
    p_package_id:packageId,
    p_management_model:managementModel,
    p_monthly_amount_idr:monthlyAmount,
  });
  if(error) redirect("/workspace/services/onboard?error=save");

  revalidatePath("/workspace/services");
  redirect("/workspace/services?onboarded=1");
}
