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
  ["Tindak lanjut", "Lupa → Otomatis"],
  ["Perencanaan", "Bingung → Punya arah"],
] as const;

export default function ExamplePage() {
  return (
    <main>
      <nav className="companyNav shell" aria-label="Navigasi utama">
        <Link className="brand" href="/">QIRA<span>.</span></Link>
        <div className="companyNavLinks"><Link href="/about">Tentang</Link><Link href="/portfolio">Portofolio</Link><Link href="/harga">Harga</Link></div>
        <Link className="smallButton" href="/coba-masalah">Ceritakan masalah</Link>
      </nav>

      <section className={`${styles.hero} shell`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">Contoh</p>
          <h1>Lihat sebelum → sesudah.</h1>
          <div className={styles.heroActions}><Link className="primaryButton" href="/coba-masalah">Ceritakan masalah usaha</Link></div>
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
        <div><p className="kicker">Langkah berikutnya</p><h2>Pilih satu masalah yang ingin dirapikan.</h2></div>
        <div className="closingActions"><Link className="primaryButton light" href="/coba-masalah">Ceritakan masalah usaha</Link></div>
      </section>

      <footer className="companyFooter shell">
        <div><Link className="brand" href="/">QIRA<span>.</span></Link></div>
        <div className="footerLinks"><Link href="/">Beranda</Link><Link href="/about">Tentang</Link><Link href="/portfolio">Portofolio</Link><Link href="/harga">Harga</Link><Link href="/privasi">Privasi</Link></div>
        <span>QIRA · Solusi digital sederhana untuk bisnis</span>
      </footer>
    </main>
  );
}
