import type { Metadata } from "next";
import Link from "next/link";
import { ConversionTracker } from "../_components/ConversionTracker";
import { SubpageBackground } from "../_components/SubpageBackground";
import { GUIDES } from "./guides";
import styles from "../SubpageVisual.module.css";
import { Navbar } from "../_components/Navbar";
import { Footer } from "../_components/Footer";
import { ClosingCtaSection } from "../_components/ClosingCtaSection";

const description = "Panduan praktis QIRA tentang website UMKM, otomatisasi bisnis, administrasi digital, dan aplikasi custom untuk operasional.";

export const metadata: Metadata = {
  title: "Panduan Digital untuk Bisnis",
  description,
  alternates: { canonical: "/panduan" },
  openGraph: { title: "Panduan Digital untuk Bisnis | QIRA", description, url: "/panduan", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Panduan digital QIRA" }] },
  twitter: { card: "summary_large_image", title: "Panduan Digital untuk Bisnis | QIRA", description, images: ["/opengraph-image"] },
};

export default function GuidesPage() {
  return (
    <>
      <Navbar />
      <main style={{ position: "relative" }}>
        <SubpageBackground />
        <ConversionTracker event="guide_view" />

        <section className={`${styles.hero} shell`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">Panduan QIRA</p>
            <h1>Pahami kebutuhan sebelum membeli teknologi.</h1>
            <p>Penjelasan praktis untuk membantu bisnis memilih langkah digital yang masuk akal dan terhindar dari pemborosan sistem yang terlalu rumit.</p>
          </div>
        </section>

        <section className={`${styles.section} shell`}>
          <div className="guideGrid">
            {Object.entries(GUIDES).map(([slug, guide]) => (
              <Link key={slug} href={`/panduan/${slug}`}>
                <span>{guide.eyebrow}</span>
                <strong>{guide.title}</strong>
                <p>{guide.description}</p>
                <small>Baca panduan →</small>
              </Link>
            ))}
          </div>
        </section>

        <ClosingCtaSection
          kicker="Masih belum yakin?"
          heading="Mulai dari masalah, bukan produknya."
          subtext="Ceritakan kendala operasional Anda, kami bantu tentukan solusi yang paling efisien."
          primaryText="Ceritakan masalah usaha"
        />
      </main>
      <Footer />
    </>
  );
}
