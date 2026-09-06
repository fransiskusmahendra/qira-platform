import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import styles from "../SubpageVisual.module.css";
import { Navbar } from "../_components/Navbar";
import { Footer } from "../_components/Footer";
import { ClosingCtaSection } from "../_components/ClosingCtaSection";

const description = "Layanan QIRA untuk website UMKM, otomatisasi bisnis, administrasi digital, dan alat kerja digital yang dibuat sesuai kebutuhan nyata usaha.";
const socialImage = { url: "/opengraph-image", width: 1200, height: 630, alt: "Layanan QIRA — website, otomatisasi, administrasi, dan alat kerja digital" };

export const metadata: Metadata = {
  title: "Layanan",
  description,
  alternates: { canonical: "/layanan" },
  openGraph: { title: "Layanan QIRA", description, url: "/layanan", type: "website", images: [socialImage] },
  twitter: { card: "summary_large_image", title: "Layanan QIRA", description, images: ["/opengraph-image"] },
};

const services = [
  { number: "01", title: "Website UMKM", description: "Website yang menjelaskan usaha, layanan, produk, dan cara menghubungi Anda dengan lebih jelas.", result: "Lebih mudah ditemukan & dipercaya", href: "/solusi/website-umkm" },
  { number: "02", title: "Otomatisasi Bisnis", description: "Kurangi pekerjaan berulang seperti pengingat, alur data, tindak lanjut, dan proses administratif sederhana.", result: "Lebih sedikit pekerjaan manual", href: "/solusi/automation-bisnis" },
  { number: "03", title: "Administrasi Digital", description: "Rapikan form, data, dokumen, pencatatan, dan status pekerjaan dalam alur yang lebih mudah digunakan.", result: "Data & dokumen lebih rapi", href: "/solusi/digitalisasi-administrasi" },
  { number: "04", title: "Alat Kerja Digital", description: "Buat dashboard, generator dokumen, alat transaksi, atau tool khusus untuk kebutuhan operasional tertentu.", result: "Pekerjaan lebih cepat & konsisten", href: "/solusi/business-tools" },
] as const;

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className={`${styles.hero} shell`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">Layanan QIRA</p>
            <h1>Pilih solusi dari masalah yang ingin dirapikan.</h1>
            <p>Tidak perlu memulai dari sistem besar. QIRA membantu memilih solusi yang paling berguna untuk kondisi usaha saat ini.</p>
            <div className={styles.heroActions}>
              <Link className="primaryButton" href="/coba-masalah">Ceritakan kebutuhan</Link>
            </div>
          </div>
          <figure className={styles.heroVisual}>
            <Image
              src="/illustrations/qira-services.webp"
              alt="Rangkaian layanan digital QIRA untuk website, otomatisasi, administrasi, dan alat kerja digital"
              width={1672}
              height={941}
              quality={90}
              priority
              sizes="(max-width: 960px) 100vw, 48vw"
            />
          </figure>
        </section>

        <section className={`${styles.section} shell`}>
          <div className="servicesPageGrid">
            {services.map((service) => (
              <Link className="companyServiceCard" href={service.href} key={service.title}>
                <span>{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <strong>{service.result} →</strong>
              </Link>
            ))}
          </div>
        </section>

        <ClosingCtaSection
          kicker="Belum tahu pilih yang mana?"
          heading="Mulai dari satu masalah usaha."
          subtext="Ceritakan kondisi pekerjaan Anda saat ini, kami bantu rekomendasikan solusi yang paling efisien."
          primaryText="Bantu tentukan solusi"
        />
      </main>
      <Footer />
    </>
  );
}
