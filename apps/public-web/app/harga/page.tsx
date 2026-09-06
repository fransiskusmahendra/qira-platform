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
const description = "Lihat pilihan paket solusi digital QIRA yang transparan, tanpa biaya langganan membengkak, dan sesuai skala usaha Anda.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/harga" },
  openGraph: { title: `${title} | QIRA`, description, url: "/harga", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "QIRA — harga dan paket" }] },
  twitter: { card: "summary_large_image", title: `${title} | QIRA`, description, images: ["/opengraph-image"] },
};

const AUDIENCE_FIT: Record<string, string> = {
  "digital-foundation": "Paling pas untuk usaha perorangan atau profil profesional yang ingin punya website resmi & tombol WhatsApp.",
  "growth-engine": "Paling pas untuk bisnis yang ingin terima pesanan/booking online, rekap data, dan otomatisasi notifikasi.",
  "connected-growth": "Paling pas untuk operasional dengan beberapa staf yang butuh database, status pesanan, & dokumen otomatis.",
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
            <p className="eyebrow">Harga & Paket</p>
            <h1>Investasi masuk akal. Tanpa biaya tersembunyi.</h1>
            <p>
              Mulai dari {rupiah.format(lowestPrice)}. Anda mendapatkan sistem yang siap pakai, mandiri, dan bebas biaya langganan bulanan yang membengkak.
            </p>
            <div className={styles.heroActions}>
              <Link className="primaryButton" href="/coba-masalah">Bantu pilih paket</Link>
            </div>
          </div>
          <figure className={styles.heroVisual}>
            <Image
              src="/illustrations/premium/qira-pricing-premium.webp"
              alt="Tiga tingkat solusi QIRA dari sederhana hingga terhubung"
              width={1672}
              height={941}
              quality={90}
              priority
              sizes="(max-width: 960px) 100vw, 48vw"
            />
          </figure>
        </section>

        <section className={`${styles.section} shell`}>
          <div className="simplePricingGrid">
            {PROPOSAL_PACKAGES.map((item) => {
              const featured = item.id === "growth-engine";
              const fitText = AUDIENCE_FIT[item.id];
              return (
                <article className={`simplePriceCard ${featured ? "featured" : ""}`} key={item.id}>
                  <span className="planLabel">{featured ? "⭐ Paling Populer" : "Pilihan Awal"}</span>
                  <h3>{item.name}</h3>
                  <strong className="price">{rupiah.format(item.introductoryPriceIdr)}</strong>
                  <span className="duration">Waktu pengerjaan: ±{item.durationWeeks[0]}–{item.durationWeeks[1]} minggu</span>
                  <p className="planOutcome">{item.tagline}</p>

                  {/* Audience Fit Badge */}
                  {fitText && (
                    <div style={{
                      marginTop: "16px",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      background: featured ? "rgba(255,255,255,0.1)" : "#f0f6ff",
                      fontSize: "12.5px",
                      lineHeight: "1.5",
                      color: featured ? "#dceaff" : "var(--blue)",
                      fontWeight: "600"
                    }}>
                      💡 {fitText}
                    </div>
                  )}

                  {/* Deliverables checklist */}
                  <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: featured ? "1px solid rgba(255,255,255,0.15)" : "1px solid var(--line)" }}>
                    <p style={{ fontSize: "12px", fontWeight: "750", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px", color: featured ? "#8eb9ff" : "var(--muted)" }}>
                      Yang Anda Dapatkan:
                    </p>
                    <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "9px", fontSize: "13.5px" }}>
                      {item.deliverables.map((deliverable) => (
                        <li key={deliverable} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <span style={{ color: featured ? "#60a5fa" : "var(--blue)", fontWeight: "800" }}>✓</span>
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                    <p style={{ marginTop: "14px", fontSize: "12px", color: featured ? "#afbed0" : "var(--muted)" }}>
                      Garansi: {item.revisions}x revisi · {item.supportDays} hari pendampingan langsung.
                    </p>
                  </div>

                  <div style={{ marginTop: "24px" }}>
                    <Link
                      className={featured ? "primaryButton light" : "primaryButton"}
                      style={{ width: "100%", justifyContent: "center" }}
                      href={`/discovery?context=${encodeURIComponent(`Paket ${item.name}`)}`}
                      data-conversion="homepage_cta_click"
                    >
                      Pilih Paket Ini →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <details className="simpleCareDetails" style={{ marginTop: "32px" }}>
            <summary>Butuh pemeliharaan berkala? (Opsional)</summary>
            <div style={{ marginTop: "12px" }}>
              {CARE_PLANS.map((plan) => (
                <span key={plan.name} style={{ display: "inline-block", marginRight: "16px", marginBottom: "8px" }}>
                  <strong>{plan.name}</strong> · {plan.priceRange}
                </span>
              ))}
            </div>
          </details>
        </section>

        <ClosingCtaSection
          kicker="Belum yakin paket mana yang pas?"
          heading="Ceritakan satu masalah usaha Anda."
          subtext="Kami bantu analisis dan rekomendasikan paket yang paling efisien tanpa membuang anggaran."
          primaryText="Bantu tentukan paket"
        />
      </main>
      <Footer />
    </>
  );
}
