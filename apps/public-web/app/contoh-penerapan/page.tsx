import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import styles from "../SubpageVisual.module.css";

const description = "Lihat contoh sederhana bagaimana QIRA mengubah masalah bisnis sehari-hari menjadi solusi digital yang lebih rapi dan mudah digunakan.";

export const metadata: Metadata = {
  title: "Contoh Penerapan",
  description,
  alternates: { canonical: "/contoh-penerapan" },
  openGraph: { title: "Contoh Penerapan QIRA", description, url: "/contoh-penerapan", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Contoh penerapan solusi QIRA" }] },
  twitter: { card: "summary_large_image", title: "Contoh Penerapan QIRA", description, images: ["/opengraph-image"] },
};

const EXAMPLES = [
  ["Penjualan", "Chat → Dashboard"],
  ["Administrasi", "Data → Dokumen"],
  ["Follow-up", "Lupa → Automation"],
  ["Perencanaan", "Bingung → Discovery"],
] as const;

export default function ExamplePage() {
  return (
    <main>
      <nav className="companyNav shell" aria-label="Navigasi utama">
        <Link className="brand" href="/">QIRA<span>.</span></Link>
        <div className="companyNavLinks"><Link href="/about">About</Link><Link href="/portfolio">Portfolio</Link><Link href="/harga">Pricing</Link></div>
        <Link className="smallButton" href="/coba-masalah">Mulai</Link>
      </nav>

      <section className={`${styles.hero} shell`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">Contoh</p>
          <h1>Lihat sebelum → sesudah.</h1>
          <div className={styles.heroActions}><Link className="primaryButton" href="/coba-masalah">Coba masalahmu</Link></div>
        </div>
        <figure className={styles.heroVisual}>
          <Image src="/illustrations/qira-examples-visual.svg" alt="Pesanan, dokumen, follow-up, dan perencanaan yang berubah menjadi workflow digital" width={500} height={281} priority unoptimized sizes="(max-width: 960px) 100vw, 48vw" />
        </figure>
      </section>

      <section className={`${styles.section} shell`}>
        <div className="simpleExamples">
          {EXAMPLES.map(([label, flow]) => <span key={label}><small>{label}</small><strong>{flow}</strong></span>)}
        </div>
      </section>

      <section className="companyClosing simpleCompactClosing shell">
        <div><p className="kicker">Your turn</p><h2>Pilih satu masalah.</h2></div>
        <div className="closingActions"><Link className="primaryButton light" href="/coba-masalah">Mulai</Link></div>
      </section>

      <footer className="companyFooter shell">
        <div><Link className="brand" href="/">QIRA<span>.</span></Link></div>
        <div className="footerLinks"><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/portfolio">Portfolio</Link><Link href="/harga">Pricing</Link><Link href="/privasi">Privacy</Link></div>
        <span>QIRA · PT Rays Solusi Informasi</span>
      </footer>
    </main>
  );
}
