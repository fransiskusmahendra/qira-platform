import { CARE_PLANS, PROPOSAL_PACKAGES } from "@qira/domain";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ConversionTracker } from "../_components/ConversionTracker";
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
      <ConversionTracker event="pricing_view" />
      <nav className="companyNav shell" aria-label="Navigasi utama">
        <Link className="brand" href="/">QIRA<span>.</span></Link>
        <div className="companyNavLinks"><Link href="/about">About</Link><Link href="/portfolio">Portfolio</Link><Link href="/harga">Pricing</Link></div>
        <Link className="smallButton" href="/coba-masalah">Mulai</Link>
      </nav>

      <section className={`${styles.hero} shell`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">Pricing</p>
          <h1>Pilih levelnya.</h1>
          <p>Mulai {rupiah.format(lowestPrice)}.</p>
          <div className={styles.heroActions}><Link className="primaryButton" href="/coba-masalah">Bantu pilih</Link></div>
        </div>
        <figure className={styles.heroVisual}>
          <Image src="/illustrations/qira-pricing-visual.svg" alt="Tiga tingkat solusi QIRA dari sederhana hingga terhubung" width={500} height={375} priority unoptimized sizes="(max-width: 960px) 100vw, 48vw" />
        </figure>
      </section>

      <section className={`${styles.section} shell`}>
        <div className="simplePricingGrid">
          {PROPOSAL_PACKAGES.map((item) => {
            const featured = item.id === "growth-engine";
            return (
              <article className={`simplePriceCard ${featured ? "featured" : ""}`} key={item.id}>
                <span className="planLabel">{featured ? "Paling seimbang" : "Harga perkenalan"}</span>
                <h3>{item.name}</h3>
                <strong className="price">{rupiah.format(item.introductoryPriceIdr)}</strong>
                <span className="duration">{item.durationWeeks[0]}–{item.durationWeeks[1]} minggu</span>
                <details className="simplePriceDetails">
                  <summary>Detail</summary>
                  <p>{item.tagline}</p>
                  <p>{item.revisions}x revisi · {item.supportDays} hari support</p>
                  <ul>{item.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}</ul>
                  <p>Belum termasuk: {item.exclusions.join("; ")}.</p>
                </details>
              </article>
            );
          })}
        </div>
        <details className="simpleCareDetails">
          <summary>Maintenance opsional</summary>
          <div>{CARE_PLANS.map((plan) => <span key={plan.name}>{plan.name} · {plan.priceRange}</span>)}</div>
        </details>
      </section>

      <section className="companyClosing simpleCompactClosing shell">
        <div><p className="kicker">Belum yakin?</p><h2>Mulai dari masalahnya.</h2></div>
        <div className="closingActions"><Link className="primaryButton light" href="/coba-masalah">Mulai</Link></div>
      </section>

      <footer className="companyFooter shell">
        <div><Link className="brand" href="/">QIRA<span>.</span></Link></div>
        <div className="footerLinks"><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/portfolio">Portfolio</Link><Link href="/privasi">Privacy</Link></div>
        <span>QIRA · PT Rays Solusi Informasi</span>
      </footer>
    </main>
  );
}
