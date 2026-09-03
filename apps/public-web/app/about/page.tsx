import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import styles from "../SubpageVisual.module.css";

const ABOUT_DESCRIPTION = "Kenali cara QIRA membantu bisnis membuat teknologi lebih sederhana, praktis, dan sesuai kebutuhan nyata.";

export const metadata: Metadata = {
  title: "Tentang QIRA",
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: { title: "Tentang QIRA", description: ABOUT_DESCRIPTION, url: "/about", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Tentang QIRA" }] },
  twitter: { card: "summary_large_image", title: "Tentang QIRA", description: ABOUT_DESCRIPTION, images: ["/opengraph-image"] },
};

export default function AboutPage() {
  return (
    <main>
      <nav className="companyNav shell" aria-label="Navigasi utama">
        <Link className="brand" href="/">QIRA<span>.</span></Link>
        <div className="companyNavLinks"><Link href="/about">Tentang</Link><Link href="/layanan">Layanan</Link><Link href="/portfolio">Portofolio</Link><Link href="/harga">Harga</Link></div>
        <Link className="smallButton" href="/coba-masalah">Ceritakan masalah</Link>
      </nav>

      <section className={`${styles.hero} shell`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">Tentang QIRA</p>
          <h1>Teknologi yang dimulai dari kebutuhan nyata.</h1>
          <p>QIRA memahami proses usaha, menentukan prioritas, lalu membangun solusi digital yang benar-benar diperlukan.</p>
          <div className={styles.heroActions}><Link className="primaryButton" href="/coba-masalah">Ceritakan masalah usaha</Link></div>
        </div>
        <figure className={styles.heroVisual}>
          <Image src="/illustrations/premium/qira-about-premium.webp" alt="Pemilik usaha dan konsultan menyusun solusi digital yang lebih rapi" width={1672} height={941} quality={90} priority sizes="(max-width: 960px) 100vw, 48vw" />
        </figure>
      </section>

      <section className={`${styles.section} shell`}>
        <div className="simplePrinciples" aria-label="Prinsip QIRA">
          <span>Mulai sederhana</span><span>Utamakan kebutuhan usaha</span><span>Buat yang benar-benar diperlukan</span>
        </div>
      </section>

      <section className="companyClosing simpleCompactClosing shell">
        <div><p className="kicker">Mulai sederhana</p><h2>Ada pekerjaan yang ingin dirapikan?</h2></div>
        <div className="closingActions"><Link className="primaryButton light" href="/coba-masalah">Ceritakan masalah usaha</Link></div>
      </section>

      <footer className="companyFooter shell">
        <div><Link className="brand" href="/">QIRA<span>.</span></Link></div>
        <div className="footerLinks"><Link href="/">Beranda</Link><Link href="/layanan">Layanan</Link><Link href="/portfolio">Portofolio</Link><Link href="/harga">Harga</Link><Link href="/privasi">Privasi</Link></div>
        <span>QIRA · Solusi digital sederhana untuk bisnis</span>
      </footer>
    </main>
  );
}
