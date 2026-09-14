"use client";

import { CARE_PLANS, PROPOSAL_PACKAGES } from "@qira/domain";
import Image from "next/image";
import Link from "next/link";

import { ConversionTracker } from "../../_components/ConversionTracker";
import styles from "../../SubpageVisual.module.css";
import { Navbar } from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { ClosingCtaSection } from "../../_components/ClosingCtaSection";
import { useLanguage } from "../../../lib/i18n";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

const AUDIENCE_FIT_ID: Record<string, string> = {
  "digital-foundation": "Paling pas untuk usaha perorangan atau profil profesional yang ingin punya website resmi & tombol WhatsApp.",
  "growth-engine": "Paling pas untuk bisnis yang ingin terima pesanan/booking online, rekap data, dan otomatisasi notifikasi.",
  "connected-growth": "Paling pas untuk operasional dengan beberapa staf yang butuh database, status pesanan, & dokumen otomatis.",
};

const AUDIENCE_FIT_EN: Record<string, string> = {
  "digital-foundation": "Best for sole proprietors and businesses that need an official website and direct WhatsApp inquiries.",
  "growth-engine": "Best for businesses wanting online orders/bookings, structured data, and automated notifications.",
  "connected-growth": "Best for multi-staff operations needing centralized databases, order tracking, and automated docs.",
};

const DELIVERABLES_EN: Record<string, string[]> = {
  "digital-foundation": [
    "Clean business website",
    "Mobile-responsive layout",
    "Direct WhatsApp consultation button",
    "Domain setup & live deployment",
  ],
  "growth-engine": [
    "Digital order / intake forms",
    "Real-time recap dashboard",
    "Automated notifications",
    "Customer data management",
  ],
  "connected-growth": [
    "Centralized relational database",
    "Multi-user task & order statuses",
    "Automated document / PDF generator",
    "Full team operational onboarding",
  ],
};

const PLAN_TAGLINES_EN: Record<string, string> = {
  "digital-foundation": "Showcase your business clearly and make contacting you effortless.",
  "growth-engine": "Collect orders, organize data, and cut down manual communication.",
  "connected-growth": "A connected digital workspace tailored for your entire team.",
};

