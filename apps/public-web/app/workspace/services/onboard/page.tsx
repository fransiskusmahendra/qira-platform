import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "../../../../lib/supabase/server";
import styles from "../../workspace.module.css";
import { onboardCustomer } from "../actions";

const packageIds = new Set(["digital-foundation", "growth-engine", "connected-growth", "custom"]);

const checklist = [
  "Masalah, hasil, waktu, dan harga sudah disepakati.",
  "Invoice pembayaran awal/DP sudah dikirim.",
  "Pembayaran awal diterima atau pengecualiannya disepakati tertulis.",
  "PIC dan jalur komunikasi sudah jelas.",
  "Data atau akses yang dibutuhkan sudah diketahui.",
  "Kickoff dijadwalkan setelah syarat mulai terpenuhi.",
] as const;

export default async function OnboardCustomerPage({ searchParams }: { searchParams: Promise<{ error?: string; leadId?: string; customerName?: string; contactName?: string; contactEmail?: string; contactWhatsapp?: string; packageId?: string }> }) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/login");
  const membership = await supabase.from("memberships").select("role").eq("user_id", String(claims.claims.sub)).eq("status", "active");
  if (!membership.data?.some((item) => item.role === "qira_admin" || item.role === "qira_consultant")) redirect("/client");

  const params = await searchParams;
  const packageId = packageIds.has(params.packageId ?? "") ? params.packageId! : "digital-foundation";
  const fromLead = Boolean(params.leadId && /^[0-9a-f-]{36}$/i.test(params.leadId));

  return <main className={styles.page}>
    <header className={styles.header}><div><Link className={styles.brand} href="/workspace">QIRA.</Link><p>Onboarding</p></div><Link href="/workspace/services">Kembali</Link></header>

    <section className={styles.hero}>
      <p className={styles.kicker}>Setelah pelanggan bilang ya</p>
      <h1>Siap mulai?</h1>
      <p>{fromLead ? "Data calon pelanggan sudah dibawa. Lengkapi project dan konfirmasi syarat mulai." : "Isi data inti, lalu konfirmasi dua syarat mulai."}</p>
    </section>

    <section className={styles.panel}>
      {params.error ? <p className={styles.formError}>{params.error === "invalid" ? "Periksa data wajib dan konfirmasi syarat mulai." : "Data belum berhasil disimpan. Coba lagi."}</p> : null}
      <div className={styles.panelHeading}><div><p className={styles.kicker}>Pelanggan & project</p><h2>Satu form untuk mulai.</h2></div></div>
      <form action={onboardCustomer} className={styles.onboardForm}>
        {fromLead ? <input type="hidden" name="leadId" value={params.leadId}/> : null}
        <label>Nama pelanggan / usaha<input name="customerName" required minLength={2} maxLength={160} defaultValue={params.customerName ?? ""}/></label>
        <label>Jenis pelanggan<select name="customerType" defaultValue="umkm"><option value="umkm">UMKM</option><option value="company">Perusahaan</option><option value="enterprise">Enterprise</option></select></label>
        <label>Nama PIC<input name="contactName" maxLength={160} defaultValue={params.contactName ?? ""}/></label>
        <label>Email PIC<input name="contactEmail" type="email" maxLength={254} defaultValue={params.contactEmail ?? ""}/></label>
        <label>WhatsApp PIC<input name="contactWhatsapp" inputMode="tel" maxLength={32} defaultValue={params.contactWhatsapp ?? ""}/></label>
        <label>Nama project<input name="projectName" required minLength={2} maxLength={180} defaultValue={params.customerName ? `Solusi QIRA untuk ${params.customerName}` : ""}/></label>
        <label>Paket<select name="packageId" defaultValue={packageId}><option value="digital-foundation">Digital Foundation</option><option value="growth-engine">Growth Engine</option><option value="connected-growth">Connected Growth</option><option value="custom">Custom</option></select></label>
        <label>Pengelolaan<select name="managementModel" defaultValue="qira_managed"><option value="qira_managed">QIRA tetap membantu</option><option value="hybrid">Dikelola bersama</option><option value="customer_managed">Pelanggan mengelola sendiri</option></select></label>
        <label>Care bulanan (Rp)<input name="monthlyAmount" type="number" min="0" step="1000" defaultValue="0"/></label>
        <label><input name="agreementConfirmed" type="checkbox" required/> Kesepakatan pekerjaan dan harga sudah jelas.</label>
        <label><input name="startPaymentConfirmed" type="checkbox" required/> DP sudah diterima atau pengecualiannya tercatat tertulis.</label>
        <button className={styles.primaryAction} type="submit">Buat pelanggan & project</button>
      </form>
    </section>

    <details className={styles.panel}><summary>Checklist lengkap sebelum kickoff</summary><ol>{checklist.map((item) => <li key={item}>{item}</li>)}</ol></details>

    <details className={styles.panel}><summary>Alur setelah project dibuat</summary><div className={styles.followUpGrid}><article><span>1</span><strong>Kickoff</strong><small>Samakan PIC, tujuan, scope, dan jadwal.</small></article><article><span>2</span><strong>Data</strong><small>Minta hanya data atau akses yang diperlukan.</small></article><article><span>3</span><strong>Coba</strong><small>Tunjukkan hasil awal dan koreksi arah lebih cepat.</small></article><article><span>4</span><strong>Serah terima</strong><small>Rapikan revisi, pelunasan, akses, dan dukungan.</small></article></div></details>
  </main>;
}
