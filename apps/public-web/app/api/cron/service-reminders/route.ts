import { createClient } from "@supabase/supabase-js";
import { NextRequest,NextResponse } from "next/server";

export const runtime="nodejs";
export const dynamic="force-dynamic";

type Reminder={organization_id:string;customer_id:string;project_id:string|null;reminder_type:string;reminder_key:string;title:string;body:string;due_on:string|null;severity:"normal"|"warning"|"urgent";status:"open"};

export async function GET(request:NextRequest){
 const expected=process.env.CRON_SECRET;
 if(!expected||request.headers.get("authorization")!==`Bearer ${expected}`)return NextResponse.json({error:"unauthorized"},{status:401});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const secret=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!secret)return NextResponse.json({error:"server_not_configured"},{status:503});
 const supabase=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
 const horizon=new Date();horizon.setUTCDate(horizon.getUTCDate()+45);const limit=horizon.toISOString().slice(0,10);const today=new Date().toISOString().slice(0,10);
 const [{data:customers,error:customerError},{data:projects,error:projectError},{data:domains,error:domainError},{data:subscriptions,error:subscriptionError},{data:tickets,error:ticketError}]=await Promise.all([
  supabase.from("customers").select("id,organization_id,display_name"),
  supabase.from("managed_projects").select("id,customer_id,name,next_review_on,service_status").lte("next_review_on",limit).in("service_status",["active","attention","maintenance"]),
  supabase.from("project_domains").select("id,project_id,hostname,expires_on,status").lte("expires_on",limit).in("status",["active","expiring","issue"]),
  supabase.from("project_subscriptions").select("id,project_id,name,next_billing_on,status,amount_idr").lte("next_billing_on",limit).in("status",["trial","active","past_due"]),
  supabase.from("support_tickets").select("id,customer_id,project_id,ticket_number,subject,due_at,status").lte("due_at",`${limit}T23:59:59Z`).in("status",["open","in_progress","waiting_customer"]),
 ]);
 if(customerError||projectError||domainError||subscriptionError||ticketError)return NextResponse.json({error:"query_failed"},{status:500});
 const customerById=new Map((customers??[]).map(x=>[x.id,x]));const projectById=new Map<string,any>();
 for(const p of projects??[])projectById.set(p.id,p);
 if((domains??[]).length||(subscriptions??[]).length){const ids=[...new Set([...(domains??[]).map(x=>x.project_id),...(subscriptions??[]).map(x=>x.project_id)])];const {data}=await supabase.from("managed_projects").select("id,customer_id,name").in("id",ids);for(const p of data??[])projectById.set(p.id,p)}
 const reminders:Reminder[]=[];const severity=(due:string|null):"normal"|"warning"|"urgent"=>!due?"normal":due<today?"urgent":due<=new Date(Date.now()+14*86400000).toISOString().slice(0,10)?"warning":"normal";
 for(const p of projects??[]){const c=customerById.get(p.customer_id);if(c)reminders.push({organization_id:c.organization_id,customer_id:c.id,project_id:p.id,reminder_type:"project_review",reminder_key:`project_review:${p.id}:${p.next_review_on}`,title:`Review project: ${p.name}`,body:`Review layanan ${c.display_name} dijadwalkan ${p.next_review_on}.`,due_on:p.next_review_on,severity:severity(p.next_review_on),status:"open"})}
 for(const d of domains??[]){const p=projectById.get(d.project_id),c=p&&customerById.get(p.customer_id);if(c)reminders.push({organization_id:c.organization_id,customer_id:c.id,project_id:p.id,reminder_type:"domain_expiry",reminder_key:`domain_expiry:${d.id}:${d.expires_on}`,title:`Domain akan kedaluwarsa: ${d.hostname}`,body:`${d.hostname} milik ${c.display_name} kedaluwarsa ${d.expires_on}.`,due_on:d.expires_on,severity:severity(d.expires_on),status:"open"})}
 for(const s of subscriptions??[]){const p=projectById.get(s.project_id),c=p&&customerById.get(p.customer_id);if(c)reminders.push({organization_id:c.organization_id,customer_id:c.id,project_id:p.id,reminder_type:"subscription_due",reminder_key:`subscription_due:${s.id}:${s.next_billing_on}`,title:`Tagihan layanan: ${s.name}`,body:`Tagihan ${c.display_name} sebesar Rp${Number(s.amount_idr).toLocaleString("id-ID")} jatuh tempo ${s.next_billing_on}.`,due_on:s.next_billing_on,severity:severity(s.next_billing_on),status:"open"})}
 for(const t of tickets??[]){const c=customerById.get(t.customer_id);if(c){const due=t.due_at?.slice(0,10)??null;reminders.push({organization_id:c.organization_id,customer_id:c.id,project_id:t.project_id,reminder_type:"ticket_due",reminder_key:`ticket_due:${t.id}:${due}`,title:`Tiket perlu ditangani: ${t.ticket_number}`,body:`${t.subject} untuk ${c.display_name} memiliki target ${due??"belum ditentukan"}.`,due_on:due,severity:severity(due),status:"open"})}}
 if(reminders.length){const {error}=await supabase.from("service_reminders").upsert(reminders,{onConflict:"reminder_key",ignoreDuplicates:true});if(error)return NextResponse.json({error:"write_failed"},{status:500})}
 return NextResponse.json({ok:true,generated:reminders.length,horizon:limit});
}
