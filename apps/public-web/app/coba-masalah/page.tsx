import type { Metadata } from "next";
import Image from "next/image";
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
  openGraph: { title: `${title} | QIRA`, description, url: "/coba-masalah", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "QIRA — mulai dari masalah bisnis" }] },
  twitter: { card: "summary_large_image", title: `${title} | QIRA`, description, images: ["/opengraph-image"] },
};

export default function ProblemExperiencePage() {
  return (
    <main>
      <ConversionTracker event="story_start" />
      <nav className="companyNav shell" aria-label="Navigasi utama">
        <Link className="brand" href="/">QIRA<span>.</span></Link>
        <div className="companyNavLinks"><Link href="/about">About Us</Link><Link href="/#services">Services</Link><Link href="/portfolio">Portfolio</Link><Link href="/harga">Pricing</Link></div>
        <Link className="smallButton" href="/contoh-penerapan">Contoh</Link>
      </nav>

      <section className={`${styles.hero} shell`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">Mulai dari masalah</p>
          <h1>Ceritakan satu masalah. QIRA bantu membuatnya jelas.</h1>
          <p>±2 menit · satu pertanyaan per langkah.</p>
        </div>
        <figure className={styles.heroVisual}>
          <Image src="/illustrations/qira-problem-visual.svg" alt="Kebingungan bisnis yang berubah menjadi insight melalui pertanyaan sederhana QIRA" width={500} height={375} priority unoptimized sizes="(max-width: 960px) 100vw, 48vw" />
        </figure>
      </section>

      <PersonalizedDemo />

      <section className="companyClosing shell">
        <div><p className="kicker">Belum siap?</p><h2>Lihat contoh dulu.</h2></div>
        <div className="closingActions"><Link className="primaryButton light" href="/contoh-penerapan">Lihat contoh</Link><Link className="closingTextLink" href="/harga">Harga →</Link></div>
      </section>

      <footer className="companyFooter shell">
        <div><Link className="brand" href="/">QIRA<span>.</span></Link><p>Simple digital solutions.</p></div>
        <div className="footerLinks"><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/portfolio">Portfolio</Link><Link href="/harga">Pricing</Link><Link href="/privasi">Privacy</Link></div>
        <span>QIRA · PT Rays Solusi Informasi</span>
      </footer>
    </main>
  );
}
