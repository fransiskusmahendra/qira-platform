"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
export async function markNotificationRead(formData:FormData){
  const id=String(formData.get("notification_id")??""); if(!id)redirect("/workspace");
  const s:any=await createClient(); const {data:c}=await s.auth.getClaims(); if(!c?.claims?.sub)redirect("/login");
  const {error}=await s.from("notifications").update({read_at:new Date().toISOString()}).eq("id",id).is("read_at",null);
  if(error)redirect("/workspace?error=notification"); revalidatePath("/workspace"); redirect("/workspace");
}
