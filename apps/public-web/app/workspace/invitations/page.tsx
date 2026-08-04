import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "../../../lib/supabase/server";
import styles from "../workspace.module.css";
import { createInvitation } from "./actions";

export default async function InvitationsPage({ searchParams }: { searchParams: Promise<{ token?: string; role?: string; error?: string }> }) {
  const query = await searchParams;
  const supabase: any = await createClient();
  const { data: memberships } = await supabase.from("memberships").select("role").eq("status", "active");
  if (!memberships?.some(({ role }: { role: string }) => role === "qira_admin")) redirect("/workspace");
  const { data: invitations } = await supabase.from("invitations").select("id,email,role,status,expires_at,created_at").order("created_at", { ascending: false }).limit(20);
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "";
  const protocol = headerList.get("x-forwarded-proto") ?? "https";
  const invitationUrl = query.token ? `${protocol}://${host}/invite/accept?token=${encodeURIComponent(query.token)}` : undefined;

  return <main className={styles.page}>
    <header className={styles.header}><Link className={styles.brand} href="/workspace">QIRA.</Link><Link href="/workspace">Kembali</Link></header>
    <section className={styles.formHeader}><p className={styles.kicker}>Identity and access</p><h1>Undang anggota organisasi.</h1><p>Token berlaku tujuh hari, hanya dapat dipakai sekali, dan email login harus cocok.</p></section>
    {query.error && <p className={styles.alert}>Undangan gagal dibuat. Periksa email, role, dan hak akses admin.</p>}
    {invitationUrl && <section className={styles.panel}><p className={styles.kicker}>Salin sekarang - token hanya ditampilkan sekali</p><code>{invitationUrl}</code><p>Role: {query.role}</p></section>}
    <form action={createInvitation} className={styles.proposalForm}>
      <fieldset><legend>Penerima</legend><label>Email<input name="email" type="email" required /></label><label>Role<select name="role" defaultValue="client_viewer"><option value="prospect_member">Prospect member</option><option value="client_viewer">Client viewer</option><option value="client_member">Client member</option></select></label></fieldset>
      <button className={styles.primaryAction} type="submit">Buat invitation link</button>
    </form>
    <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Riwayat</p><h2>Undangan terbaru</h2></div></div>{!invitations?.length && <p className={styles.empty}>Belum ada undangan.</p>}{invitations?.map((item: any) => <div className={styles.row} key={item.id}><strong>{item.email}</strong><span>{item.role}</span><span>{item.status} · {new Date(item.expires_at).toLocaleDateString("id-ID")}</span></div>)}</section>
  </main>;
}
