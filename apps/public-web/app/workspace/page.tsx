import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "../../lib/supabase/server";
import { signOut } from "./actions";
import { markNotificationRead } from "./notifications/actions";
import styles from "./workspace.module.css";

export default async function WorkspacePage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect("/login");

  const [{ data: memberships }, { data: proposals }, { data: discoveries }, { data: decisions }, { data: notifications }, { data: publicLeads }] = await Promise.all([
    supabase.from("memberships").select("organization_id, role, organizations(name, slug)").eq("status", "active"),
    supabase.from("proposals").select("id, proposal_number, client_name, status, version, valid_until, updated_at").order("updated_at", { ascending: false }).limit(50),
    supabase.from("discoveries").select("id, service_ids, status, version, updated_at").order("updated_at", { ascending: false }).limit(30),
    (supabase as any).from("proposal_client_decisions").select("proposal_id,proposal_version,decision,comment,decided_at").order("decided_at", { ascending: false }).limit(50),
    (supabase as any).from("notifications").select("id,proposal_id,kind,title,body,created_at,read_at").order("created_at", { ascending: false }).limit(12),
    supabase.from("public_leads").select("id,full_name,business_name,lead_temperature,status,created_at").order("created_at", { ascending: false }).limit(20),
  ]);

  const canManage = memberships?.some((item) => item.role === "qira_consultant" || item.role === "qira_admin");
  const isClientOnly = !canManage && memberships?.some((item) => item.role === "client_viewer" || item.role === "client_member");
  if (isClientOnly) redirect("/client");

  const decisionByVersion = new Map<string, any>();
  decisions?.forEach((decision: any) => decisionByVersion.set(`${decision.proposal_id}:${decision.proposal_version}`, decision));
  const shared = proposals?.filter((proposal) => proposal.status === "shared") ?? [];
  const revisions = shared.filter((proposal) => decisionByVersion.get(`${proposal.id}:${proposal.version}`)?.decision === "revision_requested");
  const waiting = shared.filter((proposal) => !decisionByVersion.has(`${proposal.id}:${proposal.version}`));
  const newLeads = (publicLeads ?? []).filter((lead) => lead.status === "new");
  const hotNewLeads = newLeads.filter((lead) => lead.lead_temperature === "hot");
  const unread = (notifications ?? []).filter((item: any) => !item.read_at);
  const today = new Date();
  const sevenDays = new Date(today);
  sevenDays.setDate(sevenDays.getDate() + 7);
  const expiring = waiting.filter((proposal) => {
    const validUntil = new Date(`${proposal.valid_until}T23:59:59`);
    return validUntil >= today && validUntil <= sevenDays;
  });
  const actionCount = newLeads.length + revisions.length + waiting.length;

  return <main className={styles.page}>
    <header className={styles.header}>
      <div><span className={styles.brand}>QIRA.</span><p>Workspace</p></div>
      <form action={signOut}><button type="submit">Keluar</button></form>
    </header>

    <section className={styles.hero}>
      <p className={styles.kicker}>Hari ini</p>
      <h1>Apa yang perlu dikerjakan?</h1>
      <p>Lead, proposal, dan layanan yang butuh perhatian ada di depan.</p>
    </section>

    <nav className={styles.workspaceNav}>
      {canManage && <><Link href="/workspace/leads">Leads</Link><Link href="/workspace/services">Layanan</Link><Link href="/workspace/proposals/new">Proposal baru</Link><Link href="/workspace/invitations">Undangan</Link><Link href="/workspace/readiness">Readiness</Link></>}
      <Link href="/discovery">Discovery</Link>
    </nav>

    {canManage && <>
      <section className={styles.businessMetrics}>
        <article><span>Perlu aksi</span><strong>{actionCount}</strong><small>Lead + proposal</small></article>
        <article><span>Lead baru</span><strong>{newLeads.length}</strong><small>{hotNewLeads.length} hot</small></article>
        <article><span>Belum dibaca</span><strong>{unread.length}</strong><small>Notifikasi</small></article>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeading}><div><p className={styles.kicker}>Prioritas</p><h2>Kerjakan berikutnya</h2></div><Link href="/workspace/leads">Buka Leads →</Link></div>
        {!newLeads.length && !revisions.length && !waiting.length && <p className={styles.empty}>Tidak ada tindak lanjut mendesak.</p>}
        {newLeads.slice(0, 4).map((lead) => <Link className={styles.attentionRow} href={`/workspace/leads#lead-${lead.id}`} key={`lead-${lead.id}`}><div><strong>{lead.business_name}</strong><p>{lead.full_name}</p></div><span className={lead.lead_temperature === "hot" ? styles.urgentBadge : styles.neutralBadge}>{lead.lead_temperature === "hot" ? "Hot" : "Hubungi"}</span></Link>)}
        {revisions.slice(0, 4).map((proposal) => <Link className={styles.attentionRow} href={`/workspace/proposals/${proposal.id}`} key={`revision-${proposal.id}`}><div><strong>{proposal.client_name}</strong><p>{decisionByVersion.get(`${proposal.id}:${proposal.version}`)?.comment || proposal.proposal_number}</p></div><span className={styles.urgentBadge}>Revisi</span></Link>)}
        {expiring.slice(0, 4).map((proposal) => <Link className={styles.attentionRow} href={`/workspace/proposals/${proposal.id}`} key={`expiry-${proposal.id}`}><div><strong>{proposal.client_name}</strong><p>s.d. {proposal.valid_until}</p></div><span className={styles.warningBadge}>Follow-up</span></Link>)}
        {waiting.filter((proposal) => !expiring.some((item) => item.id === proposal.id)).slice(0, 4).map((proposal) => <Link className={styles.attentionRow} href={`/workspace/proposals/${proposal.id}`} key={`waiting-${proposal.id}`}><div><strong>{proposal.client_name}</strong><p>{proposal.proposal_number}</p></div><span className={styles.neutralBadge}>Menunggu</span></Link>)}
      </section>

      {!!unread.length && <section className={styles.panel}>
        <div className={styles.panelHeading}><div><p className={styles.kicker}>Notifikasi</p><h2>{unread.length} belum dibaca</h2></div></div>
        {unread.slice(0, 5).map((item: any) => {
          const href = item.proposal_id ? `/workspace/proposals/${item.proposal_id}` : String(item.kind).startsWith("lead_") ? "/workspace/leads" : "/workspace";
          return <div className={styles.attentionRow} key={item.id}><Link href={href}><strong>{item.title}</strong><p>{item.body}</p></Link><form action={markNotificationRead}><input name="notification_id" type="hidden" value={item.id}/><button type="submit">Selesai</button></form></div>;
        })}
      </section>}
    </>}

    <div className={styles.detailGrid}>
      <section className={styles.panel}>
        <div className={styles.panelHeading}><div><p className={styles.kicker}>Discovery</p><h2>Terbaru</h2></div><Link href="/discovery">Mulai →</Link></div>
        {!discoveries?.length && <p className={styles.empty}>Belum ada Discovery.</p>}
        {discoveries?.slice(0, 5).map((discovery) => <Link className={styles.attentionRow} href={`/workspace/discoveries/${discovery.id}`} key={discovery.id}><div><strong>{discovery.service_ids.join(", ") || "Discovery"}</strong><p>Versi {discovery.version}</p></div><span className={styles.neutralBadge}>{discovery.status}</span></Link>)}
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeading}><div><p className={styles.kicker}>Proposal</p><h2>Terbaru</h2></div>{canManage && <Link href="/workspace/proposals/new">Buat →</Link>}</div>
        {!proposals?.length && <p className={styles.empty}>Belum ada proposal.</p>}
        {proposals?.slice(0, 5).map((proposal) => <Link className={styles.attentionRow} href={`/workspace/proposals/${proposal.id}`} key={proposal.id}><div><strong>{proposal.client_name}</strong><p>{proposal.proposal_number}</p></div><span className={styles.neutralBadge}>{proposal.status}</span></Link>)}
      </section>
    </div>
  </main>;
}
