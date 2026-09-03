import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PersonalizedDemo } from "../PersonalizedDemo";
import { ConversionTracker } from "../_components/ConversionTracker";
import styles from "../SubpageVisual.module.css";

const title = "Ceritakan Masalah Usahamu";
const description = "Ceritakan satu masalah yang paling merepotkan. QIRA membantu memetakan kebutuhan tanpa istilah teknis atau penjelasan yang rumit.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/coba-masalah" },
  openGraph: { title: `${title} | QIRA`, description, url: "/coba-masalah", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "QIRA — mulai dari masalah bisnis" }] },
  twitter: { card: "summary_large_image", title: `${title} | QIRA`, description, images: ["/opengraph-image"] },
};

export default function ProblemExperiencePage() {
  return (
    <main>
      <ConversionTracker event="story_start" />
      <nav className="companyNav shell" aria-label="Navigasi utama">
        <Link className="brand" href="/">QIRA<span>.</span></Link>
        <div className="companyNavLinks"><Link href="/about">Tentang</Link><Link href="/layanan">Layanan</Link><Link href="/portfolio">Portofolio</Link><Link href="/harga">Harga</Link></div>
        <Link className="smallButton" href="/contoh-penerapan">Lihat contoh</Link>
      </nav>

      <section className={`${styles.hero} shell`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">Mulai</p>
          <h1>Ceritakan masalah yang paling merepotkan.</h1>
          <p>Jawab empat pertanyaan sederhana dalam sekitar 2 menit.</p>
        </div>
        <figure className={styles.heroVisual}>
          <Image src="/illustrations/premium/qira-problem-premium.webp" alt="Masalah bisnis yang disusun menjadi prioritas dan arah solusi" width={1672} height={941} quality={90} priority sizes="(max-width: 960px) 100vw, 48vw" />
        </figure>
      </section>

      <PersonalizedDemo />

      <footer className="companyFooter shell">
        <div><Link className="brand" href="/">QIRA<span>.</span></Link></div>
        <div className="footerLinks"><Link href="/">Beranda</Link><Link href="/about">Tentang</Link><Link href="/layanan">Layanan</Link><Link href="/portfolio">Portofolio</Link><Link href="/harga">Harga</Link><Link href="/privasi">Privasi</Link></div>
        <span>QIRA · Solusi digital sederhana untuk bisnis</span>
      </footer>
    </main>
  );
}