export function PricingPageClient() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const lowestPrice = PROPOSAL_PACKAGES[0]?.introductoryPriceIdr ?? 0;

  const eyebrow = isEn ? "Pricing & Plans" : "Harga & Paket";
  const heading = isEn ? "Fair pricing. Zero hidden fees." : "Investasi masuk akal. Tanpa biaya tersembunyi.";
  const lead = isEn
    ? `Starting from ${rupiah.format(lowestPrice)} (~$100). You get a standalone, ready-to-use digital system without bloated monthly subscriptions.`
    : `Mulai dari ${rupiah.format(lowestPrice)}. Anda mendapatkan sistem yang siap pakai, mandiri, dan bebas biaya langganan bulanan yang membengkak.`;
  const heroCta = isEn ? "Help me choose a plan" : "Bantu pilih paket";

  const audienceFit = isEn ? AUDIENCE_FIT_EN : AUDIENCE_FIT_ID;

  return (
    <>
      <Navbar />
      <main>
        <ConversionTracker event="pricing_view" />

        <section className={`${styles.hero} shell`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{heading}</h1>
            <p>{lead}</p>
            <div className={styles.heroActions}>
              <Link className="primaryButton" href="/coba-masalah">{heroCta}</Link>
            </div>
          </div>
          <figure className={styles.heroVisual}>
            <Image
              src="/illustrations/premium/qira-pricing-premium.webp"
              alt={isEn ? "Three QIRA solution tiers from starter to connected" : "Tiga tingkat solusi QIRA dari sederhana hingga terhubung"}
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
              const fitText = audienceFit[item.id];
              const deliverables = (isEn && DELIVERABLES_EN[item.id]) ? DELIVERABLES_EN[item.id] : item.deliverables;
              const tagline = (isEn && PLAN_TAGLINES_EN[item.id]) ? PLAN_TAGLINES_EN[item.id] : item.tagline;
              const planLabel = featured
                ? (isEn ? "â­ Most Popular" : "â­ Paling Populer")
                : (isEn ? "Starter Choice" : "Pilihan Awal");
              const durationText = isEn
                ? `Delivery timeline: Â±${item.durationWeeks[0]}â€“${item.durationWeeks[1]} weeks`
                : `Waktu pengerjaan: Â±${item.durationWeeks[0]}â€“${item.durationWeeks[1]} minggu`;
              const deliverablesTitle = isEn ? "What You Get:" : "Yang Anda Dapatkan:";
              const warrantyText = isEn
                ? `Warranty: ${item.revisions}x revisions Â· ${item.supportDays} days direct support.`
                : `Garansi: ${item.revisions}x revisi Â· ${item.supportDays} hari pendampingan langsung.`;
              const chooseButtonText = isEn ? "Choose This Plan â†’" : "Pilih Paket Ini â†’";

              return (
                <article className={`simplePriceCard ${featured ? "featured" : ""}`} key={item.id}>
                  <span className="planLabel">{planLabel}</span>
                  <h3>{item.name}</h3>
                  <strong className="price">{rupiah.format(item.introductoryPriceIdr)}</strong>
                  <span className="duration">{durationText}</span>
                  <p className="planOutcome">{tagline}</p>

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
                      ðŸ’¡ {fitText}
                    </div>
                  )}

                  {/* Deliverables checklist */}
                  <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: featured ? "1px solid rgba(255,255,255,0.15)" : "1px solid var(--line)" }}>
                    <p style={{ fontSize: "12px", fontWeight: "750", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px", color: featured ? "#8eb9ff" : "var(--muted)" }}>
                      {deliverablesTitle}
                    </p>
                    <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "9px", fontSize: "13.5px" }}>
                      {deliverables.map((deliverable) => (
                        <li key={deliverable} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <span style={{ color: featured ? "#60a5fa" : "var(--blue)", fontWeight: "800" }}>âœ“</span>
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                    <p style={{ marginTop: "14px", fontSize: "12px", color: featured ? "#afbed0" : "var(--muted)" }}>
                      {warrantyText}
                    </p>
                  </div>

                  <div style={{ marginTop: "24px" }}>
                    <Link
                      className={featured ? "primaryButton light" : "primaryButton"}
                      style={{ width: "100%", justifyContent: "center" }}
                      href={`/discovery?context=${encodeURIComponent(`Paket ${item.name}`)}`}
                      data-conversion="homepage_cta_click"
                    >
                      {chooseButtonText}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <details className="simpleCareDetails" style={{ marginTop: "32px" }}>
            <summary>{isEn ? "Need ongoing maintenance? (Optional)" : "Butuh pemeliharaan berkala? (Opsional)"}</summary>
            <div style={{ marginTop: "12px" }}>
              {CARE_PLANS.map((plan) => (
                <span key={plan.name} style={{ display: "inline-block", marginRight: "16px", marginBottom: "8px" }}>
                  <strong>{plan.name}</strong> Â· {plan.priceRange}
                </span>
              ))}
            </div>
          </details>
        </section>

        <ClosingCtaSection
          kicker={isEn ? "Not sure which plan fits?" : "Belum yakin paket mana yang pas?"}
          heading={isEn ? "Start with one problem." : "Ceritakan satu masalah usaha Anda."}
          subtext={isEn ? "Tell us what you need â€” we will recommend the leanest solution without wasting your budget." : "Kami bantu analisis dan rekomendasikan paket yang paling efisien tanpa membuang anggaran."}
          primaryText={isEn ? "Help me choose" : "Bantu tentukan paket"}
        />
      </main>
      <Footer />
    </>
  );
}