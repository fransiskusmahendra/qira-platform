import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "../../../../lib/supabase/server";
import styles from "../../workspace.module.css";
import { onboardCustomer } from "../actions";

const packageIds = new Set(["digital-foundation", "growth-engine", "connected-growth", "custom"]);

const checklist = [
  "Masalah, hasil, waktu, dan harga sudah disepakati.",
  "Invoice pembayaran awal/DP sudah dikirim.",
  "Pembayaran awal diterima atau pengecualian pembayaran awal disepakati secara tertulis.",
  "PIC dan jalur komunikasi sudah jelas.",
  "Data atau akses yang benar-benar dibutuhkan sudah diketahui.",
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
    <header className={styles.header}>
      <div><Link className={styles.brand} href="/workspace">QIRA.</Link><p>Setelah pelanggan bilang “ya”</p></div>
      <div className={styles.panelActions}><Link href="/workspace/sales">Panduan jualan</Link><Link className={styles.primaryAction} href="/workspace/services">Pelanggan & layanan</Link></div>
    </header>

    <section className={styles.hero}>
      <p className={styles.kicker}>Mulai project dengan rapi</p>
      <h1>Jangan langsung mulai membuat. Pastikan syarat mulainya sudah jelas.</h1>
      <p>{fromLead ? "Data dasar sudah dibawa dari calon pelanggan yang dinyatakan menang. Lengkapi detail project dan konfirmasi dua syarat mulai sebelum membuat record pelanggan." : "Gunakan halaman ini setelah kesepakatan komersial sudah jelas dan project memang siap dimulai."}</p>
    </section>

    <section className={styles.panel}>
      <div className={styles.panelHeading}><div><p className={styles.kicker}>Checklist sebelum mulai</p><h2>Urutan standar QIRA</h2></div></div>
      <div className={styles.followUpGrid}>{checklist.map((item, index) => <article key={item}><span>Langkah {index + 1}</span><strong>{index + 1}</strong><small>{item}</small></article>)}</div>
    </section>

    <section className={styles.panel}>
      {params.error ? <p className={styles.formError}>{params.error === "invalid" ? "Periksa kembali data wajib dan konfirmasi syarat mulai." : "Data belum berhasil disimpan. Silakan coba kembali."}</p> : null}
      <div className={styles.panelHeading}><div><p className={styles.kicker}>Buat record pelanggan</p><h2>Isi yang diperlukan untuk mulai mengelola project.</h2></div></div>
      <form action={onboardCustomer} className={styles.onboardForm}>
        {fromLead ? <input type="hidden" name="leadId" value={params.leadId}/> : null}
        <label>Nama pelanggan / usaha<input name="customerName" required minLength={2} maxLength={160} defaultValue={params.customerName ?? ""} placeholder="Contoh: Laundry Bersih Jaya"/></label>
        <label>Jenis pelanggan<select name="customerType" defaultValue="umkm"><option value="umkm">UMKM</option><option value="company">Perusahaan</option><option value="enterprise">Enterprise</option></select></label>
        <label>Nama PIC<input name="contactName" maxLength={160} defaultValue={params.contactName ?? ""} placeholder="Nama kontak utama"/></label>
        <label>Email PIC<input name="contactEmail" type="email" maxLength={254} defaultValue={params.contactEmail ?? ""} placeholder="nama@perusahaan.com"/></label>
        <label>WhatsApp PIC<input name="contactWhatsapp" inputMode="tel" maxLength={32} defaultValue={params.contactWhatsapp ?? ""} placeholder="08..."/></label>
        <label>Nama project<input name="projectName" required minLength={2} maxLength={180} defaultValue={params.customerName ? `Solusi QIRA untuk ${params.customerName}` : ""} placeholder="Contoh: Sistem Pendaftaran & Follow-up"/></label>
        <label>Paket<select name="packageId" defaultValue={packageId}><option value="digital-foundation">Digital Foundation</option><option value="growth-engine">Growth Engine</option><option value="connected-growth">Connected Growth</option><option value="custom">Custom</option></select></label>
        <label>Pengelolaan setelah selesai<select name="managementModel" defaultValue="qira_managed"><option value="qira_managed">QIRA tetap membantu</option><option value="hybrid">Dikelola bersama</option><option value="customer_managed">Pelanggan mengelola sendiri</option></select></label>
        <label>Care / pendampingan bulanan (Rp)<input name="monthlyAmount" type="number" min="0" step="1000" defaultValue="0"/></label>
        <label><input name="agreementConfirmed" type="checkbox" required/> Masalah, hasil, waktu, dan harga sudah disepakati.</label>
        <label><input name="startPaymentConfirmed" type="checkbox" required/> Pembayaran awal/DP sudah diterima, atau pengecualiannya memang disepakati secara tertulis.</label>
        <button className={styles.primaryAction} type="submit">Buat pelanggan & mulai project</button>
      </form>
    </section>

    <section className={styles.panel}>
      <div className={styles.panelHeading}><div><p className={styles.kicker}>Setelah record dibuat</p><h2>Apa yang dilakukan berikutnya?</h2></div></div>
      <div className={styles.followUpGrid}>
        <article><span>Kickoff</span><strong>1</strong><small>Pastikan PIC, tujuan, batas pekerjaan, dan jadwal pertama sama-sama dipahami.</small></article>
        <article><span>Data</span><strong>2</strong><small>Minta hanya data atau akses yang memang dibutuhkan untuk pekerjaan.</small></article>
        <article><span>Hasil awal</span><strong>3</strong><small>Tunjukkan hasil pertama secepat mungkin agar arah bisa dikoreksi lebih awal.</small></article>
        <article><span>Revisi</span><strong>4</strong><small>Rapikan sesuai jumlah revisi dan kesepakatan yang berlaku.</small></article>
        <article><span>Pelunasan</span><strong>5</strong><small>Setelah hasil utama selesai sesuai kesepakatan, lanjutkan pembayaran akhir.</small></article>
        <article><span>Serah terima</span><strong>6</strong><small>Pastikan akses, panduan singkat, dukungan awal, dan Care bila dipilih sudah jelas.</small></article>
      </div>
    </section>
  </main>;
}
