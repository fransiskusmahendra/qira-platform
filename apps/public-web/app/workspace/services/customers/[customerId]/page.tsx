import Link from "next/link";
import { notFound,redirect } from "next/navigation";
import { createClient } from "../../../../../lib/supabase/server";
import styles from "../../../workspace.module.css";

const rupiah=new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0});
const date=(value:string|null)=>value?new Intl.DateTimeFormat("id-ID",{dateStyle:"medium"}).format(new Date(value)):"—";
const model:Record<string,string>={qira_managed:"Managed by QIRA",hybrid:"Hybrid",customer_managed:"Customer-managed"};

export default async function CustomerAccountPage({params}:{params:Promise<{customerId:string}>}){
 const {customerId}=await params;const supabase=await createClient();const {data:claims}=await supabase.auth.getClaims();if(!claims?.claims?.sub)redirect("/login");
 const membership=await supabase.from("memberships").select("role").eq("status","active");if(!membership.data?.some((x:{role:string})=>x.role==="qira_admin"||x.role==="qira_consultant"))redirect("/client");
 const {data:customer}=await (supabase as any).from("customers").select("id,display_name,customer_type,lifecycle_status,primary_contact_name,primary_contact_email,primary_contact_whatsapp,created_at").eq("id",customerId).maybeSingle();
 if(!customer)notFound();
 const {data:projects}=await (supabase as any).from("managed_projects").select("id,name,package_id,management_model,service_status,production_url,repository_url,started_on,launched_on,next_review_on,notes").eq("customer_id",customerId).order("created_at");
 const projectIds=(projects??[]).map((x:any)=>x.id);
 let deployments:any[]=[],domains:any[]=[],subscriptions:any[]=[],tickets:any[]=[];
 if(projectIds.length){
  const result=await Promise.all([
   (supabase as any).from("project_deployments").select("id,project_id,provider,environment,status,deployment_url,deployed_at,checked_at").in("project_id",projectIds).order("created_at",{ascending:false}),
   (supabase as any).from("project_domains").select("id,project_id,hostname,ownership,status,expires_on,auto_renew").in("project_id",projectIds).order("expires_on"),
   (supabase as any).from("project_subscriptions").select("id,project_id,name,billing_cycle,amount_idr,status,next_billing_on").in("project_id",projectIds).order("next_billing_on"),
   (supabase as any).from("support_tickets").select("id,project_id,ticket_number,subject,priority,status,due_at,opened_at").eq("customer_id",customerId).order("opened_at",{ascending:false}),
  ]);deployments=result[0].data??[];domains=result[1].data??[];subscriptions=result[2].data??[];tickets=result[3].data??[];
 }else{const result=await (supabase as any).from("support_tickets").select("id,project_id,ticket_number,subject,priority,status,due_at,opened_at").eq("customer_id",customerId).order("opened_at",{ascending:false});tickets=result.data??[]}
 const activeRevenue=subscriptions.filter(x=>x.status==="active").reduce((sum,x)=>sum+(x.billing_cycle==="monthly"?x.amount_idr:x.billing_cycle==="quarterly"?x.amount_idr/3:x.billing_cycle==="annual"?x.amount_idr/12:0),0);
 return <main className={styles.page}>
  <header className={styles.header}><div><Link className={styles.brand} href="/workspace">QIRA.</Link><p>Customer Account</p></div><Link className={styles.primaryAction} href="/workspace/services">Kembali ke Control Center</Link></header>
  <section className={styles.accountHero}><div><p className={styles.kicker}>{customer.customer_type} · {customer.lifecycle_status}</p><h1>{customer.display_name}</h1><p>PIC: {customer.primary_contact_name??"Belum diisi"} · {customer.primary_contact_email??customer.primary_contact_whatsapp??"Kontak belum diisi"}</p></div><div><span>Estimasi MRR</span><strong>{rupiah.format(Math.round(activeRevenue))}</strong><small>{projects?.length??0} project · {tickets.filter(x=>!["resolved","closed"].includes(x.status)).length} tiket terbuka</small></div></section>
  {!projects?.length?<section className={styles.panel}><p className={styles.empty}>Customer ini belum memiliki project.</p></section>:(projects??[]).map((project:any)=>{
   const ds=deployments.filter(x=>x.project_id===project.id),dm=domains.filter(x=>x.project_id===project.id),ss=subscriptions.filter(x=>x.project_id===project.id),ts=tickets.filter(x=>x.project_id===project.id);
   return <section className={styles.accountProject} key={project.id}>
    <div className={styles.accountProjectHead}><div><p className={styles.kicker}>{project.package_id}</p><h2>{project.name}</h2><p>{model[project.management_model]??project.management_model} · mulai {date(project.started_on)} · review {date(project.next_review_on)}</p></div><span className={project.service_status==="attention"?styles.warningBadge:styles.neutralBadge}>{project.service_status}</span></div>
    <div className={styles.accountRecords}>
     <article><h3>Deployment</h3>{!ds.length?<small>Belum tercatat</small>:ds.slice(0,3).map(x=><div key={x.id}><strong>{x.provider} · {x.status}</strong><small>{x.environment} · checked {date(x.checked_at)}</small></div>)}</article>
     <article><h3>Domain</h3>{!dm.length?<small>Belum tercatat</small>:dm.map(x=><div key={x.id}><strong>{x.hostname}</strong><small>{x.status} · expiry {date(x.expires_on)} · {x.ownership}</small></div>)}</article>
     <article><h3>Subscription</h3>{!ss.length?<small>Belum tercatat</small>:ss.map(x=><div key={x.id}><strong>{x.name} · {rupiah.format(x.amount_idr)}</strong><small>{x.status} · {x.billing_cycle} · next {date(x.next_billing_on)}</small></div>)}</article>
     <article><h3>Support</h3>{!ts.length?<small>Tidak ada tiket</small>:ts.slice(0,4).map(x=><div key={x.id}><strong>{x.ticket_number} · {x.subject}</strong><small>{x.priority} · {x.status} · due {date(x.due_at)}</small></div>)}</article>
    </div>
    <div className={styles.accountLinks}>{project.production_url?<a href={project.production_url} target="_blank" rel="noreferrer">Buka production ↗</a>:null}{project.repository_url?<a href={project.repository_url} target="_blank" rel="noreferrer">Buka repository ↗</a>:null}<Link href="/workspace/services/records">Tambah record</Link></div>
   </section>
  })}
  {tickets.some(x=>!x.project_id)?<section className={styles.panel}><div className={styles.panelHeading}><h2>Tiket umum customer</h2></div>{tickets.filter(x=>!x.project_id).map(x=><div className={styles.metricRow} key={x.id}><div><strong>{x.ticket_number} · {x.subject}</strong><p>{x.priority}</p></div><span>{x.status}</span></div>)}</section>:null}
 </main>;
}
