"use client";

import Image from "next/image";
import Link from "next/link";

import { PrismRefractionCanvas } from "../../_components/PrismRefractionCanvas";
import styles from "../../SubpageVisual.module.css";
import { Navbar } from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { ClosingCtaSection } from "../../_components/ClosingCtaSection";
import { useLanguage } from "../../../lib/i18n";

export function AboutPageClient() {
  const { locale } = useLanguage();

  const isEn = locale === "en";
  const title = isEn ? "About QIRA" : "Tentang QIRA";
  const heading = isEn ? "Software crafted around real business needs." : "Software yang dirancang dari kebutuhan nyata.";
  const lead = isEn
    ? "We believe the best tools are simple, focused, and built to solve actual day-to-day friction."
    : "Kami percaya software terbaik adalah yang simpel, fokus, dan benar-benar menyelesaikan gesekan operasional sehari-hari.";
  const ctaText = isEn ? "Tell us your challenge" : "Ceritakan masalah usaha";
  const altText = isEn
    ? "Business owner and consultant structuring simple digital workflows"
    : "Pemilik usaha dan konsultan menyusun solusi digital yang lebih rapi";
  const principles = isEn
    ? ["Start simple", "Prioritize business needs", "Build what is truly necessary"]
    : ["Mulai sederhana", "Utamakan kebutuhan usaha", "Buat yang benar-benar diperlukan"];

  const closingKicker = isEn ? "Start simple" : "Mulai sederhana";
  const closingHeading = isEn ? "Have a workflow to streamline?" : "Ada pekerjaan yang ingin dirapikan?";
  const closingSubtext = isEn
    ? "Share the single biggest bottleneck you face today. We will help map out the first step."
    : "Ceritakan satu masalah yang paling merepotkan saat ini. Kami bantu petakan langkah awalnya.";

  return (
    <>
      <Navbar />
      <main>
        <section className={`${styles.hero} shell`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">{title}</p>
            <h1>{heading}</h1>
            <p>{lead}</p>
            <div className={styles.heroActions}>
              <Link className="primaryButton" href="/coba-masalah">
                {ctaText}
              </Link>
            </div>
          </div>
          <figure className={styles.heroVisual} style={{ minHeight: 440 }}>
            <PrismRefractionCanvas />
          </figure>
        </section>

        <section className={`${styles.section} shell`}>
          <div className="simplePrinciples" aria-label={title}>
            {principles.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>

          <div style={{
            marginTop: "32px",
            padding: "28px",
            background: "rgba(14, 20, 36, 0.75)",
            backdropFilter: "blur(12px)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px"
          }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "750", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--blue)", marginBottom: "8px" }}>
                {isEn ? "Company & Operations" : "Operasional & Legal"}
              </p>
              <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: "1.6", margin: 0 }}>
                {isEn
                  ? "QIRA operates as an independent digital engineering consultancy currently establishing corporate legal status under CV Qira Solusi Digital."
                  : "QIRA beroperasi sebagai konsultan rekayasa digital independen dan saat ini dalam proses pembentukan badan usaha resmi CV Qira Solusi Digital."}
              </p>
            </div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "750", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--blue)", marginBottom: "8px" }}>
                {isEn ? "Location & Contact" : "Lokasi & Kontak"}
              </p>
              <div style={{ fontSize: "13.5px", color: "var(--muted)", lineHeight: "1.6" }}>
                Jakarta, Indonesia<br />
                WhatsApp: +62 821-1076-517<br />
                Email: hello@qirasolution.com
              </div>
            </div>
          </div>
        </section>

        <ClosingCtaSection
          kicker={closingKicker}
          heading={closingHeading}
          subtext={closingSubtext}
          primaryText={ctaText}
        />
      </main>
      <Footer />
    </>
  );
}