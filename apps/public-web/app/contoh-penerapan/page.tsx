import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import styles from "../SubpageVisual.module.css";
import { Navbar } from "../_components/Navbar";
import { Footer } from "../_components/Footer";
import { ClosingCtaSection } from "../_components/ClosingCtaSection";

const description = "Lihat contoh sederhana bagaimana QIRA mengubah masalah bisnis sehari-hari menjadi solusi digital yang lebih rapi dan mudah digunakan.";

export const metadata: Metadata = {
  title: "Contoh Penerapan",
  description,
  alternates: { canonical: "/contoh-penerapan" },
  openGraph: { title: "Contoh Penerapan QIRA", description, url: "/contoh-penerapan", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Contoh penerapan solusi QIRA" }] },
  twitter: { card: "summary_large_image", title: "Contoh Penerapan QIRA", description, images: ["/opengraph-image"] },
};

const EXAMPLES = [
  ["Penjualan", "Chat -> Dashboard"],
  ["Administrasi", "Data -> Dokumen"],
  ["Tindak lanjut", "Lupa -> Otomatis"],
  ["Perencanaan", "Bingung -> Punya arah"],
] as const;

export default function ExamplePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className={`${styles.hero} shell`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">Contoh Penerapan</p>
            <h1>Lihat masalah berubah menjadi alur yang rapi.</h1>
            <p>Dari catatan manual, chat berserakan, hingga tugas berulang yang memakan waktu setiap hari.</p>
            <div className={styles.heroActions}>
              <Link className="primaryButton" href="/coba-masalah">Ceritakan masalah usaha</Link>
            </div>
          </div>
          <figure className={styles.heroVisual}>
            <Image
              src="/illustrations/premium/qira-examples-premium.webp"
              alt="Input bisnis yang menjadi dokumen, tindak lanjut, dan laporan teratur"
              width={1672}
              height={941}
              quality={90}
              priority
              sizes="(max-width: 960px) 100vw, 48vw"
            />
          </figure>
        </section>

        <section className={`${styles.section} shell`}>
          <div className="simpleExamples">
            {EXAMPLES.map(([label, flow]) => (
              <span key={label}>
                <small>{label}</small>
                <strong>{flow}</strong>
              </span>
            ))}
          </div>
        </section>

        <section className={`${styles.section} shell`}>
          <div style={{
            background: "#ffffff",
            border: "1px solid #cbd5e1",
            borderRadius: "16px",
            padding: "28px 32px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            alignItems: "center",
            boxShadow: "0 4px 18px rgba(7, 26, 51, 0.04)"
          }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1.2px", color: "#1769ff", display: "block", marginBottom: "6px" }}>
                Blueprint Khusus Industri - Training & Sertifikasi
              </span>
              <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#071a33", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                Sistem Notifikasi Masa Kadaluarsa Sertifikat Logistik (UTS)
              </h2>
              <p style={{ margin: "0", color: "#475569", fontSize: "14px", lineHeight: "1.5" }}>
                Simulasi interaktif notifikasi WhatsApp Cloud API & Email otomatis (H-60, H-30, H-7), modul verifikasi publik keabsahan sertifikat, dan kalkulator recurring revenue renewal.
              </p>
            </div>
            <div style={{ justifySelf: "start" }}>
              <Link className="primaryButton" href="/contoh-penerapan/sertifikasi-logistik">
                Buka Simulasi Interaktif
              </Link>
            </div>
          </div>
        </section>

        <ClosingCtaSection
          kicker="Langkah berikutnya"
          heading="Pilih satu masalah yang ingin dirapikan."
          subtext="Mulai dari proses yang paling sering memakan waktu tim Anda sehari-hari."
          primaryText="Ceritakan masalah usaha"
        />
      </main>
      <Footer />
    </>
  );
}
