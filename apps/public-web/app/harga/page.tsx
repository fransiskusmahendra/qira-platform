import { CARE_PLANS, PROPOSAL_PACKAGES } from "@qira/domain";
import type { Metadata } from "next";
import Link from "next/link";

import styles from "../SubpageVisual.module.css";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const title = "Harga & Paket";
const description = "Lihat harga awal dan pilih tingkat bantuan QIRA yang paling mendekati kebutuhan bisnis Anda.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/harga" },
  openGraph: {
    title: `${title} | QIRA`,
    description,
    url: "/harga",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "QIRA — harga dan paket" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | QIRA`,
    description,
    images: ["/opengraph-image"],
  },
};

export default function PricingPage() {
  const lowestPrice = PROPOSAL_PACKAGES[0]?.introductoryPriceIdr ?? 0;

  return (
    <main>
      <nav className="companyNav shell" aria-label="Navigasi utama">
        <Link className="brand" href="/">QIRA<span>.</span></Link>
        <div className="companyNavLinks">
          <Link href="/about">About Us</Link>
          <Link href="/#services">Services</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/harga">Pricing</Link>
        </div>
        <Link className="smallButton" href="/coba-masalah">Mulai konsultasi</Link>
      </nav>

      <section className={`${styles.hero} shell`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">Pricing</p>
          <h1>Mulai dari kebutuhan yang paling penting.</h1>
          <p>
            Tiga tingkat bantuan untuk memudahkan pilihan. Harga final tetap dikonfirmasi setelah kebutuhan dan ruang lingkup dipahami.
          </p>
          <div className={styles.heroActions}>
            <Link className="primaryButton" href="/coba-masalah">Bantu pilihkan paket</Link>
            <Link className="textLink" href="/contoh-penerapan">Lihat contoh solusi →</Link>
          </div>
        </div>
        <div className={styles.priceHeroVisual} aria-label="Harga awal QIRA">
          <div>
            <small>Harga perkenalan mulai</small>
            <strong>{rupiah.format(lowestPrice)}</strong>
          </div>
          <p>Mulai kecil, gunakan dulu, lalu tambah kemampuan ketika memang dibutuhkan.</p>
        </div>
      </section>

      <section className={`${styles.section} shell`}>
        <div className={styles.sectionHeader}>
          <div>
            <p className="kicker">Pilih tingkat bantuan</p>
            <h2>Tiga paket. Perbedaannya ada pada kedalaman solusi.</h2>
          </div>
          <p>Ringkasan utama langsung terlihat. Cakupan lengkap tetap tersedia tanpa membuat halaman terasa penuh.</p>
        </div>

        <div className={styles.pricingGrid}>
          {PROPOSAL_PACKAGES.map((item) => {
            const featured = item.id === "growth-engine";
            return (
              <article className={`${styles.priceCard} ${featured ? styles.priceCardFeatured : ""}`} key={item.id}>
                <span className={styles.planBadge}>{featured ? "Paling seimbang" : "Harga perkenalan"}</span>
                <h3>{item.name}</h3>
                <p className={styles.priceTagline}>{item.tagline}</p>
                <div className={styles.priceAmount}>
                  <span>{item.priceLabel}</span>
                  <strong>{rupiah.format(item.introductoryPriceIdr)}</strong>
                </div>
                <ul className={styles.quickList}>
                  {item.deliverables.slice(0, 3).map((deliverable) => <li key={deliverable}>{deliverable}</li>)}
                </ul>
                <div className={styles.priceMeta}>
                  <span>{item.durationWeeks[0]}–{item.durationWeeks[1]} minggu</span>
                  <span>{item.revisions}x revisi</span>
                  <span>{item.supportDays} hari dukungan</span>
                </div>
                <details>
                  <summary>Lihat cakupan lengkap</summary>
                  <ul className={styles.detailList}>
                    {item.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}
                  </ul>
                  <p className={styles.note}>Belum termasuk: {item.exclusions.join("; ")}.</p>
                </details>
              </article>
            );
          })}
        </div>
        <p className={styles.finePrint}>Biaya domain, hosting, layanan pihak ketiga, dan kebutuhan tambahan di luar kesepakatan awal belum termasuk kecuali disebutkan secara tertulis.</p>
      </section>

      <section className={`${styles.section} shell`}>
        <div className={styles.sectionHeader}>
          <div>
            <p className="kicker">Pendampingan setelah launch</p>
            <h2>Maintenance hanya jika memang dibutuhkan.</h2>
          </div>
          <p>Pendampingan bersifat opsional dan hanya mencakup bantuan yang disepakati.</p>
        </div>
        <div className={styles.careGrid}>
          {CARE_PLANS.map((plan) => (
            <article className={styles.careCard} key={plan.name}>
              <span className={styles.miniLabel}>Optional care</span>
              <h3>{plan.name}</h3>
              <strong>{plan.priceRange}</strong>
              <p>{plan.outcome}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="companyClosing shell">
        <div>
          <p className="kicker">Tidak yakin pilih yang mana?</p>
          <h2>Ceritakan masalahnya. QIRA bantu menentukan titik mulai yang masuk akal.</h2>
        </div>
        <div className="closingActions">
          <Link className="primaryButton light" href="/coba-masalah">Ceritakan kebutuhan</Link>
          <Link className="closingTextLink" href="/portfolio">Lihat portfolio →</Link>
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
          <Link href="/discovery">Discovery</Link>
          <Link href="/privasi">Privacy</Link>
        </div>
        <span>QIRA · PT Rays Solusi Informasi</span>
      </footer>
    </main>
  );
}
