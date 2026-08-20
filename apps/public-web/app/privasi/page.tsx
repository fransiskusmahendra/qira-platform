import type { Metadata } from "next";
import Link from "next/link";

import styles from "./privacy.module.css";

const title = "Privasi & Penggunaan Data";
const description = "Pelajari data yang digunakan QIRA, tujuan penggunaannya, cara data dilindungi, dan pilihan yang Anda miliki.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privasi" },
  openGraph: {
    title: `${title} | QIRA`,
    description,
    url: "/privasi",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "QIRA — bantu usaha jadi lebih mudah" }],
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
    <nav className="nav shell" aria-label="Navigasi privasi"><Link className="brand" href="/">QIRA<span>.</span></Link><Link className="navCta" href="/coba-masalah">Mulai bercerita</Link></nav>

    <header className="subpageIntro shell">
      <p className="kicker">Privasi di QIRA</p>
      <h1>Data digunakan seperlunya untuk memahami kebutuhan dan memberi layanan.</h1>
      <p>Kami berusaha menjelaskan penggunaan data dengan bahasa yang sederhana. Pemberitahuan ini terakhir diperbarui pada 20 Agustus 2026.</p>
    </header>

    <section className={`${styles.notice} shell`}>
      <article>
        <h2>Siapa yang mengelola data?</h2>
        <p>QIRA adalah layanan PT Rays Solusi Informasi. Untuk layanan QIRA, kami menentukan tujuan penggunaan data yang Anda berikan melalui website, komunikasi, proposal, dan proses layanan.</p>
      </article>

      <article>
        <h2>Data apa yang dapat kami gunakan?</h2>
        <p>Tergantung interaksi Anda, data dapat mencakup nama, nama usaha, nomor WhatsApp, email bila diberikan, jawaban mengenai kebutuhan atau proses usaha, pilihan layanan, serta catatan proposal dan keputusan layanan bila proses berlanjut.</p>
        <p>Sistem juga dapat menghasilkan catatan teknis yang diperlukan untuk keamanan, pengiriman email, autentikasi, dan keandalan layanan.</p>
      </article>

      <article>
        <h2>Untuk apa data digunakan?</h2>
        <p>Kami menggunakan data untuk memahami kebutuhan, menyiapkan saran atau proposal, menghubungi Anda terkait permintaan yang dibuat, menjalankan layanan yang disepakati, menjaga keamanan sistem, menyimpan bukti persetujuan atau transaksi, dan memperbaiki kualitas layanan QIRA.</p>
      </article>

      <article>
        <h2>Analitik website yang kami simpan</h2>
        <p>Untuk melihat apakah alur website mudah digunakan, QIRA menyimpan hitungan tahap seperti membuka halaman, mulai bercerita, menyelesaikan cerita awal, membuka Discovery, dan mengirim Discovery.</p>
        <p>Tabel analitik QIRA tidak menyimpan nama, email, nomor WhatsApp, alamat IP, user-agent, atau pengenal pengunjung permanen. Browser hanya memakai penanda sementara selama sesi agar satu tahap tidak dihitung berulang kali dalam sesi yang sama.</p>
      </article>

      <article>
        <h2>Dasar penggunaan data</h2>
        <p>Penggunaan data dilakukan sesuai konteks, terutama berdasarkan persetujuan yang Anda berikan dan kebutuhan untuk menindaklanjuti permintaan atau menjalankan hubungan layanan. Jika hukum mewajibkan dasar lain, QIRA akan menggunakan data hanya sejauh yang diperlukan untuk kewajiban tersebut.</p>
      </article>

      <article>
        <h2>Penyedia layanan yang membantu QIRA</h2>
        <p>QIRA menggunakan penyedia infrastruktur seperti Vercel untuk hosting, Supabase untuk database dan autentikasi, serta Resend untuk pengiriman email. Data yang diteruskan dibatasi pada yang diperlukan agar fungsi terkait dapat berjalan.</p>
        <p>Penyedia tersebut dapat memproses data pada infrastruktur di lokasi yang berbeda sesuai layanan mereka. QIRA tetap membatasi akses internal dan penggunaan data pada tujuan layanan yang relevan.</p>
      </article>

      <article>
        <h2>Bagaimana data dilindungi?</h2>
        <p>Kami menerapkan autentikasi, pembatasan hak akses, kontrol akses database, pemisahan akses pelanggan dan admin, serta pencatatan aktivitas penting. Tidak ada sistem yang dapat dijamin bebas risiko sepenuhnya, sehingga pengamanan dan pemantauan tetap dilakukan secara berkelanjutan.</p>
      </article>

      <article>
        <h2>Berapa lama data disimpan?</h2>
        <p>Data disimpan selama masih diperlukan untuk menindaklanjuti permintaan, menyediakan layanan, menyimpan bukti transaksi atau persetujuan, memenuhi kewajiban hukum yang berlaku, atau menyelesaikan sengketa. Setelah tidak lagi diperlukan, data dapat dihapus atau dianonimkan sesuai kebutuhan dan kewajiban yang berlaku.</p>
      </article>

      <article>
        <h2>Pilihan dan hak Anda</h2>
        <p>Sesuai ketentuan yang berlaku, Anda dapat meminta informasi mengenai data Anda, meminta akses atau salinan, memperbaiki data yang tidak akurat, menarik persetujuan untuk pemrosesan yang bergantung pada persetujuan, serta meminta penghapusan atau penghentian pemrosesan apabila syarat hukumnya terpenuhi.</p>
      </article>

      <article className={styles.contact}>
        <h2>Hubungi QIRA soal data pribadi</h2>
        <p>Kirim permintaan atau pertanyaan ke <a href="mailto:hello@qirasolution.com">hello@qirasolution.com</a>. Agar kami dapat memverifikasi permintaan dengan aman, kami mungkin perlu memastikan bahwa permintaan berasal dari orang yang berhak atas data tersebut.</p>
      </article>

      <aside className={styles.legalNote}>
        <strong>Rujukan umum</strong>
        <p>Pemberitahuan ini disusun dengan mengacu pada prinsip pelindungan data dalam Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi dan ketentuan sistem elektronik yang berlaku. Pemberitahuan ini bukan pengganti hak yang diberikan oleh peraturan perundang-undangan.</p>
      </aside>
    </section>

    <footer className="footer shell"><span>QIRA · PT Rays Solusi Informasi</span><Link href="/">Kembali ke beranda</Link></footer>
  </main>;
}
