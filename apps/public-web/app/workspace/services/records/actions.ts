"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server";

const value=(form:FormData,name:string)=>String(form.get(name)??"").trim();
const allowed=(input:string,options:string[])=>options.includes(input);
async function authorizedClient(){
  const supabase=await createClient();
  const {data:claims}=await supabase.auth.getClaims();
  if(!claims?.claims?.sub) redirect("/login");
  const {data}=await supabase.from("memberships").select("role").eq("user_id",String(claims.claims.sub)).eq("status","active");
  if(!data?.some(item=>item.role==="qira_admin"||item.role==="qira_consultant")) redirect("/client");
  return supabase as any;
}
function done(type:string){revalidatePath("/workspace/services");redirect(`/workspace/services/records?saved=${type}`)}
function fail(type:string){redirect(`/workspace/services/records?error=${type}`)}

export async function addDomain(form:FormData){
  const supabase=await authorizedClient(); const projectId=value(form,"projectId");
  const hostname=value(form,"hostname").toLowerCase().replace(/^https?:\/\//,"").replace(/\/$/,"");
  const ownership=value(form,"ownership"),status=value(form,"status");
  if(!projectId||!/^[a-z0-9.-]+$/.test(hostname)||!allowed(ownership,["customer","qira"])||!allowed(status,["pending","active","expiring","expired","issue"])) fail("domain");
  const {error}=await supabase.from("project_domains").insert({project_id:projectId,hostname,registrar:value(form,"registrar")||null,ownership,status,expires_on:value(form,"expiresOn")||null,auto_renew:value(form,"autoRenew")==="on"});
  if(error) fail("domain"); done("domain");
}
export async function addDeployment(form:FormData){
  const supabase=await authorizedClient(); const projectId=value(form,"projectId"),provider=value(form,"provider"),status=value(form,"status");
  if(!projectId||!allowed(provider,["vercel","customer_infrastructure","other"])||!allowed(status,["queued","building","ready","error","cancelled","unknown"])) fail("deployment");
  const {error}=await supabase.from("project_deployments").insert({project_id:projectId,provider,environment:"production",status,deployment_url:value(form,"deploymentUrl")||null,deployment_ref:value(form,"deploymentRef")||null,checked_at:new Date().toISOString(),deployed_at:status==="ready"?new Date().toISOString():null});
  if(error) fail("deployment"); done("deployment");
}
export async function addSubscription(form:FormData){
  const supabase=await authorizedClient(); const projectId=value(form,"projectId"),cycle=value(form,"billingCycle"),status=value(form,"status"),amount=Number(value(form,"amount"));
  if(!projectId||value(form,"name").length<2||!allowed(cycle,["monthly","quarterly","annual","one_time"])||!allowed(status,["trial","active","past_due","paused","cancelled"])||!Number.isSafeInteger(amount)||amount<0) fail("subscription");
  const {error}=await supabase.from("project_subscriptions").insert({project_id:projectId,name:value(form,"name"),billing_cycle:cycle,amount_idr:amount,status,started_on:value(form,"startedOn")||null,next_billing_on:value(form,"nextBillingOn")||null});
  if(error) fail("subscription"); done("subscription");
}
export async function addTicket(form:FormData){
  const supabase=await authorizedClient(); const customerId=value(form,"customerId"),projectId=value(form,"projectId"),priority=value(form,"priority"),subject=value(form,"subject"),description=value(form,"description");
  if(!customerId||subject.length<3||description.length<3||!allowed(priority,["low","normal","high","urgent"])) fail("ticket");
  const ticketNumber=`QIR-${Date.now().toString(36).toUpperCase()}`;
  const {data:claims}=await supabase.auth.getClaims();
  const {error}=await supabase.from("support_tickets").insert({customer_id:customerId,project_id:projectId||null,ticket_number:ticketNumber,subject,description,priority,status:"open",created_by:claims?.claims?.sub});
  if(error) fail("ticket"); done("ticket");
}
