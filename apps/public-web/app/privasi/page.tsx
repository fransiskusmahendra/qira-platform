import type { Metadata } from "next";
import Link from "next/link";

import styles from "./privacy.module.css";

const title = "Privasi & Penggunaan Data";
const description = "Ringkasan sederhana tentang data yang digunakan QIRA, tujuannya, penyedia layanan, dan hak pengguna.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privasi" },
  openGraph: {
    title: `${title} | QIRA`,
    description,
    url: "/privasi",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "QIRA — Simple Digital Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | QIRA`,
    description,
    images: ["/opengraph-image"],
  },
};

export default function PrivacyPage() {
  return <main>
    <nav className="nav shell" aria-label="Navigasi privasi"><Link className="brand" href="/">QIRA<span>.</span></Link><Link className="navCta" href="/">Beranda</Link></nav>

    <header className="subpageIntro shell">
      <p className="kicker">Privasi</p>
      <h1>Data seperlunya.</h1>
      <p>Untuk memahami kebutuhan, menjalankan layanan, dan menjaga keamanan. Diperbarui 2 September 2026.</p>
    </header>

    <section className={`${styles.summary} shell`} aria-label="Ringkasan privasi">
      <article><small>Data</small><strong>Kontak + kebutuhan</strong></article>
      <article><small>Tujuan</small><strong>Layanan + keamanan</strong></article>
      <article><small>Penyedia</small><strong>Vercel · Supabase · Resend</strong></article>
      <article><small>Hak Anda</small><strong>Akses · koreksi · hapus</strong></article>
    </section>

    <section className={`${styles.notice} shell`}>
      <details>
        <summary>Data & penggunaannya</summary>
        <div className={styles.detailBody}>
          <h2>Siapa yang mengelola data?</h2>
          <p>QIRA adalah layanan PT Rays Solusi Informasi. Untuk layanan QIRA, kami menentukan tujuan penggunaan data yang Anda berikan melalui website, komunikasi, proposal, dan proses layanan.</p>
          <h2>Data apa yang dapat digunakan?</h2>
          <p>Tergantung interaksi Anda, data dapat mencakup nama, nama usaha, nomor WhatsApp, email bila diberikan, jawaban mengenai kebutuhan atau proses usaha, pilihan layanan, serta catatan proposal dan keputusan layanan bila proses berlanjut.</p>
          <p>Sistem juga dapat menghasilkan catatan teknis yang diperlukan untuk keamanan, pengiriman email, autentikasi, dan keandalan layanan.</p>
          <h2>Untuk apa data digunakan?</h2>
          <p>Untuk memahami kebutuhan, menyiapkan saran atau proposal, menindaklanjuti permintaan, menjalankan layanan yang disepakati, menjaga keamanan sistem, menyimpan bukti persetujuan atau transaksi, dan memperbaiki kualitas layanan QIRA.</p>
          <h2>Dasar penggunaan data</h2>
          <p>Penggunaan data dilakukan sesuai konteks, terutama berdasarkan persetujuan yang Anda berikan dan kebutuhan untuk menindaklanjuti permintaan atau menjalankan hubungan layanan. Jika hukum mewajibkan dasar lain, data digunakan hanya sejauh yang diperlukan.</p>
        </div>
      </details>

      <details>
        <summary>Analitik & penyedia layanan</summary>
        <div className={styles.detailBody}>
          <h2>Analitik website</h2>
          <p>QIRA menyimpan hitungan tahap seperti membuka halaman, mulai bercerita, menyelesaikan cerita awal, membuka Discovery, dan mengirim Discovery untuk memahami apakah alur website mudah digunakan.</p>
          <p>Tabel analitik QIRA tidak menyimpan nama, email, nomor WhatsApp, alamat IP, user-agent, atau pengenal pengunjung permanen. Browser hanya memakai penanda sementara selama sesi agar satu tahap tidak dihitung berulang kali dalam sesi yang sama.</p>
          <h2>Penyedia layanan</h2>
          <p>QIRA menggunakan Vercel untuk hosting, Supabase untuk database dan autentikasi, serta Resend untuk pengiriman email. Data yang diteruskan dibatasi pada yang diperlukan agar fungsi terkait dapat berjalan.</p>
          <p>Penyedia tersebut dapat memproses data pada infrastruktur di lokasi yang berbeda sesuai layanan mereka. QIRA tetap membatasi akses internal dan penggunaan data pada tujuan layanan yang relevan.</p>
        </div>
      </details>

      <details>
        <summary>Keamanan & penyimpanan</summary>
        <div className={styles.detailBody}>
          <h2>Bagaimana data dilindungi?</h2>
          <p>Kami menerapkan autentikasi, pembatasan hak akses, kontrol akses database, pemisahan akses pelanggan dan admin, serta pencatatan aktivitas penting. Tidak ada sistem yang dapat dijamin bebas risiko sepenuhnya, sehingga pengamanan dan pemantauan dilakukan secara berkelanjutan.</p>
          <h2>Berapa lama data disimpan?</h2>
          <p>Data disimpan selama masih diperlukan untuk menindaklanjuti permintaan, menyediakan layanan, menyimpan bukti transaksi atau persetujuan, memenuhi kewajiban hukum yang berlaku, atau menyelesaikan sengketa. Setelah tidak diperlukan, data dapat dihapus atau dianonimkan sesuai kebutuhan dan kewajiban yang berlaku.</p>
        </div>
      </details>

      <details>
        <summary>Hak Anda & kontak</summary>
        <div className={styles.detailBody}>
          <h2>Pilihan dan hak Anda</h2>
          <p>Sesuai ketentuan yang berlaku, Anda dapat meminta informasi mengenai data Anda, meminta akses atau salinan, memperbaiki data yang tidak akurat, menarik persetujuan untuk pemrosesan yang bergantung pada persetujuan, serta meminta penghapusan atau penghentian pemrosesan apabila syarat hukumnya terpenuhi.</p>
          <h2>Hubungi QIRA</h2>
          <p>Kirim permintaan atau pertanyaan ke <a href="mailto:hello@qirasolution.com">hello@qirasolution.com</a>. Kami mungkin perlu memastikan bahwa permintaan berasal dari orang yang berhak atas data tersebut.</p>
          <p className={styles.legalNote}>Pemberitahuan ini mengacu pada prinsip pelindungan data dalam Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi dan ketentuan sistem elektronik yang berlaku. Pemberitahuan ini bukan pengganti hak yang diberikan oleh peraturan perundang-undangan.</p>
        </div>
      </details>
    </section>

    <footer className="footer shell"><span>QIRA · PT Rays Solusi Informasi</span><Link href="/">Beranda</Link></footer>
  </main>;
}
