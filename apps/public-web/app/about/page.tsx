import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import styles from "../SubpageVisual.module.css";

const ABOUT_DESCRIPTION = "Kenali cara QIRA membantu bisnis membuat teknologi lebih sederhana, praktis, dan sesuai kebutuhan nyata.";

export const metadata: Metadata = {
  title: "About Us",
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: { title: "About QIRA", description: ABOUT_DESCRIPTION, url: "/about", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "About QIRA" }] },
  twitter: { card: "summary_large_image", title: "About QIRA", description: ABOUT_DESCRIPTION, images: ["/opengraph-image"] },
};

const STEPS = [["01", "Dengarkan"], ["02", "Prioritaskan"], ["03", "Bangun"], ["04", "Gunakan"]] as const;

export default function AboutPage() {
  return (
    <main>
      <nav className="companyNav shell" aria-label="Navigasi utama">
        <Link className="brand" href="/">QIRA<span>.</span></Link>
        <div className="companyNavLinks"><Link href="/about">About Us</Link><Link href="/#services">Services</Link><Link href="/portfolio">Portfolio</Link><Link href="/harga">Pricing</Link></div>
        <Link className="smallButton" href="/coba-masalah">Mulai</Link>
      </nav>

      <section className={`${styles.hero} shell`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">About QIRA</p>
          <h1>Teknologi sederhana untuk pekerjaan nyata.</h1>
          <p>QIRA membantu bisnis merapikan proses lalu membangun solusi digital secukupnya.</p>
          <div className={styles.heroActions}>
            <Link className="primaryButton" href="/coba-masalah">Ceritakan masalahmu</Link>
            <Link className="textLink" href="/portfolio">Lihat hasil →</Link>
          </div>
        </div>
        <figure className={styles.heroVisual}>
          <Image src="/illustrations/qira-about-visual.svg" alt="Masalah bisnis yang berantakan menjadi website, dashboard, aplikasi, dan automation yang lebih rapi" width={500} height={375} priority unoptimized sizes="(max-width: 960px) 100vw, 48vw" />
        </figure>
      </section>

      <section className={`${styles.section} shell`}>
        <div className={styles.sectionHeader}>
          <div><p className="kicker">Cara QIRA bekerja</p><h2>Masalah → prioritas → solusi.</h2></div>
          <p>Bangun seperlunya. Kembangkan saat dibutuhkan.</p>
        </div>
        <div className={styles.exampleSteps}>
          {STEPS.map(([number, title]) => <div className={styles.exampleStep} key={number}><span>{number}</span><strong>{title}</strong></div>)}
        </div>
        <div className={styles.focusPills}><span>Simple first</span><span>Business first</span><span>Build what matters</span></div>
      </section>

      <section className="companyClosing shell">
        <div><p className="kicker">Work with QIRA</p><h2>Apa yang ingin dibuat lebih mudah?</h2></div>
        <div className="closingActions"><Link className="primaryButton light" href="/coba-masalah">Mulai</Link><Link className="closingTextLink" href="/contoh-penerapan">Lihat contoh →</Link></div>
      </section>

      <footer className="companyFooter shell">
        <div><Link className="brand" href="/">QIRA<span>.</span></Link><p>Simple digital solutions.</p></div>
        <div className="footerLinks"><Link href="/">Home</Link><Link href="/portfolio">Portfolio</Link><Link href="/harga">Pricing</Link><Link href="/privasi">Privacy</Link></div>
        <span>QIRA · PT Rays Solusi Informasi</span>
      </footer>
    </main>
  );
}
