import type { Metadata } from "next";
import Link from "next/link";
import { ConversionTracker } from "../_components/ConversionTracker";
import styles from "../SubpageVisual.module.css";
import { Navbar } from "../_components/Navbar";
import { Footer } from "../_components/Footer";
import { ClosingCtaSection } from "../_components/ClosingCtaSection";

const description = "Studi kasus QIRA yang menunjukkan masalah, solusi, dan hasil alur kerja yang dapat diperiksa tanpa mempublikasikan data sensitif klien.";

export const metadata: Metadata = {
  title: "Studi Kasus QIRA",
  description,
  alternates: { canonical: "/studi-kasus" },
  openGraph: { title: "Studi Kasus QIRA", description, url: "/studi-kasus", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Studi kasus QIRA" }] },
  twitter: { card: "summary_large_image", title: "Studi Kasus QIRA", description, images: ["/opengraph-image"] },
};

const cases = [
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

export default function CaseStudyPage() {
  return (
    <>
      <Navbar />
      <main>
        <ConversionTracker event="case_study_view" />

        <section className={`${styles.hero} shell`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">Studi kasus</p>
            <h1>Lihat masalah yang benar-benar dipecahkan.</h1>
            <p>Tanpa angka yang dibuat-buat. Hanya masalah, solusi, dan hasil alur yang bisa diperiksa dari produk yang sudah dibangun.</p>
            <div className={styles.heroActions}>
              <Link className="primaryButton" href="/portfolio">Lihat tampilan aplikasinya →</Link>
            </div>
          </div>
        </section>

        <section className={`${styles.section} shell`}>
          <div className="caseStudyGrid">
            {cases.map((item, index) => (
              <article className="caseStudyCard" key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p className="kicker">{item.label}</p>
                <h2>{item.title}</h2>
                <div className="caseStudyTriplet">
                  <div>
                    <small>Masalah</small>
                    <p>{item.problem}</p>
                  </div>
                  <div>
                    <small>Solusi QIRA</small>
                    <p>{item.solution}</p>
                  </div>
                  <div>
                    <small>Hasil</small>
                    <p>{item.result}</p>
                  </div>
                </div>
                <p className="qualityNote">{item.note}</p>
              </article>
            ))}
          </div>
        </section>

        <ClosingCtaSection
          kicker="Kebutuhan berbeda?"
          heading="Mulai dari masalah Anda sendiri."
          subtext="Setiap bisnis memiliki keunikan alur kerja. Diskusikan solusi yang paling efisien untuk Anda."
          primaryText="Ceritakan kebutuhan usaha"
        />
      </main>
      <Footer />
    </>
  );
}
