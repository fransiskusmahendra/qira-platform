import { CARE_PLANS, PROPOSAL_PACKAGES } from "@qira/domain";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import styles from "../SubpageVisual.module.css";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const title = "Harga & Paket";
const description = "Lihat harga awal dan pilih tingkat bantuan QIRA yang paling mendekati kebutuhan bisnis Anda.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/harga" },
  openGraph: { title: `${title} | QIRA`, description, url: "/harga", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "QIRA — harga dan paket" }] },
  twitter: { card: "summary_large_image", title: `${title} | QIRA`, description, images: ["/opengraph-image"] },
};

export default function PricingPage() {
  const lowestPrice = PROPOSAL_PACKAGES[0]?.introductoryPriceIdr ?? 0;

  return (
    <main>
      <nav className="companyNav shell" aria-label="Navigasi utama">
        <Link className="brand" href="/">QIRA<span>.</span></Link>
        <div className="companyNavLinks"><Link href="/about">About Us</Link><Link href="/#services">Services</Link><Link href="/portfolio">Portfolio</Link><Link href="/harga">Pricing</Link></div>
        <Link className="smallButton" href="/coba-masalah">Mulai</Link>
      </nav>

      <section className={`${styles.hero} shell`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">Pricing</p>
          <h1>Mulai kecil. Tambah saat perlu.</h1>
          <p>Tiga tingkat bantuan sesuai kebutuhan bisnis.</p>
          <div className={styles.heroActions}><Link className="primaryButton" href="/coba-masalah">Bantu pilihkan</Link><Link className="textLink" href="/contoh-penerapan">Lihat contoh →</Link></div>
        </div>
        <figure className={styles.heroVisual}>
          <Image src="/illustrations/qira-pricing-visual.svg" alt="Tiga tingkat solusi QIRA dari sederhana hingga terhubung" width={500} height={375} priority unoptimized sizes="(max-width: 960px) 100vw, 48vw" />
          <figcaption>Harga perkenalan mulai <strong>{rupiah.format(lowestPrice)}</strong>.</figcaption>
        </figure>
      </section>

      <section className={`${styles.section} shell`}>
        <div className={styles.sectionHeader}><div><p className="kicker">Paket</p><h2>3 tingkat bantuan.</h2></div></div>
        <div className={styles.pricingGrid}>
          {PROPOSAL_PACKAGES.map((item) => {
            const featured = item.id === "growth-engine";
            return (
              <article className={`${styles.priceCard} ${featured ? styles.priceCardFeatured : ""}`} key={item.id}>
                <span className={styles.planBadge}>{featured ? "Paling seimbang" : "Harga perkenalan"}</span>
                <h3>{item.name}</h3>
                <div className={styles.priceAmount}><span>{item.priceLabel}</span><strong>{rupiah.format(item.introductoryPriceIdr)}</strong></div>
                <p className={styles.priceTagline}>{item.tagline}</p>
                <div className={styles.priceMeta}><span>{item.durationWeeks[0]}–{item.durationWeeks[1]} minggu</span><span>{item.revisions}x revisi</span><span>{item.supportDays} hari support</span></div>
                <details>
                  <summary>Lihat isi paket</summary>
                  <ul className={styles.detailList}>{item.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}</ul>
                  <p className={styles.note}>Belum termasuk: {item.exclusions.join("; ")}.</p>
                </details>
              </article>
            );
          })}
        </div>
        <p className={styles.finePrint}>Domain, hosting, layanan pihak ketiga, dan kebutuhan di luar scope awal belum termasuk kecuali disebutkan tertulis.</p>
      </section>

      <section className={`${styles.section} shell`}>
        <div className={styles.sectionHeader}><div><p className="kicker">Optional care</p><h2>Maintenance bila diperlukan.</h2></div></div>
        <div className={styles.careGrid}>
          {CARE_PLANS.map((plan) => <article className={styles.careCard} key={plan.name}><span className={styles.miniLabel}>Care</span><h3>{plan.name}</h3><strong>{plan.priceRange}</strong></article>)}
        </div>
      </section>

      <section className="companyClosing shell">
        <div><p className="kicker">Belum yakin?</p><h2>Ceritakan masalahnya. Kami bantu pilih titik mulai.</h2></div>
        <div className="closingActions"><Link className="primaryButton light" href="/coba-masalah">Mulai</Link><Link className="closingTextLink" href="/portfolio">Portfolio →</Link></div>
      </section>

      <footer className="companyFooter shell">
        <div><Link className="brand" href="/">QIRA<span>.</span></Link><p>Simple digital solutions.</p></div>
        <div className="footerLinks"><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/portfolio">Portfolio</Link><Link href="/privasi">Privacy</Link></div>
        <span>QIRA · PT Rays Solusi Informasi</span>
      </footer>
    </main>
  );
}
