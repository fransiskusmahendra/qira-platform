import { redirect } from "next/navigation";

import { createClient } from "../../lib/supabase/server";
import { signOut } from "./actions";
import styles from "./workspace.module.css";

export default async function WorkspacePage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect("/login");

  const [{ data: memberships }, { data: proposals }] = await Promise.all([
    supabase.from("memberships").select("organization_id, role, organizations(name, slug)").eq("status", "active"),
    supabase.from("proposals").select("id, proposal_number, client_name, status, updated_at").order("updated_at", { ascending: false }).limit(10),
  ]);

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
        <article><span>Status koneksi</span><strong>Protected</strong></article>
      </section>
      <section className={styles.panel}>
        <div><p className={styles.kicker}>Proposal terbaru</p><h2>Data sesuai tenant Anda</h2></div>
        {!memberships?.length && <p className={styles.empty}>Akun sudah terautentikasi, tetapi belum memiliki membership organisasi. Founder QIRA perlu menghubungkan akun ini ke organisasi.</p>}
        {!!memberships?.length && !proposals?.length && <p className={styles.empty}>Belum ada proposal tersimpan pada organisasi ini.</p>}
        {proposals?.map((proposal) => <div className={styles.row} key={proposal.id}><strong>{proposal.proposal_number}</strong><span>{proposal.client_name}</span><span>{proposal.status}</span></div>)}
      </section>
    </main>
  );
}
