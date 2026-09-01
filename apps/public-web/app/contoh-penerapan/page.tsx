import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import styles from "../SubpageVisual.module.css";

const description = "Lihat contoh sederhana bagaimana QIRA mengubah masalah bisnis sehari-hari menjadi solusi digital yang lebih rapi dan mudah digunakan.";

export const metadata: Metadata = {
  title: "Contoh Penerapan",
  description,
  alternates: { canonical: "/contoh-penerapan" },
  openGraph: {
    title: "Contoh Penerapan QIRA",
    description,
    url: "/contoh-penerapan",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Contoh penerapan solusi QIRA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contoh Penerapan QIRA",
    description,
    images: ["/opengraph-image"],
  },
};

const SCENARIOS = [
  {
    label: "Penjualan",
    problem: "Pesanan tercecer di chat",
    solution: "Form + dashboard pesanan",
    result: "Pesanan masuk ke satu alur dan lebih mudah dipantau.",
  },
  {
    label: "Administrasi",
    problem: "Invoice dibuat berulang dari nol",
    solution: "Generator dokumen",
    result: "Data diisi sekali dan dokumen terbentuk dengan format konsisten.",
  },
  {
    label: "Follow-up",
    problem: "Pengingat sering terlupa",
    solution: "Automation sederhana",
    result: "Notifikasi dan tindak lanjut berjalan lebih konsisten.",
  },
  {
    label: "Perencanaan",
    problem: "Belum tahu harus membangun apa",
    solution: "Business discovery",
    result: "Prioritas, ruang lingkup, waktu, dan biaya awal menjadi lebih jelas.",
  },
] as const;

const STEPS = [
  ["01", "Ceritakan masalah"],
  ["02", "Pilih prioritas"],
  ["03", "Lihat bentuk solusi"],
  ["04", "Bangun secukupnya"],
] as const;

export default function ExamplePage() {
  return (
    <main>
      <nav className="companyNav shell" aria-label="Navigasi utama">
        <Link className="brand" href="/">QIRA<span>.</span></Link>
        <div className="companyNavLinks">
          <Link href="/about">About Us</Link>
          <Link href="/#services">Services</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/harga">Pricing</Link>
        </div>
        <Link className="smallButton" href="/coba-masalah">Mulai konsultasi</Link>
      </nav>

      <section className={`${styles.hero} shell`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">Contoh Penerapan</p>
          <h1>Dari masalah sehari-hari menjadi alur yang lebih rapi.</h1>
          <p>
            Tidak perlu mulai dari nama aplikasi. Lihat bagaimana beberapa masalah umum bisa diterjemahkan menjadi solusi digital yang sederhana.
          </p>
          <div className={styles.heroActions}>
            <Link className="primaryButton" href="/coba-masalah">Coba dengan masalahmu</Link>
            <Link className="textLink" href="/portfolio">Lihat portfolio →</Link>
          </div>
        </div>
        <figure className={styles.heroVisual}>
          <Image
            src="/illustrations/qira-process.webp"
            alt="Alur QIRA dari kebutuhan bisnis menuju solusi yang digunakan"
            width={1984}
            height={793}
            priority
            sizes="(max-width: 960px) 100vw, 48vw"
          />
          <figcaption>Cerita kebutuhan → pilih prioritas → sepakati solusi → gunakan hasilnya.</figcaption>
        </figure>
      </section>

      <section className={`${styles.section} shell`}>
        <div className={styles.sectionHeader}>
          <div>
            <p className="kicker">Problem → Solution</p>
            <h2>Empat contoh yang mudah dibayangkan.</h2>
          </div>
          <p>Ini adalah contoh pola penerapan, bukan paket wajib. Solusi sebenarnya disesuaikan dengan cara kerja dan prioritas bisnis.</p>
        </div>

        <div className={styles.scenarioGrid}>
          {SCENARIOS.map((item) => (
            <article className={styles.scenarioCard} key={item.problem}>
              <span className={styles.scenarioLabel}>{item.label}</span>
              <div className={styles.scenarioTop}>
                <div className={styles.problemBox}>
                  <small>Sebelum</small>
                  <strong>{item.problem}</strong>
                </div>
                <div className={styles.scenarioArrow}>→</div>
                <div className={styles.solutionBox}>
                  <small>Dengan QIRA</small>
                  <strong>{item.solution}</strong>
                </div>
              </div>
              <p className={styles.scenarioResult}><strong>Hasil:</strong> {item.result}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} shell`}>
        <div className={styles.sectionHeader}>
          <div>
            <p className="kicker">Cara memulainya</p>
            <h2>Tidak perlu menyiapkan brief teknis.</h2>
          </div>
          <p>Cukup ceritakan pekerjaan yang terasa lambat, manual, tercecer, atau sulit dipantau.</p>
        </div>
        <div className={styles.exampleSteps}>
          {STEPS.map(([number, title]) => (
            <div className={styles.exampleStep} key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="companyClosing shell">
        <div>
          <p className="kicker">Your example</p>
          <h2>Punya masalah yang mirip atau sama sekali berbeda?</h2>
        </div>
        <div className="closingActions">
          <Link className="primaryButton light" href="/coba-masalah">Ceritakan masalahnya</Link>
          <Link className="closingTextLink" href="/harga">Lihat harga awal →</Link>
        </div>
      </section>

      <footer className="companyFooter shell">
        <div>
          <Link className="brand" href="/">QIRA<span>.</span></Link>
          <p>Simple digital solutions for growing businesses.</p>
        </div>
        <div className="footerLinks">
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/harga">Services & Pricing</Link>
          <Link href="/discovery">Discovery</Link>
          <Link href="/privasi">Privacy</Link>
        </div>
        <span>QIRA · PT Rays Solusi Informasi</span>
      </footer>
    </main>
  );
}
