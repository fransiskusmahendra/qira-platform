"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server";

const value=(form:FormData,name:string)=>String(form.get(name)??"").trim();
async function teamClient(){
 const supabase=await createClient();const {data:claims}=await supabase.auth.getClaims();if(!claims?.claims?.sub)redirect("/login");
 const {data}=await supabase.from("memberships").select("role").eq("user_id",String(claims.claims.sub)).eq("status","active");
 if(!data?.some(item=>item.role==="qira_admin"||item.role==="qira_consultant"))redirect("/client");
 return supabase as any;
}
async function update(table:string,id:string,patch:Record<string,unknown>){
 const supabase=await teamClient();if(!id)redirect("/workspace/services/actions?error=invalid");
 const {error}=await supabase.from(table).update({...patch,updated_at:new Date().toISOString()}).eq("id",id);
 if(error)redirect("/workspace/services/actions?error=save");
 revalidatePath("/workspace/services");revalidatePath("/workspace/services/actions");revalidatePath("/workspace/services/health");revalidatePath("/workspace/services/reminders");
 redirect("/workspace/services/actions?saved=1");
}
export async function updateProjectStatus(form:FormData){
 const status=value(form,"status"),id=value(form,"id");if(!["onboarding","active","attention","maintenance","suspended","offboarded"].includes(status))redirect("/workspace/services/actions?error=invalid");
 if(status==="active"){
  const supabase=await teamClient();if(!id)redirect("/workspace/services/actions?error=invalid");
  const [{data:project},{data:deployments},{data:domains},{data:subscriptions}]=await Promise.all([
   supabase.from("managed_projects").select("id,customer_id,service_status,next_review_on").eq("id",id).single(),
   supabase.from("project_deployments").select("id,status,deployment_url").eq("project_id",id),
   supabase.from("project_domains").select("id,status,hostname").eq("project_id",id),
   supabase.from("project_subscriptions").select("id,status").eq("project_id",id),
  ]);
  const readyDeployment=(deployments??[]).find((x:any)=>x.status==="ready");
  const activeDomain=(domains??[]).find((x:any)=>x.status==="active");
  const deploymentReady=Boolean(readyDeployment);
  const domainReady=!(domains??[]).length||Boolean(activeDomain);
  const subscriptionReady=!(subscriptions??[]).length||(subscriptions??[]).some((x:any)=>x.status==="active"||x.status==="trial");
  if(!deploymentReady||!domainReady||!subscriptionReady)redirect(`/workspace/services/actions?error=readiness&project=${id}`);
  const nextReview=new Date();nextReview.setDate(nextReview.getDate()+30);
  const productionUrl=activeDomain?`https://${activeDomain.hostname}`:readyDeployment?.deployment_url||null;
  const {error}=await supabase.from("managed_projects").update({service_status:"active",production_url:productionUrl,next_review_on:project?.next_review_on??nextReview.toISOString().slice(0,10),updated_at:new Date().toISOString()}).eq("id",id);
  if(error)redirect("/workspace/services/actions?error=save");
  if(project?.customer_id) await supabase.from("customers").update({lifecycle_status:"active",updated_at:new Date().toISOString()}).eq("id",project.customer_id);
  revalidatePath("/workspace/services");revalidatePath("/workspace/services/actions");revalidatePath("/workspace/services/health");revalidatePath("/workspace/services/reminders");
  redirect("/workspace/services/actions?saved=go-live");
 }
 await update("managed_projects",id,{service_status:status});
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
export async function updateDeploymentStatus(form:FormData){
 const status=value(form,"status");if(!["queued","building","ready","error","cancelled","unknown"].includes(status))redirect("/workspace/services/actions?error=invalid");
 const supabase=await teamClient();const id=value(form,"id");if(!id)redirect("/workspace/services/actions?error=invalid");
 const {error}=await supabase.from("project_deployments").update({status,checked_at:new Date().toISOString(),deployed_at:status==="ready"?new Date().toISOString():null}).eq("id",id);
 if(error)redirect("/workspace/services/actions?error=save");revalidatePath("/workspace/services");revalidatePath("/workspace/services/actions");revalidatePath("/workspace/services/health");redirect("/workspace/services/actions?saved=1");
}
