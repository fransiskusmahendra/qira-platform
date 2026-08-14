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
function refresh(){revalidatePath("/workspace/services");revalidatePath("/workspace/services/actions");revalidatePath("/workspace/services/health");revalidatePath("/workspace/services/reminders");}
async function update(table:string,id:string,patch:Record<string,unknown>){
 const supabase=await teamClient();if(!id)redirect("/workspace/services/actions?error=invalid");
 const {error}=await supabase.from(table).update({...patch,updated_at:new Date().toISOString()}).eq("id",id);
 if(error)redirect("/workspace/services/actions?error=save");refresh();redirect("/workspace/services/actions?saved=1");
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
  const readyDeployment=(deployments??[]).find((x:any)=>x.status==="ready"),activeDomain=(domains??[]).find((x:any)=>x.status==="active");
  if(!readyDeployment||((domains??[]).length&&!activeDomain)||((subscriptions??[]).length&&!(subscriptions??[]).some((x:any)=>x.status==="active"||x.status==="trial")))redirect(`/workspace/services/actions?error=readiness&project=${id}`);
  const nextReview=new Date();nextReview.setDate(nextReview.getDate()+30);const productionUrl=activeDomain?`https://${activeDomain.hostname}`:readyDeployment.deployment_url||null;
  const {error}=await supabase.from("managed_projects").update({service_status:"active",production_url:productionUrl,next_review_on:project?.next_review_on??nextReview.toISOString().slice(0,10),updated_at:new Date().toISOString()}).eq("id",id);
  if(error)redirect("/workspace/services/actions?error=save");if(project?.customer_id)await supabase.from("customers").update({lifecycle_status:"active",updated_at:new Date().toISOString()}).eq("id",project.customer_id);
  refresh();redirect("/workspace/services/actions?saved=go-live");
 }
 await update("managed_projects",id,{service_status:status});
}
export async function updateDomainStatus(form:FormData){const status=value(form,"status");if(!["pending","active","expiring","expired","issue"].includes(status))redirect("/workspace/services/actions?error=invalid");await update("project_domains",value(form,"id"),{status});}
export async function updateSubscriptionStatus(form:FormData){const status=value(form,"status");if(!["trial","active","past_due","paused","cancelled"].includes(status))redirect("/workspace/services/actions?error=invalid");await update("project_subscriptions",value(form,"id"),{status});}
export async function markSubscriptionPaid(form:FormData){
 const id=value(form,"id");if(!id)redirect("/workspace/services/actions?error=invalid");const supabase=await teamClient();
 const {data:subscription,error:readError}=await supabase.from("project_subscriptions").select("id,status,next_billing_on,billing_cycle").eq("id",id).single();if(readError||!subscription)redirect("/workspace/services/actions?error=save");
 const current=subscription.next_billing_on?new Date(`${subscription.next_billing_on}T00:00:00Z`):new Date();const cycle=String(subscription.billing_cycle??"monthly");
 if(cycle==="yearly"||cycle==="annual")current.setUTCFullYear(current.getUTCFullYear()+1);else if(cycle==="quarterly")current.setUTCMonth(current.getUTCMonth()+3);else current.setUTCMonth(current.getUTCMonth()+1);
 const {error}=await supabase.from("project_subscriptions").update({status:"active",next_billing_on:current.toISOString().slice(0,10),updated_at:new Date().toISOString()}).eq("id",id);if(error)redirect("/workspace/services/actions?error=save");refresh();redirect("/workspace/services/actions?saved=billing");
}
export async function updateTicketStatus(form:FormData){
 const status=value(form,"status"),id=value(form,"id");if(!["open","in_progress","waiting_customer","resolved","closed"].includes(status)||!id)redirect("/workspace/services/actions?error=invalid");
 const supabase=await teamClient();const now=new Date().toISOString();const patch:any={status,updated_at:now};if(status==="in_progress")patch.first_response_at=now;if(["resolved","closed"].includes(status))patch.resolved_at=now;else patch.resolved_at=null;
 const {error}=await supabase.from("support_tickets").update(patch).eq("id",id);if(error)redirect("/workspace/services/actions?error=save");refresh();redirect("/workspace/services/actions?saved=support");
}
export async function updateDeploymentStatus(form:FormData){
 const status=value(form,"status");if(!["queued","building","ready","error","cancelled","unknown"].includes(status))redirect("/workspace/services/actions?error=invalid");const supabase=await teamClient();const id=value(form,"id");if(!id)redirect("/workspace/services/actions?error=invalid");
 const {error}=await supabase.from("project_deployments").update({status,checked_at:new Date().toISOString(),deployed_at:status==="ready"?new Date().toISOString():null}).eq("id",id);if(error)redirect("/workspace/services/actions?error=save");refresh();redirect("/workspace/services/actions?saved=1");
}
