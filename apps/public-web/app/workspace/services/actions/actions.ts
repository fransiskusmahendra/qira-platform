"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server";

const value=(form:FormData,name:string)=>String(form.get(name)??"").trim();
async function teamClient(){
 const supabase=await createClient();const {data:claims}=await supabase.auth.getClaims();if(!claims?.claims?.sub)redirect("/login");
 const {data}=await supabase.from("memberships").select("role").eq("status","active");
 if(!data?.some(item=>item.role==="qira_admin"||item.role==="qira_consultant"))redirect("/client");
 return supabase as any;
}
async function update(table:string,id:string,patch:Record<string,unknown>){
 const supabase=await teamClient();if(!id)redirect("/workspace/services/actions?error=invalid");
 const {error}=await supabase.from(table).update({...patch,updated_at:new Date().toISOString()}).eq("id",id);
 if(error)redirect("/workspace/services/actions?error=save");
 revalidatePath("/workspace/services");revalidatePath("/workspace/services/actions");
 redirect("/workspace/services/actions?saved=1");
}
export async function updateProjectStatus(form:FormData){
 const status=value(form,"status");if(!["onboarding","active","attention","maintenance","suspended","offboarded"].includes(status))redirect("/workspace/services/actions?error=invalid");
 await update("managed_projects",value(form,"id"),{service_status:status});
}
export async function updateDomainStatus(form:FormData){
 const status=value(form,"status");if(!["pending","active","expiring","expired","issue"].includes(status))redirect("/workspace/services/actions?error=invalid");
 await update("project_domains",value(form,"id"),{status});
}
export async function updateSubscriptionStatus(form:FormData){
 const status=value(form,"status");if(!["trial","active","past_due","paused","cancelled"].includes(status))redirect("/workspace/services/actions?error=invalid");
 await update("project_subscriptions",value(form,"id"),{status});
}
export async function updateTicketStatus(form:FormData){
 const status=value(form,"status");if(!["open","in_progress","waiting_customer","resolved","closed"].includes(status))redirect("/workspace/services/actions?error=invalid");
 await update("support_tickets",value(form,"id"),{status,resolved_at:["resolved","closed"].includes(status)?new Date().toISOString():null});
}
