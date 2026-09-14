"use client";

import Link from "next/link";
import { ConversionTracker } from "../../_components/ConversionTracker";
import styles from "../../SubpageVisual.module.css";
import { Navbar } from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { ClosingCtaSection } from "../../_components/ClosingCtaSection";
import { useLanguage } from "../../../lib/i18n";

const CASES_ID = [
  {
    label: "Produk internal",
    title: "Pemetaan kebutuhan bisnis",
    problem: "Calon pengguna sering tahu masalahnya, tetapi belum tahu bentuk solusi digital yang tepat.",
    solution: "QIRA Discovery memecah kebutuhan menjadi masalah, prioritas, konteks, dan ruang lingkup awal.",
    result: "Hasil pemetaan menjadi bahan yang lebih jelas untuk diskusi solusi dan proposal.",
    note: "Menggunakan data contoh pada tampilan publik.",
  },
  {
    label: "Produk internal",
    title: "Invoice & dokumen",
    problem: "Pembuatan dokumen berulang mudah menghasilkan format yang tidak konsisten dan pemeriksaan yang memakan waktu.",
    solution: "Editor data dan pratinjau dokumen disatukan agar perubahan dapat diperiksa sebelum PDF dibuat.",
    result: "Satu alur menangani input, pratinjau, dan dokumen akhir tanpa menyalin data ke beberapa tempat.",
    note: "Identitas legal dan informasi pembayaran disamarkan pada portofolio.",
  },
  {
    label: "Penerapan operasional",
    title: "Transaksi sampai nota thermal",
    problem: "Input transaksi dan pembuatan nota yang terpisah membuat pekerjaan lapangan lebih panjang dan rawan pengulangan.",
    solution: "Satu aplikasi menghubungkan input transaksi, perhitungan, pratinjau nota, dan kebutuhan cetak thermal.",
    result: "Alur kerja menjadi satu rangkaian dari input sampai nota siap dicetak.",
    note: "Nama klien, petugas, identitas, dan data transaksi diganti atau disamarkan.",
  },
];

const CASES_EN = [
  {
    label: "Internal product",
    title: "Business needs discovery",
    problem: "Clients often feel daily bottlenecks, but don't know the exact digital solution they need.",
    solution: "QIRA Discovery breaks pain points down into priorities, business context, and lean scope.",
    result: "A clear starting roadmap for transparent technical scope and realistic budgeting.",
    note: "Sample data utilized on public view.",
  },
  {
    label: "Internal product",
    title: "Invoice & documents",
    problem: "Manual repetitive invoicing causes formatting mistakes and hours spent cross-checking.",
    solution: "Unified data editor and real-time preview ensure changes are verified before PDF creation.",
    result: "A single flow handles input, review, and final documents without copying data across tools.",
    note: "Legal identity and payment data anonymized.",
  },
  {
    label: "Operational deployment",
    title: "POS order entry to thermal receipts",
    problem: "Disconnected sales input and receipt generation lengthen customer wait times and cause mistakes.",
    solution: "A lightweight app connects transaction input, pricing math, preview, and thermal printing.",
    result: "A single unified workflow from order entry straight to ready-to-print receipts.",
    note: "Client names, staff, and transactional details anonymized for portfolio.",
  },
];

export function CaseStudyPageClient() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const cases = isEn ? CASES_EN : CASES_ID;

  const eyebrow = isEn ? "Case Studies" : "Studi kasus";
  const heading = isEn ? "Real problems solved cleanly." : "Lihat masalah yang benar-benar dipecahkan.";
  const lead = isEn
    ? "No inflated claims. Just real operational bottlenecks, our solution, and verified outcomes."
    : "Tanpa angka yang dibuat-buat. Hanya masalah, solusi, dan hasil alur yang bisa diperiksa dari produk yang sudah dibangun.";
  const cta = isEn ? "See app portfolio â†’" : "Lihat tampilan aplikasinya â†’";

  const problemLabel = isEn ? "Bottleneck:" : "Masalah:";
  const solutionLabel = isEn ? "Solution:" : "Solusi:";
  const outcomeLabel = isEn ? "Outcome:" : "Hasil alur:";

  return (
    <>
      <Navbar />
      <main>
        <ConversionTracker event="case_study_view" />

        <section className={`${styles.hero} shell`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{heading}</h1>
            <p>{lead}</p>
            <div className={styles.heroActions}>
              <Link className="primaryButton" href="/portfolio">{cta}</Link>
            </div>
          </div>
        </section>

        <section className={`${styles.section} shell`}>
          <div className="caseStudiesGrid">
            {cases.map((c) => (
              <article className="caseStudyCard" key={c.title}>
                <span>{c.label}</span>
                <h3>{c.title}</h3>
                <p><strong>{problemLabel}</strong> {c.problem}</p>
                <p><strong>{solutionLabel}</strong> {c.solution}</p>
                <p><strong>{outcomeLabel}</strong> {c.result}</p>
                <small>{c.note}</small>
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