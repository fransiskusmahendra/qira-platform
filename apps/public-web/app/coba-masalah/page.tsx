import type { Metadata } from "next";
import Link from "next/link";

import { PersonalizedDemo } from "../PersonalizedDemo";
import { ConversionTracker } from "../_components/ConversionTracker";
import styles from "../SubpageVisual.module.css";

const title = "Ceritakan Masalah Usahamu";
const description = "Ceritakan satu masalah yang paling merepotkan. QIRA membantu memetakan kebutuhan tanpa istilah teknis atau brief yang rumit.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/coba-masalah" },
  openGraph: {
    title: `${title} | QIRA`,
    description,
    url: "/coba-masalah",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "QIRA — mulai dari masalah bisnis" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | QIRA`,
    description,
    images: ["/opengraph-image"],
  },
};

const START_POINTS = [
  "Pesanan atau data sering tercecer",
  "Pekerjaan berulang masih manual",
  "Pelanggan sulit mendapat informasi",
  "Belum tahu solusi digital yang tepat",
] as const;

export default function ProblemExperiencePage() {
  return (
    <main>
      <ConversionTracker event="story_start" />

      <nav className="companyNav shell" aria-label="Navigasi utama">
        <Link className="brand" href="/">QIRA<span>.</span></Link>
        <div className="companyNavLinks">
          <Link href="/about">About Us</Link>
          <Link href="/#services">Services</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/harga">Pricing</Link>
        </div>
        <Link className="smallButton" href="/contoh-penerapan">Lihat contoh</Link>
      </nav>

      <section className={`${styles.section} shell`}>
        <div className={styles.sectionHeader}>
          <div>
            <p className="eyebrow">Mulai dari masalah</p>
            <h2>Tidak perlu tahu nama aplikasinya.</h2>
          </div>
          <p>Ceritakan satu hal yang paling bikin repot. QIRA akan membantu mengubahnya menjadi kebutuhan yang lebih jelas.</p>
        </div>

        <div className={styles.focusPills} aria-label="Contoh masalah yang bisa diceritakan">
          {START_POINTS.map((item) => <span key={item}>{item}</span>)}
        </div>

        <div className={styles.principleStrip} style={{ marginTop: 28 }}>
          <span className={styles.miniLabel}>Proses sederhana</span>
          <strong>±2 menit · satu pertanyaan setiap kali · tanpa istilah teknis</strong>
          <span>Belum perlu memilih paket atau teknologi.</span>
        </div>
      </section>

      <PersonalizedDemo />

      <section className="companyClosing shell">
        <div>
          <p className="kicker">Masih ingin lihat contoh dulu?</p>
          <h2>Lihat beberapa masalah umum dan bentuk solusi yang mungkin digunakan.</h2>
        </div>
        <div className="closingActions">
          <Link className="primaryButton light" href="/contoh-penerapan">Lihat contoh penerapan</Link>
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
          <Link href="/privasi">Privacy</Link>
        </div>
        <span>QIRA · PT Rays Solusi Informasi</span>
      </footer>
    </main>
  );
}
