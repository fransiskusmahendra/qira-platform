"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "../../../lib/supabase/server";

const statuses=new Set(["new","contacted","discovery","demo","proposal","negotiation","won","lost","archived"]);

export async function updateLeadCrm(formData:FormData){
  const supabase=await createClient();
  const {data:claims}=await supabase.auth.getClaims();
  if(!claims?.claims?.sub) return;
  const {data:memberships}=await supabase.from("memberships").select("role").eq("status","active");
  if(!memberships?.some(item=>item.role==="qira_admin"||item.role==="qira_consultant")) return;
  const id=String(formData.get("lead_id")??"");
  const status=String(formData.get("status")??"new");
  if(!/^[0-9a-f-]{36}$/i.test(id)||!statuses.has(status)) return;
  const followUp=String(formData.get("next_follow_up_at")??"").trim();
  const notes=String(formData.get("internal_notes")??"").trim().slice(0,4000);
  await supabase.from("public_leads").update({
    status,
    next_follow_up_at:followUp?new Date(followUp).toISOString():null,
    last_contacted_at:status==="contacted"?new Date().toISOString():undefined,
    internal_notes:notes||null,
  } as any).eq("id",id);
  revalidatePath("/workspace/leads");
  revalidatePath("/workspace");
}
