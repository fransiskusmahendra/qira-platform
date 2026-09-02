import Link from "next/link";
import { redirect } from "next/navigation";

import { PROPOSAL_PACKAGES } from "@qira/domain";
import { createClient } from "../../../lib/supabase/server";
import { CopyTemplate } from "./CopyTemplate";
import styles from "./sales.module.css";
import workspace from "../workspace.module.css";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const packagePurpose: Record<string, string> = {
  "digital-foundation": "Lebih mudah ditemukan dan dihubungi.",
  "growth-engine": "Lead, pendaftaran, atau pesanan lebih rapi.",
  "connected-growth": "Pekerjaan inti lebih terhubung dan mudah dipantau.",
};
const templates = [
  { title: "Belum dibalas", text: "Halo Pak/Bu [Nama], izin follow-up pesan saya sebelumnya. Kalau berkenan, cukup ceritakan satu bagian pekerjaan yang paling terasa repot sekarang. Dari situ saya bantu lihat apakah QIRA relevan atau tidak." },
  { title: "Sudah tertarik", text: "Terima kasih Pak/Bu [Nama]. Supaya yang kami tawarkan tidak berlebihan, masalah apa yang paling ingin dibuat lebih mudah dan hasil apa yang paling ingin terasa? Setelah itu saya rangkum arah, waktu, dan kisaran biayanya." },
  { title: "Minta harga", text: "Sebagai gambaran awal, paket QIRA mulai dari Rp1,5 juta, Rp2,9 juta, dan Rp4,9 juta tergantung kebutuhan. Harga final dipastikan setelah kebutuhan utama jelas. Skema standar 50% saat mulai dan 50% setelah hasil utama selesai." },
  { title: "Sudah setuju", text: "Terima kasih Pak/Bu [Nama]. Saya rangkum masalah, hasil, waktu, dan biaya yang disepakati. Setelah disetujui, saya kirim invoice pembayaran awal 50%, lalu kita mulai kickoff." },
] as const;
const offerSteps = ["Masalah", "Hasil", "Waktu", "Harga"] as const;

export default async function SalesPlaybookPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/login");
  const { data: memberships } = await supabase.from("memberships").select("role").eq("status", "active");
  if (!memberships?.some((item) => item.role === "qira_admin" || item.role === "qira_consultant")) redirect("/client");

  return <main className={`${workspace.page} ${styles.page}`}>
    <header className={workspace.header}>
      <div><Link className={workspace.brand} href="/workspace">QIRA.</Link><p>Jualan</p></div>
      <div className={workspace.panelActions}><Link href="/workspace/leads">Leads</Link><Link className={workspace.primaryAction} href="/workspace">Workspace</Link></div>
    </header>

    <section className={workspace.hero}>
      <p className={workspace.kicker}>Prinsip utama</p>
      <h1>Jual hasilnya.</h1>
      <p>Masalah → hasil → waktu → harga. Itu saja yang harus cepat dipahami.</p>
    </section>

    <section className={workspace.panel}>
      <div className={workspace.panelHeading}><div><p className={workspace.kicker}>Penawaran</p><h2>Empat hal</h2></div><Link href="/workspace/proposals/new">Buat proposal →</Link></div>
      <div className={styles.offerGrid}>{offerSteps.map((step, index) => <article className={styles.offer} key={step}><span>{index + 1}</span><h3>{step}</h3></article>)}</div>
    </section>

    <section className={workspace.panel}>
      <div className={workspace.panelHeading}><div><p className={workspace.kicker}>Harga awal</p><h2>Tiga pilihan</h2></div></div>
      <div className={styles.packageGrid}>{PROPOSAL_PACKAGES.map((item) => <article className={styles.card} key={item.id}>
        <h3>{item.name}</h3>
        <strong className={styles.packagePrice}>{rupiah.format(item.introductoryPriceIdr)}</strong>
        <p>{packagePurpose[item.id] ?? item.tagline}</p>
      </article>)}</div>
      <p><strong>50% mulai · 50% setelah hasil utama selesai.</strong></p>
    </section>

    <section className={workspace.panel}>
      <div className={workspace.panelHeading}><div><p className={workspace.kicker}>WhatsApp</p><h2>Pilih satu template</h2></div></div>
      <div className={styles.templateGrid}>{templates.map((template) => <details className={styles.template} key={template.title}><summary><strong>{template.title}</strong></summary><CopyTemplate text={template.text}/></details>)}</div>
    </section>

    <details className={workspace.panel}>
      <summary><strong>Aturan singkat</strong></summary>
      <ul className={styles.rules}>
        <li>Mulai dari satu masalah, bukan fitur.</li>
        <li>Pastikan satu hasil utama jelas sebelum harga final.</li>
        <li>Jangan menawarkan yang belum dibutuhkan.</li>
        <li>Setelah setuju: pembayaran awal → kickoff → pengerjaan.</li>
      </ul>
    </details>
  </main>;
}
