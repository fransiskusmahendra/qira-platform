"use client";

import Link from "next/link";
import { ConversionTracker } from "../../_components/ConversionTracker";
import styles from "../../SubpageVisual.module.css";
import { Navbar } from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { ClosingCtaSection } from "../../_components/ClosingCtaSection";
import { useLanguage } from "../../../lib/i18n";

const STEPS_ID = [
  ["01", "Ceritakan", "Mulai dari satu masalah atau pekerjaan yang paling ingin dirapikan."],
  ["02", "Petakan", "QIRA menyusun kebutuhan, pengguna, prioritas, risiko, dan batas ruang lingkup."],
  ["03", "Estimasi", "Bentuk solusi, biaya, tahapan, dan asumsi kerja dijelaskan sebelum pembangunan."],
  ["04", "Bangun", "Versi pertama dibuat fokus pada alur paling penting, bukan sebanyak mungkin fitur."],
  ["05", "Review", "Solusi diperiksa pada perangkat dan skenario penggunaan yang relevan."],
  ["06", "Implementasi", "Versi yang disetujui diterapkan dan alur penggunaan dijelaskan."],
  ["07", "Support", "Perbaikan atau pengembangan berikutnya dapat disepakati berdasarkan kebutuhan nyata."],
];

const STEPS_EN = [
  ["01", "Share", "Begin with the single bottleneck or workflow you most want to streamline."],
  ["02", "Map", "QIRA outlines user flows, requirements, priorities, risks, and project scope."],
  ["03", "Estimate", "Solution architecture, investment, timeline, and milestones are transparent upfront."],
  ["04", "Build", "The first version focuses on core functional flows rather than bloated features."],
  ["05", "Review", "Solutions are rigorously tested across real-world devices and user scenarios."],
  ["06", "Deploy", "Approved systems are rolled out smoothly with clear operational onboarding."],
  ["07", "Support", "Future upgrades and maintenance are planned based on actual business feedback."],
];

export function ProcessPageClient() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const eyebrow = isEn ? "How QIRA Works" : "Cara kerja QIRA";
  const heading = isEn ? "Crystal clear before anything is built." : "Jelas sebelum dibangun.";
  const lead = isEn
    ? "Technology should eliminate confusion — starting with the way it is built."
    : "Teknologi seharusnya mengurangi kebingungan, termasuk saat proses pembuatannya.";
  const ctaText = isEn ? "Start with your challenge" : "Mulai dari masalah";
  const steps = isEn ? STEPS_EN : STEPS_ID;

  return (
    <>
      <Navbar />
      <main>
        <ConversionTracker event="process_view" />

        <section className={`${styles.hero} shell`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{heading}</h1>
            <p>{lead}</p>
            <div className={styles.heroActions}>
              <Link className="primaryButton" href="/coba-masalah">
                {ctaText}
              </Link>
            </div>
          </div>
        </section>

        <section className={`${styles.section} shell`}>
          <div className="processSteps">
            {steps.map(([n, t, p]) => (
              <article key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
        </section>

        <ClosingCtaSection />
      </main>
      <Footer />
    </>
  );
}