import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import styles from "../workspace.module.css";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const modelLabel: Record<string, string> = { qira_managed: "QIRA", customer_managed: "Customer", hybrid: "Hybrid" };

export default async function ManagedServicesPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/login");
  const membership = await supabase.from("memberships").select("role").eq("user_id", String(claims.claims.sub)).eq("status", "active");
  const canManage = membership.data?.some((item) => item.role === "qira_admin" || item.role === "qira_consultant");
  if (!canManage) redirect("/client");

  const [{ data: customers }, { data: projects }, { data: deployments }, { data: domains }, { data: subscriptions }, { data: tickets }] = await Promise.all([
    (supabase as any).from("customers").select("id,display_name,lifecycle_status,updated_at").order("updated_at", { ascending: false }),
    (supabase as any).from("managed_projects").select("id,customer_id,name,package_id,management_model,service_status,production_url,updated_at").order("updated_at", { ascending: false }),
    (supabase as any).from("project_deployments").select("id,project_id,status,deployment_url,deployed_at,checked_at").order("created_at", { ascending: false }),
    (supabase as any).from("project_domains").select("id,project_id,hostname,status,expires_on,auto_renew").order("expires_on", { ascending: true }),
    (supabase as any).from("project_subscriptions").select("id,project_id,name,billing_cycle,amount_idr,status,next_billing_on").order("next_billing_on", { ascending: true }),
    (supabase as any).from("support_tickets").select("id,customer_id,project_id,ticket_number,subject,priority,status,due_at,opened_at").order("opened_at", { ascending: false }),
  ]);

  const today = new Date();
  const thirty = new Date(today);
  thirty.setDate(thirty.getDate() + 30);
  const activeProjects = (projects ?? []).filter((item: any) => item.service_status === "active");
  const domainAlerts = (domains ?? []).filter((item: any) => item.expires_on && new Date(item.expires_on) <= thirty);
  const deploymentErrors = (deployments ?? []).filter((item: any) => item.status === "error");
  const openTickets = (tickets ?? []).filter((item: any) => !["resolved", "closed"].includes(item.status));
  const urgentTickets = openTickets.filter((item: any) => item.priority === "urgent");
  const monthlyRevenue = (subscriptions ?? []).filter((item: any) => item.status === "active").reduce((total: number, item: any) => total + (item.billing_cycle === "monthly" ? item.amount_idr : item.billing_cycle === "quarterly" ? item.amount_idr / 3 : item.billing_cycle === "annual" ? item.amount_idr / 12 : 0), 0);
  const customerById = new Map<string, any>((customers ?? []).map((item: any) => [item.id, item]));
  const projectById = new Map<string, any>((projects ?? []).map((item: any) => [item.id, item]));
  const alertCount = domainAlerts.length + deploymentErrors.length + urgentTickets.length;

  return <main className={styles.page}>
    <header className={styles.header}><div><Link className={styles.brand} href="/workspace">QIRA.</Link><p>Layanan</p></div><Link className={styles.primaryAction} href="/workspace">Workspace</Link></header>

    <section className={styles.hero}>
      <p className={styles.kicker}>Operasional</p>
      <h1>Layanan yang perlu dijaga.</h1>
      <p>Status penting, alert, dan recurring revenue dalam satu layar.</p>
    </section>

    <nav className={styles.workspaceNav}>
      <Link href="/workspace/services/actions">Action Center</Link>
      <Link href="/workspace/services/health">Health</Link>
      <Link href="/workspace/services/reminders">Reminders</Link>
      <Link href="/workspace/services/records">Tambah record</Link>
      <Link href="/workspace/services/onboard">Onboard</Link>
    </nav>

    <section className={styles.followUpGrid}>
      <article><span>Layanan aktif</span><strong>{activeProjects.length}</strong><small>{projects?.length ?? 0} total project</small></article>
      <article><span>Estimasi MRR</span><strong>{rupiah.format(Math.round(monthlyRevenue))}</strong><small>Subscription aktif</small></article>
      <article><span>Perlu perhatian</span><strong>{alertCount}</strong><small>Domain + deploy + urgent ticket</small></article>
      <article><span>Tiket terbuka</span><strong>{openTickets.length}</strong><small>{urgentTickets.length} urgent</small></article>
    </section>

    {!!alertCount && <section className={styles.panel}>
      <div className={styles.panelHeading}><div><p className={styles.kicker}>Prioritas</p><h2>Perlu perhatian</h2></div><Link href="/workspace/services/actions">Buka Action Center →</Link></div>
      {domainAlerts.slice(0, 4).map((domain: any) => <div className={styles.attentionRow} key={`domain-${domain.id}`}><div><strong>{domain.hostname}</strong><p>{projectById.get(domain.project_id)?.name ?? "Project"} · {domain.expires_on}</p></div><span className={styles.warningBadge}>Domain</span></div>)}
      {deploymentErrors.slice(0, 4).map((deployment: any) => <div className={styles.attentionRow} key={`deploy-${deployment.id}`}><div><strong>{projectById.get(deployment.project_id)?.name ?? "Project"}</strong><p>Deployment error</p></div><span className={styles.urgentBadge}>Deploy</span></div>)}
      {urgentTickets.slice(0, 4).map((ticket: any) => <div className={styles.attentionRow} key={`ticket-${ticket.id}`}><div><strong>{ticket.ticket_number} · {ticket.subject}</strong><p>{customerById.get(ticket.customer_id)?.display_name ?? "Customer"}</p></div><span className={styles.urgentBadge}>Urgent</span></div>)}
    </section>}

    <section className={styles.panel}>
      <div className={styles.panelHeading}><div><p className={styles.kicker}>Portfolio</p><h2>Project aktif</h2></div><Link className={styles.primaryAction} href="/workspace/services/onboard">Onboard</Link></div>
      {!projects?.length ? <p className={styles.empty}>Belum ada project layanan.</p> : (projects ?? []).map((project: any) => <div className={styles.serviceRow} key={project.id}><div><strong><Link href={`/workspace/services/customers/${project.customer_id}`}>{project.name}</Link></strong><p>{customerById.get(project.customer_id)?.display_name ?? "Customer"} · {project.package_id}</p></div><span>{modelLabel[project.management_model] ?? project.management_model}</span><span className={project.service_status === "attention" ? styles.warningBadge : styles.neutralBadge}>{project.service_status}</span>{project.production_url ? <a href={project.production_url} target="_blank" rel="noreferrer">Buka ↗</a> : <small>Belum live</small>}</div>)}
    </section>

    <details className={styles.panel}>
      <summary><strong>Recurring services ({subscriptions?.length ?? 0})</strong></summary>
      {!subscriptions?.length ? <p className={styles.empty}>Belum ada subscription.</p> : (subscriptions ?? []).map((item: any) => <div className={styles.serviceRow} key={item.id}><div><strong>{item.name}</strong><p>{projectById.get(item.project_id)?.name ?? "Project"} · {item.billing_cycle}</p></div><span>{rupiah.format(item.amount_idr)}</span><span className={item.status === "past_due" ? styles.urgentBadge : styles.neutralBadge}>{item.status}</span><small>{item.next_billing_on ?? "—"}</small></div>)}
    </details>
  </main>;
}
