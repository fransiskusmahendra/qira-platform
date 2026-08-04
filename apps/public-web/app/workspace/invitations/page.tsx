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

  return <main className={styles.page}>
    <header className={styles.header}><Link className={styles.brand} href="/workspace">QIRA.</Link><Link href="/workspace">Kembali</Link></header>
    <section className={styles.formHeader}><p className={styles.kicker}>Identity and access</p><h1>Undang anggota organisasi.</h1><p>Token berlaku tujuh hari, hanya dapat dipakai sekali, dan email login harus cocok.</p></section>
    {query.error?.startsWith("revoke") && <p className={styles.alert}>Akses belum dapat ditangguhkan. Periksa alasan, membership aktif, dan hak akses admin.</p>}
    {query.error && !query.error.startsWith("revoke") && <p className={styles.alert}>Undangan gagal dibuat. Periksa email, role, dan hak akses admin.</p>}
    {query.revoked === "1" && <p className={styles.success}>Akses anggota berhasil ditangguhkan dan seluruh RLS langsung menolak membership tersebut.</p>}
    {invitationUrl && <section className={styles.panel}><p className={styles.kicker}>Salin sekarang - token hanya ditampilkan sekali</p><code>{invitationUrl}</code><p>Role: {query.role}</p></section>}
    <form action={createInvitation} className={styles.proposalForm}>
      <fieldset><legend>Penerima</legend><label>Email<input name="email" type="email" required /></label><label>Role<select name="role" defaultValue="client_viewer"><option value="prospect_member">Prospect member</option><option value="client_viewer">Client viewer</option><option value="client_member">Client member</option></select></label></fieldset>
      <button className={styles.primaryAction} type="submit">Buat invitation link</button>
    </form>
    <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Riwayat</p><h2>Undangan terbaru</h2></div></div>{!invitations?.length && <p className={styles.empty}>Belum ada undangan.</p>}{invitations?.map((item: any) => { const expired = item.status === "pending" && new Date(item.expires_at) < new Date(); const label = expired ? "expired" : item.status; return <div className={styles.row} key={item.id}><strong>{item.email}</strong><span>{item.role}</span><span>{label} · {item.accepted_at ? `diterima ${new Date(item.accepted_at).toLocaleDateString("id-ID")}` : `berlaku s.d. ${new Date(item.expires_at).toLocaleDateString("id-ID")}`}</span></div>; })}</section>
    <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Active access</p><h2>Membership organisasi</h2></div></div>{memberships?.filter((item:any)=>item.status==="active").map((item:any)=><div className={styles.attentionRow} key={`${item.organization_id}:${item.user_id}`}><div><strong>{item.role}</strong><p>User ID {item.user_id}</p></div>{item.user_id!==currentUser?.user?.id&&<form action={revokeMembership}><input type="hidden" name="organization_id" value={item.organization_id}/><input type="hidden" name="user_id" value={item.user_id}/><input name="reason" placeholder="Alasan pencabutan akses" minLength={5} required/><button type="submit">Cabut akses</button></form>}</div>)}</section>
  </main>;
}
