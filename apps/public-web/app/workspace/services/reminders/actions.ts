"use server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {createClient} from "../../../../lib/supabase/server";

export async function updateReminder(formData:FormData){
 const id=String(formData.get("id")??""),status=String(formData.get("status")??"");
 if(!id||!["resolved","dismissed"].includes(status))redirect("/workspace/services/reminders?error=invalid");
 const supabase=await createClient();const {data:claims}=await supabase.auth.getClaims();if(!claims?.claims?.sub)redirect("/login");
 const membership=await supabase.from("memberships").select("role").eq("status","active");
 if(!membership.data?.some(x=>x.role==="qira_admin"||x.role==="qira_consultant"))redirect("/client");
 const {error}=await (supabase as any).from("service_reminders").update({status,resolved_at:status==="resolved"?new Date().toISOString():null,updated_at:new Date().toISOString()}).eq("id",id);
 if(error)redirect("/workspace/services/reminders?error=save");
 revalidatePath("/workspace/services/reminders");redirect("/workspace/services/reminders?saved=1");
}
