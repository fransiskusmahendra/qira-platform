import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "../../../lib/supabase/server";
import styles from "../workspace.module.css";
import { createInvitation, revokeMembership } from "./actions";

export default async function InvitationsPage({ searchParams }: { searchParams: Promise<{ token?: string; role?: string; error?: string; revoked?: string }> }) {
  const query = await searchParams;
  const supabase: any = await createClient();
  const { data: currentUser } = await supabase.auth.getUser();
  const { data: memberships } = await supabase.from("memberships").select("organization_id,user_id,role,status,updated_at").order("updated_at", { ascending: false });
  if (!memberships?.some(({ role }: { role: string }) => role === "qira_admin")) redirect("/workspace");
  const { data: invitations } = await supabase.from("invitations").select("id,email,role,status,expires_at,created_at,accepted_at").order("created_at", { ascending: false }).limit(20);
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "";
  const protocol = headerList.get("x-forwarded-proto") ?? "https";
  const invitationUrl = query.token ? `${protocol}://${host}/invite/accept?token=${encodeURIComponent(query.token)}` : undefined;
  const activeMemberships = memberships?.filter((item: any) => item.status === "active") ?? [];

  return <main className={styles.page}>
    <header className={styles.header}><Link className={styles.brand} href="/workspace">QIRA.</Link><Link href="/workspace">Kembali</Link></header>
    <section className={styles.formHeader}><p className={styles.kicker}>Akses</p><h1>Undang orang.</h1><p>Email + role → buat tautan.</p></section>

    {query.error && <p className={styles.alert}>{query.error.startsWith("revoke") ? "Akses belum dapat dicabut." : "Undangan belum berhasil dibuat."}</p>}
    {query.revoked === "1" && <p className={styles.success}>Akses berhasil dicabut.</p>}

    {invitationUrl && <section className={styles.panel}><p className={styles.kicker}>Salin sekarang</p><h2>Tautan undangan</h2><code>{invitationUrl}</code><p>{query.role}</p></section>}

    <form action={createInvitation} className={styles.proposalForm}>
      <fieldset><legend>Undangan baru</legend><label>Email<input name="email" type="email" required /></label><label>Role<select name="role" defaultValue="client_viewer"><option value="prospect_member">Prospect</option><option value="client_viewer">Client viewer</option><option value="client_member">Client member</option></select></label></fieldset>
      <button className={styles.primaryAction} type="submit">Buat tautan</button>
    </form>

    <details className={styles.panel}><summary>Undangan terbaru ({invitations?.length ?? 0})</summary>{!invitations?.length && <p className={styles.empty}>Belum ada undangan.</p>}{invitations?.map((item: any) => { const expired = item.status === "pending" && new Date(item.expires_at) < new Date(); const label = expired ? "expired" : item.status; return <div className={styles.row} key={item.id}><strong>{item.email}</strong><span>{item.role}</span><span>{label}</span></div>; })}</details>

    <details className={styles.panel}><summary>Akses aktif ({activeMemberships.length})</summary>{activeMemberships.map((item: any) => <div className={styles.attentionRow} key={`${item.organization_id}:${item.user_id}`}><div><strong>{item.role}</strong><p>{item.user_id}</p></div>{item.user_id !== currentUser?.user?.id && <details><summary>Cabut akses</summary><form action={revokeMembership}><input type="hidden" name="organization_id" value={item.organization_id}/><input type="hidden" name="user_id" value={item.user_id}/><input name="reason" placeholder="Alasan" minLength={5} required/><button type="submit">Cabut</button></form></details>}</div>)}</details>
  </main>;
}
