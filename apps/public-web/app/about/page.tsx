"use client";

import Image from "next/image";
import Link from "next/link";

import styles from "../SubpageVisual.module.css";
import { Navbar } from "../_components/Navbar";
import { Footer } from "../_components/Footer";
import { ClosingCtaSection } from "../_components/ClosingCtaSection";
import { useLanguage } from "../../lib/i18n";

export default function AboutPage() {
  const { t, locale } = useLanguage();

  const isEn = locale === "en";
  const title = isEn ? "About QIRA" : "Tentang QIRA";
  const heading = isEn ? "Technology rooted in real business needs." : "Teknologi yang dimulai dari kebutuhan nyata.";
  const lead = isEn
    ? "QIRA analyzes your daily operations, identifies priorities, and builds digital solutions that actually make a difference."
    : "QIRA memahami proses usaha, menentukan prioritas, lalu membangun solusi digital yang benar-benar diperlukan.";
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
          <figure className={styles.heroVisual}>
            <Image
              src="/illustrations/premium/qira-about-premium.webp"
              alt={altText}
              width={1672}
              height={941}
              quality={90}
              priority
              sizes="(max-width: 960px) 100vw, 48vw"
            />
          </figure>
        </section>

        <section className={`${styles.section} shell`}>
          <div className="simplePrinciples" aria-label={title}>
            {principles.map((p) => (
              <span key={p}>{p}</span>
            ))}
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