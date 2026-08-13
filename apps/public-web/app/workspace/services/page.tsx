import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import styles from "../workspace.module.css";

const rupiah=new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0});
const modelLabel:Record<string,string>={qira_managed:"Managed by QIRA",customer_managed:"Customer-managed",hybrid:"Hybrid"};

export default async function ManagedServicesPage(){
  const supabase=await createClient();
  const {data:claims}=await supabase.auth.getClaims();
  if(!claims?.claims?.sub) redirect("/login");
  const membership=await supabase.from("memberships").select("role").eq("user_id",String(claims.claims.sub)).eq("status","active");
  const canManage=membership.data?.some(item=>item.role==="qira_admin"||item.role==="qira_consultant");
  if(!canManage) redirect("/client");

  const [{data:customers},{data:projects},{data:deployments},{data:domains},{data:subscriptions},{data:tickets}]=await Promise.all([
    (supabase as any).from("customers").select("id,display_name,customer_type,lifecycle_status,primary_contact_name,updated_at").order("updated_at",{ascending:false}),
    (supabase as any).from("managed_projects").select("id,customer_id,name,package_id,management_model,service_status,production_url,next_review_on,updated_at").order("updated_at",{ascending:false}),
    (supabase as any).from("project_deployments").select("id,project_id,provider,environment,status,deployment_url,deployed_at,checked_at").order("created_at",{ascending:false}),
    (supabase as any).from("project_domains").select("id,project_id,hostname,status,expires_on,auto_renew").order("expires_on",{ascending:true}),
    (supabase as any).from("project_subscriptions").select("id,project_id,name,billing_cycle,amount_idr,status,next_billing_on").order("next_billing_on",{ascending:true}),
    (supabase as any).from("support_tickets").select("id,customer_id,project_id,ticket_number,subject,priority,status,due_at,opened_at").order("opened_at",{ascending:false}),
  ]);

  const today=new Date();const thirty=new Date(today);thirty.setDate(thirty.getDate()+30);
  const activeProjects=(projects??[]).filter((item:any)=>item.service_status==="active");
  const activeDomains=(domains??[]).filter((item:any)=>item.status==="active");
  const domainAlerts=(domains??[]).filter((item:any)=>item.expires_on&&new Date(item.expires_on)<=thirty);
  const deploymentErrors=(deployments??[]).filter((item:any)=>item.status==="error");
  const openTickets=(tickets??[]).filter((item:any)=>!["resolved","closed"].includes(item.status));
  const monthlyRevenue=(subscriptions??[]).filter((item:any)=>item.status==="active").reduce((total:number,item:any)=>total+(item.billing_cycle==="monthly"?item.amount_idr:item.billing_cycle==="quarterly"?item.amount_idr/3:item.billing_cycle==="annual"?item.amount_idr/12:0),0);
  const customerById=new Map<string,any>((customers??[]).map((item:any)=>[item.id,item]));
  const projectById=new Map<string,any>((projects??[]).map((item:any)=>[item.id,item]));

  return <main className={styles.page}>
    <header className={styles.header}><div><Link className={styles.brand} href="/workspace">QIRA.</Link><p>Managed Services Control Center</p></div><Link className={styles.primaryAction} href="/workspace">Workspace utama</Link></header>
    <section className={styles.hero}><p className={styles.kicker}>Managed digital service business</p><h1>Customer, layanan, dan recurring revenue dalam satu pusat kontrol.</h1><p>Setiap pelanggan ditautkan ke project, deployment, domain, subscription, service status, dan support.</p></section>
    <section className={styles.businessMetrics}>
      <article><span>Total customer</span><strong>{customers?.length??0}</strong><small>{(customers??[]).filter((item:any)=>item.lifecycle_status==="active").length} aktif</small></article>
      <article><span>Website/service aktif</span><strong>{activeProjects.length}</strong><small>{projects?.length??0} total project</small></article>
      <article><span>Estimasi MRR</span><strong>{rupiah.format(Math.round(monthlyRevenue))}</strong><small>Dari subscription aktif</small></article>
      <article><span>Domain aktif</span><strong>{activeDomains.length}</strong><small>{domainAlerts.length} perlu perhatian ≤30 hari</small></article>
      <article><span>Deployment error</span><strong>{deploymentErrors.length}</strong><small>Status terakhir tercatat</small></article>
      <article><span>Tiket terbuka</span><strong>{openTickets.length}</strong><small>{openTickets.filter((item:any)=>item.priority==="urgent").length} urgent</small></article>
    </section>

    <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Service portfolio</p><h2>Project dan model pengelolaan</h2></div><div className={styles.panelActions}><Link href="/workspace/services/reminders">Reminders</Link><Link href="/workspace/services/actions">Action Center</Link><Link href="/workspace/services/records">Tambah record</Link><Link className={styles.primaryAction} href="/workspace/services/onboard">Onboard customer</Link></div></div>
      {!projects?.length?<p className={styles.empty}>Belum ada project layanan. Record pertama dibuat setelah proposal pelanggan dinyatakan menang.</p>:(projects??[]).map((project:any)=><div className={styles.serviceRow} key={project.id}><div><strong><Link href={`/workspace/services/customers/${project.customer_id}`}>{project.name}</Link></strong><p>{customerById.get(project.customer_id)?.display_name??"Customer"} · {project.package_id}</p></div><span>{modelLabel[project.management_model]??project.management_model}</span><span className={project.service_status==="attention"?styles.warningBadge:styles.neutralBadge}>{project.service_status}</span>{project.production_url?<a href={project.production_url} target="_blank" rel="noreferrer">Buka layanan ↗</a>:<small>Belum live</small>}</div>)}
    </section>

    <div className={styles.detailGrid}>
      <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Domain watch</p><h2>Expiry dan ownership</h2></div><span className={domainAlerts.length?styles.warningBadge:styles.neutralBadge}>{domainAlerts.length} alert</span></div>
        {!domains?.length?<p className={styles.empty}>Belum ada domain tercatat.</p>:(domains??[]).slice(0,8).map((domain:any)=><div className={styles.metricRow} key={domain.id}><div><strong>{domain.hostname}</strong><p>{projectById.get(domain.project_id)?.name??"Project"} · {domain.auto_renew?"auto-renew":"manual"}</p></div><span>{domain.expires_on??"Expiry belum diisi"}</span></div>)}
      </section>
      <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Support desk</p><h2>Tiket yang perlu ditangani</h2></div><span className={styles.neutralBadge}>{openTickets.length} open</span></div>
        {!openTickets.length?<p className={styles.empty}>Tidak ada tiket support terbuka.</p>:openTickets.slice(0,8).map((ticket:any)=><div className={styles.metricRow} key={ticket.id}><div><strong>{ticket.ticket_number} · {ticket.subject}</strong><p>{customerById.get(ticket.customer_id)?.display_name??"Customer"}</p></div><span>{ticket.priority} · {ticket.status}</span></div>)}
      </section>
    </div>

    <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Subscription ledger</p><h2>Recurring services</h2></div></div>
      {!subscriptions?.length?<p className={styles.empty}>Belum ada subscription tercatat.</p>:(subscriptions??[]).map((item:any)=><div className={styles.serviceRow} key={item.id}><div><strong>{item.name}</strong><p>{projectById.get(item.project_id)?.name??"Project"} · {item.billing_cycle}</p></div><span>{rupiah.format(item.amount_idr)}</span><span className={item.status==="past_due"?styles.urgentBadge:styles.neutralBadge}>{item.status}</span><small>Tagihan berikut: {item.next_billing_on??"—"}</small></div>)}
    </section>
  </main>;
}
