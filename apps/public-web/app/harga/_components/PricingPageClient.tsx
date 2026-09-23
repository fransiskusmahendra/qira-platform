"use client";

import { CARE_PLANS, PROPOSAL_PACKAGES } from "@qira/domain";
import Image from "next/image";
import Link from "next/link";

import { PerspectiveGridCanvas } from "../../_components/PerspectiveGridCanvas";
import { SubpageBackground } from "../../_components/SubpageBackground";
import { ConversionTracker } from "../../_components/ConversionTracker";
import styles from "../../SubpageVisual.module.css";
import { Navbar } from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { ClosingCtaSection } from "../../_components/ClosingCtaSection";
import { useLanguage } from "../../../lib/i18n";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

const AUDIENCE_FIT_ID: Record<string, string> = {
  "digital-foundation": "Cocok untuk profil usaha resmi & kontak langsung WhatsApp.",
  "growth-engine": "Cocok untuk pemesanan online, rekap data, dan notifikasi otomatis.",
  "connected-growth": "Cocok untuk operasional multi-staf dengan database & invoice otomatis.",
};

const AUDIENCE_FIT_EN: Record<string, string> = {
  "digital-foundation": "Ideal for official web presence & direct WhatsApp inquiries.",
  "growth-engine": "Ideal for digital orders, structured data, and auto notifications.",
  "connected-growth": "Ideal for multi-staff teams needing shared databases & automated docs.",
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

const PRICING_FAQS_ID = [
  { q: "Apakah ada biaya langganan bulanan tersembunyi?", a: "Tidak ada. Solusi yang dibangun QIRA sepenuhnya mandiri (sekali bayar). Anda tidak dibebani biaya lisensi bulanan." },
  { q: "Bagaimana sistem pembayarannya?", a: "Pembayaran bertahap transparan: uang muka (DP) di awal pengerjaan, dan pelunasan setelah sistem selesai diuji dan siap digunakan." },
  { q: "Apakah hak milik kode dan data diserahkan penuh?", a: "Ya, 100%. Source code, database, dan domain sepenuhnya menjadi aset milik usaha Anda tanpa ketergantungan (vendor lock-in)." }
];

const PRICING_FAQS_EN = [
  { q: "Are there hidden monthly subscription fees?", a: "None. Solutions built by QIRA are standalone and self-hosted. You are never burdened by bloated recurring software licenses." },
  { q: "What is the payment schedule?", a: "Transparent milestones: an initial down payment upon scope agreement, and final payment only after the system is fully tested and ready for production." },
  { q: "Do we get full ownership of code and data?", a: "Yes, 100%. Source code, databases, and domains are entirely your business property with zero vendor lock-in." }
];

export function PricingPageClient() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const lowestPrice = PROPOSAL_PACKAGES[0]?.introductoryPriceIdr ?? 0;

  const eyebrow = isEn ? "Pricing" : "Paket & Harga";
  const heading = isEn ? "Clear pricing. No recurring lock-in." : "Harga transparan. Bebas biaya langganan.";
  const lead = isEn
    ? `Starting from ${rupiah.format(lowestPrice)} (~$100). Own your systems outright without bloated recurring fees. Direct support included.`
    : `Mulai dari ${rupiah.format(lowestPrice)}. Miliki sistem mandiri tanpa biaya langganan bulanan. Termasuk garansi dan pendampingan langsung.`;
  const heroCta = isEn ? "Help me choose a plan" : "Bantu pilih paket";

  const audienceFit = isEn ? AUDIENCE_FIT_EN : AUDIENCE_FIT_ID;
  const pricingFaqs = isEn ? PRICING_FAQS_EN : PRICING_FAQS_ID;

  return (
    <>
      <Navbar />
      <main style={{ position: "relative" }}>
        <SubpageBackground />
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
          <figure className={styles.heroVisual} style={{ minHeight: 440 }}>
            <PerspectiveGridCanvas />
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
                ? "⭐ Most Popular"
                : "Starter Choice";
              const durationText = isEn
                ? `Delivery: ±${item.durationWeeks[0]}–${item.durationWeeks[1]} weeks`
                : `Timeline: ±${item.durationWeeks[0]}–${item.durationWeeks[1]} minggu`;
              const deliverablesTitle = isEn ? "Key Deliverables:" : "Deliverables & Fitur:";
              const warrantyText = isEn
                ? `Warranty: ${item.revisions}x revisions · ${item.supportDays} days direct support.`
                : `Garansi: ${item.revisions}x revisi · ${item.supportDays} hari direct support.`;
              const chooseButtonText = isEn ? "Choose This Plan →" : "Pilih Paket Ini →";

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
                      background: featured ? "rgba(255,255,255,0.08)" : "rgba(23, 105, 255, 0.12)",
                      border: featured ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(23, 105, 255, 0.25)",
                      fontSize: "12.5px",
                      lineHeight: "1.5",
                      color: featured ? "#dceaff" : "#93c5fd",
                      fontWeight: "600"
                    }}>
                      💡 {fitText}
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
                          <span style={{ color: featured ? "#60a5fa" : "var(--blue)", fontWeight: "800" }}>✓</span>
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
                    <a
                      href={`https://wa.me/6285183042571?text=${encodeURIComponent(
                        isEn
                          ? `Hello QIRA team, I am interested in the ${item.name} plan (~${rupiah.format(item.introductoryPriceIdr)}) for my business. Could we discuss the details?`
                          : `Halo tim QIRA, saya tertarik dengan ${item.name} (${rupiah.format(item.introductoryPriceIdr)}) untuk usaha saya. Boleh tanya detailnya?`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        marginTop: "10px",
                        padding: "9px 14px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "600",
                        textDecoration: "none",
                        color: featured ? "#ffffff" : "var(--ink)",
                        background: featured ? "rgba(255, 255, 255, 0.15)" : "#f8fafc",
                        border: featured ? "1px solid rgba(255, 255, 255, 0.25)" : "1px solid var(--line)"
                      }}
                    >
                      💬 {isEn ? "Inquire on WhatsApp" : "Tanya via WhatsApp"}
                    </a>
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
                  <strong>{plan.name}</strong> · {plan.priceRange}
                </span>
              ))}
            </div>
          </details>
        </section>

        {/* Pricing Quick FAQs */}
        <section className={`${styles.section} shell`} style={{ marginTop: "24px" }}>
          <div style={{
            maxWidth: "760px",
            margin: "0 auto",
            padding: "28px",
            background: "rgba(14, 20, 36, 0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.08)"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "750", marginBottom: "16px", color: "#ffffff", textAlign: "center" }}>
              {isEn ? "Frequently Asked Questions about Pricing" : "Pertanyaan yang Sering Diajukan Seputar Biaya"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {pricingFaqs.map((faq, idx) => (
                <details key={idx} style={{ padding: "14px 18px", background: "rgba(255, 255, 255, 0.04)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <summary style={{ fontWeight: "650", fontSize: "14px", cursor: "pointer", color: "#ffffff" }}>
                    {faq.q}
                  </summary>
                  <p style={{ marginTop: "8px", marginBottom: "0", fontSize: "13.5px", color: "#94a3b8", lineHeight: "1.55" }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <ClosingCtaSection
          kicker={isEn ? "Not sure which plan fits?" : "Belum yakin paket mana yang pas?"}
          heading={isEn ? "Start with one problem." : "Ceritakan satu masalah usaha Anda."}
          subtext={isEn ? "Tell us what you need — we will recommend the leanest solution without wasting your budget." : "Kami bantu analisis dan rekomendasikan paket yang paling efisien tanpa membuang anggaran."}
          primaryText={isEn ? "Help me choose" : "Bantu tentukan paket"}
          showGuarantee={true}
        />
      </main>
      <Footer />
    </>
  );
}