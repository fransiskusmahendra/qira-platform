import type { Metadata } from "next";
import Link from "next/link";
import { ConversionTracker } from "../_components/ConversionTracker";
import styles from "../SubpageVisual.module.css";
import { Navbar } from "../_components/Navbar";
import { Footer } from "../_components/Footer";
import { ClosingCtaSection } from "../_components/ClosingCtaSection";

const description = "Pahami proses kerja QIRA dari pemetaan kebutuhan, estimasi, pembangunan, review, implementasi, hingga dukungan setelah solusi digunakan.";

export const metadata: Metadata = {
  title: "Cara Kerja QIRA",
  description,
  alternates: { canonical: "/cara-kerja" },
  openGraph: { title: "Cara Kerja QIRA", description, url: "/cara-kerja", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Cara kerja QIRA" }] },
  twitter: { card: "summary_large_image", title: "Cara Kerja QIRA", description, images: ["/opengraph-image"] },
};

const steps = [
  ["01", "Ceritakan", "Mulai dari satu masalah atau pekerjaan yang paling ingin dirapikan."],
  ["02", "Petakan", "QIRA menyusun kebutuhan, pengguna, prioritas, risiko, dan batas ruang lingkup."],
  ["03", "Estimasi", "Bentuk solusi, biaya, tahapan, dan asumsi kerja dijelaskan sebelum pembangunan."],
  ["04", "Bangun", "Versi pertama dibuat fokus pada alur paling penting, bukan sebanyak mungkin fitur."],
  ["05", "Review", "Solusi diperiksa pada perangkat dan skenario penggunaan yang relevan."],
  ["06", "Implementasi", "Versi yang disetujui diterapkan dan alur penggunaan dijelaskan."],
  ["07", "Support", "Perbaikan atau pengembangan berikutnya dapat disepakati berdasarkan kebutuhan nyata."],
];

export default function ProcessPage() {
  return (
    <>
      <Navbar />
      <main>
        <ConversionTracker event="process_view" />

        <section className={`${styles.hero} shell`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">Cara kerja QIRA</p>
            <h1>Jelas sebelum dibangun.</h1>
            <p>Teknologi seharusnya mengurangi kebingungan, termasuk saat proses pembuatannya.</p>
            <div className={styles.heroActions}>
              <Link className="primaryButton" href="/coba-masalah">Mulai dari masalah</Link>
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

        <section className={`${styles.section} shell`}>
          <div className="simplePrinciples">
            <article>
              <span>Sebelum mulai</span>
              <h3>Tahu apa yang sedang dibangun</h3>
              <p>Tujuan dan ruang lingkup dibahas agar ekspektasi lebih jelas.</p>
            </article>
            <article>
              <span>Saat dibangun</span>
              <h3>Perubahan tidak dibiarkan liar</h3>
              <p>Kebutuhan tambahan dipisahkan dari ruang lingkup awal bila memengaruhi biaya atau waktu.</p>
            </article>
            <article>
              <span>Setelah digunakan</span>
              <h3>Perbaikan berdasarkan penggunaan</h3>
              <p>Pengembangan berikutnya mengikuti kebutuhan yang benar-benar muncul.</p>
            </article>
          </div>
        </section>

        <ClosingCtaSection
          kicker="Langkah pertama"
          heading="Tidak perlu menyiapkan dokumen teknis."
          subtext="Ceritakan saja pekerjaan yang paling merepotkan saat ini. Kami yang memetakan teknologinya."
          primaryText="Mulai pemetaan awal"
        />
      </main>
      <Footer />
    </>
  );
}
