import { CARE_PLANS, PROPOSAL_PACKAGES } from "@qira/domain";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ConversionTracker } from "../_components/ConversionTracker";
import styles from "../SubpageVisual.module.css";
import { Navbar } from "../_components/Navbar";
import { Footer } from "../_components/Footer";
import { ClosingCtaSection } from "../_components/ClosingCtaSection";

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
    <>
      <Navbar />
      <main>
        <ConversionTracker event="pricing_view" />

        <section className={`${styles.hero} shell`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">Harga & paket</p>
            <h1>Mulai sesuai kebutuhan.</h1>
            <p>Paket mulai {rupiah.format(lowestPrice)}. Tidak perlu langsung membuat sistem besar.</p>
            <div className={styles.heroActions}><Link className="primaryButton" href="/coba-masalah">Bantu pilih paket</Link></div>
          </div>
          <figure className={styles.heroVisual}>
            <Image src="/illustrations/premium/qira-pricing-premium.webp" alt="Tiga tingkat solusi QIRA dari sederhana hingga terhubung" width={1672} height={941} quality={90} priority sizes="(max-width: 960px) 100vw, 48vw" />
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
                  <p className="planOutcome">{item.tagline}</p>
                  <details className="simplePriceDetails">
                    <summary>Lihat rincian</summary>
                    <p>{item.revisions}x revisi · {item.supportDays} hari pendampingan</p>
                    <ul>{item.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}</ul>
                    <p>Belum termasuk: {item.exclusions.join("; ")}.</p>
                  </details>
                </article>
              );
            })}
          </div>
          <details className="simpleCareDetails">
            <summary>Pemeliharaan opsional</summary>
            <div>{CARE_PLANS.map((plan) => <span key={plan.name}>{plan.name} · {plan.priceRange}</span>)}</div>
          </details>
        </section>

        <ClosingCtaSection
          kicker="Belum yakin?"
          heading="Ceritakan satu masalah usaha."
          subtext="Kami bantu petakan paket yang paling pas dengan skala kebutuhan usaha Anda."
          primaryText="Bantu pilih paket"
        />
      </main>
      <Footer />
    </>
  );
}
