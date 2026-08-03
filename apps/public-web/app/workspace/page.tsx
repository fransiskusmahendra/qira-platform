import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "../../lib/supabase/server";
import { signOut } from "./actions";
import styles from "./workspace.module.css";

export default async function WorkspacePage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect("/login");

  const [{ data: memberships }, { data: proposals }, { data: discoveries }] = await Promise.all([
    supabase.from("memberships").select("organization_id, role, organizations(name, slug)").eq("status", "active"),
    supabase.from("proposals").select("id, proposal_number, client_name, status, updated_at").order("updated_at", { ascending: false }).limit(10),
    supabase.from("discoveries").select("id, service_ids, status, version, updated_at").order("updated_at", { ascending: false }).limit(10),
  ]);
  const canManageProposals = memberships?.some((item) => item.role === "qira_consultant" || item.role === "qira_admin");

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
      <section className={styles.panel}>
        <div className={styles.panelHeading}><div><p className={styles.kicker}>Discovery terbaru</p><h2>Submission untuk direview</h2></div><Link className={styles.primaryAction} href="/discovery">Mulai Discovery</Link></div>
        {!discoveries?.length && <p className={styles.empty}>Belum ada Discovery resmi pada organisasi ini.</p>}
        {discoveries?.map((discovery) => <Link className={styles.row} href={`/workspace/discoveries/${discovery.id}`} key={discovery.id}><strong>{discovery.service_ids.join(", ")}</strong><span>Versi {discovery.version}</span><span>{discovery.status}</span></Link>)}
      </section>
      <section className={styles.panel}>
        <div className={styles.panelHeading}><div><p className={styles.kicker}>Proposal terbaru</p><h2>Data sesuai tenant Anda</h2></div>{canManageProposals && <Link className={styles.primaryAction} href="/workspace/proposals/new">Buat proposal</Link>}</div>
        {!memberships?.length && <p className={styles.empty}>Akun sudah terautentikasi, tetapi belum memiliki membership organisasi. Founder QIRA perlu menghubungkan akun ini ke organisasi.</p>}
        {!!memberships?.length && !proposals?.length && <p className={styles.empty}>Belum ada proposal tersimpan pada organisasi ini.</p>}
        {proposals?.map((proposal) => <Link className={styles.row} href={`/workspace/proposals/${proposal.id}`} key={proposal.id}><strong>{proposal.proposal_number}</strong><span>{proposal.client_name}</span><span>{proposal.status}</span></Link>)}
      </section>
    </main>
  );
}
