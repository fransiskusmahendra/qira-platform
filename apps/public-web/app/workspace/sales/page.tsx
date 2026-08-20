import Link from "next/link";
import { redirect } from "next/navigation";

import { PROPOSAL_PACKAGES } from "@qira/domain";
import { createClient } from "../../../lib/supabase/server";
import { CopyTemplate } from "./CopyTemplate";
import styles from "./sales.module.css";
import workspace from "../workspace.module.css";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

const packagePurpose: Record<string, string> = {
  "digital-foundation": "Agar usaha lebih mudah ditemukan, dipahami, dan dihubungi.",
  "growth-engine": "Agar calon pelanggan, pendaftaran, atau pesanan lebih rapi.",
  "connected-growth": "Agar pekerjaan inti lebih terhubung dan lebih mudah dipantau.",
};

const templates = [
  {
    title: "Belum dibalas",
    text: "Halo Pak/Bu [Nama], izin follow-up pesan saya sebelumnya. Tidak perlu membahas teknologi dulu. Kalau berkenan, cukup ceritakan satu bagian pekerjaan yang paling terasa repot sekarang. Dari situ saya bantu lihat apakah QIRA memang relevan atau tidak. Kalau belum sempat, tidak apa-apa.",
  },
  {
    title: "Calon pelanggan tertarik",
    text: "Terima kasih Pak/Bu [Nama]. Supaya yang kami tawarkan tidak berlebihan, saya ingin memastikan satu hal dulu: masalah apa yang paling ingin dibuat lebih mudah, dan hasil apa yang paling ingin terasa setelah dibantu? Setelah itu saya rangkum arah, waktu, dan kisaran biayanya dengan sederhana.",
  },
  {
    title: "Langsung minta harga",
    text: "Bisa Pak/Bu. Sebagai gambaran awal, paket QIRA mulai dari Rp1,5 juta, Rp2,9 juta, dan Rp4,9 juta tergantung kebutuhan. Harga final baru saya pastikan setelah kebutuhan utamanya jelas supaya Bapak/Ibu tidak membayar fitur yang tidak diperlukan. Skema standar QIRA 50% saat mulai dan 50% setelah hasil utama selesai sesuai kesepakatan.",
  },
  {
    title: "Sudah bilang ya",
    text: "Terima kasih Pak/Bu [Nama]. Saya rangkum dulu masalah yang disepakati, hasil yang akan dibuat, waktu pengerjaan, dan biayanya. Setelah Bapak/Ibu menyetujui ringkasannya, saya kirim invoice pembayaran awal 50%. Setelah pembayaran awal diterima, kita mulai kickoff dan penyiapan data yang dibutuhkan.",
  },
] as const;

const offerSteps = [
  { title: "Masalah", copy: "Tulis satu masalah utama dengan bahasa pelanggan." },
  { title: "Yang QIRA bantu", copy: "Jelaskan apa yang akan dibuat lebih mudah, bukan daftar fitur." },
  { title: "Hasil", copy: "Sebutkan perubahan yang bisa dirasakan setelah selesai." },
  { title: "Waktu", copy: "Berikan rentang pengerjaan yang realistis." },
  { title: "Harga", copy: "Tampilkan harga awal dan cara pembayaran dengan jelas." },
] as const;

export default async function SalesPlaybookPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/login");
  const { data: memberships } = await supabase.from("memberships").select("role").eq("status", "active");
  if (!memberships?.some((item) => item.role === "qira_admin" || item.role === "qira_consultant")) redirect("/client");

  return <main className={`${workspace.page} ${styles.page}`}>
    <header className={workspace.header}>
      <div><Link className={workspace.brand} href="/workspace">QIRA.</Link><p>Panduan jualan</p></div>
      <div className={workspace.panelActions}><Link href="/workspace/leads">Penjualan & follow-up</Link><Link className={workspace.primaryAction} href="/workspace">Workspace utama</Link></div>
    </header>

    <section className={workspace.hero}>
      <p className={workspace.kicker}>Cara menjual QIRA</p>
      <h1>Jual hasilnya, bukan teknologinya.</h1>
      <p>Calon pelanggan cukup memahami masalah apa yang dibantu, hasil apa yang akan terasa, berapa lama, dan berapa biayanya.</p>
    </section>

    <section className={workspace.panel}>
      <div className={workspace.panelHeading}><div><p className={workspace.kicker}>Format penawaran satu layar</p><h2>Lima hal saja yang perlu terlihat.</h2></div></div>
      <div className={styles.offerGrid}>{offerSteps.map((step, index) => <article className={styles.offer} key={step.title}><span>{index + 1}</span><h3>{step.title}</h3><p>{step.copy}</p></article>)}</div>
    </section>

    <section className={workspace.panel}>
      <div className={workspace.panelHeading}><div><p className={workspace.kicker}>Harga awal</p><h2>Pilih tingkat bantuan, bukan sebanyak-banyaknya fitur.</h2></div><Link href="/workspace/proposals/new">Buat proposal formal →</Link></div>
      <div className={styles.packageGrid}>{PROPOSAL_PACKAGES.map((item) => <article className={styles.card} key={item.id}>
        <h3>{item.name}</h3>
        <p>{packagePurpose[item.id] ?? item.tagline}</p>
        <strong className={styles.packagePrice}>{item.priceLabel} {rupiah.format(item.introductoryPriceIdr)}</strong>
        <p>{item.durationWeeks[0]}–{item.durationWeeks[1]} minggu · {item.revisions}x revisi · dukungan awal {item.supportDays} hari.</p>
      </article>)}</div>
      <p>Skema standar QIRA: <strong>50% pembayaran awal</strong> untuk mulai, kemudian <strong>50% setelah hasil utama selesai sesuai kesepakatan</strong>. Biaya pihak ketiga dibicarakan terpisah bila memang dibutuhkan.</p>
    </section>

    <section className={workspace.panel}>
      <div className={workspace.panelHeading}><div><p className={workspace.kicker}>Template WhatsApp</p><h2>Gunakan sesuai posisi calon pelanggan.</h2></div></div>
      <div className={styles.templateGrid}>{templates.map((template) => <article className={styles.template} key={template.title}><h3>{template.title}</h3><p>Edit nama dan konteks seperlunya. Jangan kirim semua template sekaligus.</p><CopyTemplate text={template.text}/></article>)}</div>
    </section>

    <section className={workspace.panel}>
      <div className={workspace.panelHeading}><div><p className={workspace.kicker}>Aturan sederhana</p><h2>Agar penawaran tetap mudah dipahami.</h2></div></div>
      <ul className={styles.rules}>
        <li>Jangan mulai dari nama paket, aplikasi, AI, integrasi, atau daftar fitur.</li>
        <li>Pastikan satu masalah utama dan satu hasil utama sudah jelas sebelum bicara harga final.</li>
        <li>Jangan menawarkan sesuatu yang belum dibutuhkan hanya karena bisa dibuat.</li>
        <li>Jika calon pelanggan minta harga cepat, beri kisaran awal lalu kembali ke kebutuhan utamanya.</li>
        <li>Proposal formal dibuat setelah arah bantuan cukup jelas. Proposal bukan alat untuk menjelaskan semuanya dari nol.</li>
        <li>Begitu pelanggan setuju, pindah dari mode jualan ke checklist onboarding: kesepakatan → pembayaran awal → kickoff → pengerjaan → serah terima.</li>
      </ul>
    </section>
  </main>;
}
