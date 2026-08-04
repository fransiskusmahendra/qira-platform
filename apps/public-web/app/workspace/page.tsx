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

  const [{ data: memberships }, { data: proposals }, { data: discoveries }, { data: decisions }, { data: clientEvents }, { data: notifications }] = await Promise.all([
    supabase.from("memberships").select("organization_id, role, organizations(name, slug)").eq("status", "active"),
    supabase.from("proposals").select("id, proposal_number, client_name, status, version, valid_until, updated_at").order("updated_at", { ascending: false }).limit(100),
    supabase.from("discoveries").select("id, service_ids, status, version, updated_at").order("updated_at", { ascending: false }).limit(100),
    (supabase as any).from("proposal_client_decisions").select("id,proposal_id,proposal_version,decision,comment,decided_at").order("decided_at", { ascending: false }).limit(100),
    (supabase as any).from("proposal_client_events").select("id,proposal_id,proposal_version,event_type,occurred_at").order("occurred_at", { ascending: false }).limit(20),
    (supabase as any).from("notifications").select("id,proposal_id,title,body,created_at,read_at,email_status").order("created_at",{ascending:false}).limit(20),
  ]);
  const canManageProposals = memberships?.some((item) => item.role === "qira_consultant" || item.role === "qira_admin");
  const isClientOnly = !canManageProposals && memberships?.some((item) => item.role === "client_viewer" || item.role === "client_member");
  if (isClientOnly) redirect("/client");

  const decisionByVersion = new Map<string, any>();
  decisions?.forEach((decision: any) => decisionByVersion.set(`${decision.proposal_id}:${decision.proposal_version}`, decision));
  const sharedProposals = proposals?.filter((proposal) => proposal.status === "shared") ?? [];
  const awaitingResponse = sharedProposals.filter((proposal) => !decisionByVersion.has(`${proposal.id}:${proposal.version}`));
  const revisionRequests = sharedProposals.filter((proposal) => decisionByVersion.get(`${proposal.id}:${proposal.version}`)?.decision === "revision_requested");
  const acceptedProposals = sharedProposals.filter((proposal) => decisionByVersion.get(`${proposal.id}:${proposal.version}`)?.decision === "accepted");
  const submittedDiscoveries = discoveries?.filter((discovery) => discovery.status === "submitted" || discovery.status === "approved").length ?? 0;
  const approvedDiscoveries = discoveries?.filter((discovery) => discovery.status === "approved").length ?? 0;
  const percent = (value: number, total: number) => total ? `${Math.round((value / total) * 100)}%` : "—";
  const today = new Date();
  const sevenDays = new Date(today);
  sevenDays.setDate(sevenDays.getDate() + 7);
  const expiringSoon = sharedProposals.filter((proposal) => {
    const validUntil = new Date(`${proposal.valid_until}T23:59:59`);
    return validUntil >= today && validUntil <= sevenDays;
  });
  const proposalById = new Map(proposals?.map((proposal) => [proposal.id, proposal]) ?? []);
  const latestProposals = proposals?.slice(0, 10) ?? [];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div><span className={styles.brand}>QIRA.</span><p>Secure Workspace</p></div>
        <form action={signOut}><button type="submit">Keluar</button></form>
      </header>
      <section className={styles.hero}>
        <p className={styles.kicker}>Workspace overview</p>
        <h1>Proposal dan Discovery dalam satu ruang kerja.</h1>
        <p>Akses halaman ini sudah dilindungi Supabase Auth dan Row Level Security.</p>
      </section>
      <section className={styles.grid}>
        <article><span>Organisasi aktif</span><strong>{memberships?.length ?? 0}</strong></article>
        <article><span>Proposal terlihat</span><strong>{proposals?.length ?? 0}</strong></article>
        <article><span>Discovery terlihat</span><strong>{discoveries?.length ?? 0}</strong></article>
      </section>
      {canManageProposals && <><section className={styles.followUpGrid}>
        <article><span>Perlu revisi</span><strong>{revisionRequests.length}</strong><small>Permintaan klien yang perlu dibuatkan versi baru.</small></article>
        <article><span>Menunggu respons</span><strong>{awaitingResponse.length}</strong><small>Proposal shared tanpa keputusan klien.</small></article>
        <article><span>Diterima klien</span><strong>{acceptedProposals.length}</strong><small>Keputusan accepted pada versi aktif.</small></article>
        <article><span>Berakhir ≤ 7 hari</span><strong>{expiringSoon.length}</strong><small>Perlu follow-up sebelum masa berlaku habis.</small></article>
      </section>
      <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>MVP funnel</p><h2>Konversi Discovery ke keputusan klien</h2></div></div><div className={styles.grid}><article><span>Discovery submitted</span><strong>{submittedDiscoveries}</strong><small>Baseline seluruh data tenant.</small></article><article><span>Discovery approved</span><strong>{approvedDiscoveries}</strong><small>{percent(approvedDiscoveries,submittedDiscoveries)} dari submitted.</small></article><article><span>Proposal dibuat</span><strong>{proposals?.length??0}</strong><small>{percent(proposals?.length??0,approvedDiscoveries)} dari Discovery approved.</small></article><article><span>Proposal shared</span><strong>{sharedProposals.length}</strong><small>{percent(sharedProposals.length,proposals?.length??0)} dari proposal.</small></article><article><span>Diterima klien</span><strong>{acceptedProposals.length}</strong><small>{percent(acceptedProposals.length,sharedProposals.length)} dari shared.</small></article></div></section>
      <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Notification inbox</p><h2>Notifikasi tim QIRA</h2></div><span className={styles.neutralBadge}>{notifications?.filter((item:any)=>!item.read_at).length??0} belum dibaca</span></div>{!notifications?.length&&<p className={styles.empty}>Belum ada notifikasi.</p>}{notifications?.slice(0,8).map((item:any)=><div className={styles.attentionRow} key={item.id}><Link href={item.proposal_id?`/workspace/proposals/${item.proposal_id}`:"/workspace"}><strong>{item.title}</strong><p>{item.body} · {new Date(item.created_at).toLocaleString("id-ID")}</p></Link>{!item.read_at&&<form action={markNotificationRead}><input name="notification_id" type="hidden" value={item.id}/><button type="submit">Tandai dibaca</button></form>}</div>)}</section>
      <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Action queue</p><h2>Tindak lanjut prioritas</h2></div></div>{!revisionRequests.length && !expiringSoon.length && !awaitingResponse.length && <p className={styles.empty}>Tidak ada proposal yang memerlukan tindak lanjut saat ini.</p>}{revisionRequests.map((proposal) => <Link className={styles.attentionRow} href={`/workspace/proposals/${proposal.id}`} key={`revision-${proposal.id}`}><div><strong>{proposal.client_name}</strong><p>{decisionByVersion.get(`${proposal.id}:${proposal.version}`)?.comment}</p></div><span className={styles.urgentBadge}>Buat revisi</span></Link>)}{expiringSoon.filter((proposal) => !revisionRequests.some((item) => item.id === proposal.id)).map((proposal) => <Link className={styles.attentionRow} href={`/workspace/proposals/${proposal.id}`} key={`expiry-${proposal.id}`}><div><strong>{proposal.client_name}</strong><p>{proposal.proposal_number} · berlaku sampai {proposal.valid_until}</p></div><span className={styles.warningBadge}>Segera berakhir</span></Link>)}{awaitingResponse.filter((proposal) => !expiringSoon.some((item) => item.id === proposal.id)).slice(0, 5).map((proposal) => <Link className={styles.attentionRow} href={`/workspace/proposals/${proposal.id}`} key={`waiting-${proposal.id}`}><div><strong>{proposal.client_name}</strong><p>{proposal.proposal_number} · versi {proposal.version}</p></div><span className={styles.neutralBadge}>Follow-up</span></Link>)}</section>
      <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Client activity</p><h2>Aktivitas terbaru</h2></div></div>{!clientEvents?.length && <p className={styles.empty}>Belum ada aktivitas klien.</p>}{clientEvents?.slice(0, 8).map((event: any) => { const proposal = proposalById.get(event.proposal_id); return <Link className={styles.row} href={`/workspace/proposals/${event.proposal_id}`} key={event.id}><strong>{proposal?.client_name ?? "Proposal"}</strong><span>PDF diunduh · versi {event.proposal_version}</span><span>{new Date(event.occurred_at).toLocaleString("id-ID")}</span></Link>; })}</section></>}
      <section className={styles.panel}>
        {canManageProposals && <Link className={styles.primaryAction} href="/workspace/invitations">Kelola undangan</Link>}
        <div className={styles.panelHeading}><div><p className={styles.kicker}>Discovery terbaru</p><h2>Submission untuk direview</h2></div><Link className={styles.primaryAction} href="/discovery">Mulai Discovery</Link></div>
        {!discoveries?.length && <p className={styles.empty}>Belum ada Discovery resmi pada organisasi ini.</p>}
        {discoveries?.map((discovery) => <Link className={styles.row} href={`/workspace/discoveries/${discovery.id}`} key={discovery.id}><strong>{discovery.service_ids.join(", ")}</strong><span>Versi {discovery.version}</span><span>{discovery.status}</span></Link>)}
      </section>
      <section className={styles.panel}>
        <div className={styles.panelHeading}><div><p className={styles.kicker}>Proposal terbaru</p><h2>Data sesuai tenant Anda</h2></div>{canManageProposals && <Link className={styles.primaryAction} href="/workspace/proposals/new">Buat proposal</Link>}</div>
        {!memberships?.length && <p className={styles.empty}>Akun sudah terautentikasi, tetapi belum memiliki membership organisasi. Founder QIRA perlu menghubungkan akun ini ke organisasi.</p>}
        {!!memberships?.length && !proposals?.length && <p className={styles.empty}>Belum ada proposal tersimpan pada organisasi ini.</p>}
        {latestProposals.map((proposal) => <Link className={styles.row} href={`/workspace/proposals/${proposal.id}`} key={proposal.id}><strong>{proposal.proposal_number}</strong><span>{proposal.client_name}</span><span>{proposal.status}</span></Link>)}
      </section>
    </main>
  );
}
