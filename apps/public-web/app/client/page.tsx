import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "../../lib/supabase/server";
import { signOut } from "../workspace/actions";
import styles from "../workspace/workspace.module.css";

export default async function ClientWorkspacePage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) redirect("/login");

  const [{ data: memberships }, { data: proposals }] = await Promise.all([
    supabase.from("memberships").select("organization_id, role, organizations(name)").eq("status", "active"),
    supabase.from("proposals").select("id, proposal_number, client_name, status, valid_until, updated_at").eq("status", "shared").order("updated_at", { ascending: false }),
  ]);
  const isClient = memberships?.some(({ role }) => role === "client_viewer" || role === "client_member");
  if (!isClient) redirect("/workspace");

  return <main className={styles.page}>
    <header className={styles.header}><div><span className={styles.brand}>QIRA.</span><p>Dokumen</p></div><form action={signOut}><button type="submit">Keluar</button></form></header>
    <section className={styles.hero}><p className={styles.kicker}>Untuk Anda</p><h1>Penawaran QIRA.</h1></section>
    <section className={styles.panel}>
      {!proposals?.length && <p className={styles.empty}>Belum ada dokumen.</p>}
      {proposals?.map((proposal) => <Link className={styles.row} href={`/client/proposals/${proposal.id}`} key={proposal.id}><strong>{proposal.proposal_number}</strong><span>{proposal.client_name}</span><span>s.d. {proposal.valid_until}</span></Link>)}
    </section>
  </main>;
}
