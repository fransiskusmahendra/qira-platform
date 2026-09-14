"use client";

import Image from "next/image";
import Link from "next/link";

import styles from "../../SubpageVisual.module.css";
import { Navbar } from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { ClosingCtaSection } from "../../_components/ClosingCtaSection";
import { useLanguage } from "../../../lib/i18n";

const SERVICES_ID = [
  { number: "01", title: "Website UMKM", description: "Website yang menjelaskan usaha, layanan, produk, dan cara menghubungi Anda dengan lebih jelas.", result: "Lebih mudah ditemukan & dipercaya", href: "/solusi/website-umkm" },
  { number: "02", title: "Otomatisasi Bisnis", description: "Kurangi pekerjaan berulang seperti pengingat, alur data, tindak lanjut, dan proses administratif sederhana.", result: "Lebih sedikit pekerjaan manual", href: "/solusi/automation-bisnis" },
  { number: "03", title: "Administrasi Digital", description: "Rapikan form, data, dokumen, pencatatan, dan status pekerjaan dalam alur yang lebih mudah digunakan.", result: "Data & dokumen lebih rapi", href: "/solusi/digitalisasi-administrasi" },
  { number: "04", title: "Alat Kerja Digital", description: "Buat dashboard, generator dokumen, alat transaksi, atau tool khusus untuk kebutuhan operasional tertentu.", result: "Pekerjaan lebih cepat & konsisten", href: "/solusi/business-tools" },
] as const;

const SERVICES_EN = [
  { number: "01", title: "Business Websites", description: "Clear, fast websites that showcase your business, services, and make contacting you effortless.", result: "Easier to find & trust", href: "/solusi/website-umkm" },
  { number: "02", title: "Workflow Automation", description: "Cut repetitive tasks like manual follow-ups, reminders, notifications, and data transfers.", result: "Fewer manual tasks", href: "/solusi/automation-bisnis" },
  { number: "03", title: "Digital Administration", description: "Organize forms, customer records, documents, and order statuses in one intuitive flow.", result: "Organized data & records", href: "/solusi/digitalisasi-administrasi" },
  { number: "04", title: "Custom Work Tools", description: "Build lightweight dashboards, invoice generators, or order tools tailored to your daily operations.", result: "Faster, consistent work", href: "/solusi/business-tools" },
] as const;

export function ServicesPageClient() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const services = isEn ? SERVICES_EN : SERVICES_ID;

  const eyebrow = isEn ? "QIRA Services" : "Layanan QIRA";
  const heading = isEn ? "Pick a solution based on the problem you want solved." : "Pilih solusi dari masalah yang ingin dirapikan.";
  const lead = isEn
    ? "No need for bloated software. We build simple, targeted digital tools tailored to your business today."
    : "Tidak perlu memulai dari sistem besar. QIRA membantu memilih solusi yang paling berguna untuk kondisi usaha saat ini.";
  const cta = isEn ? "Tell us what you need" : "Ceritakan kebutuhan";

  const closingKicker = isEn ? "Unsure where to start?" : "Belum tahu pilih yang mana?";
  const closingHeading = isEn ? "Start with one problem." : "Mulai dari satu masalah usaha.";
  const closingSubtext = isEn
    ? "Tell us what consumes the most time right now â€” we will recommend the simplest fix."
    : "Ceritakan kondisi pekerjaan Anda saat ini, kami bantu rekomendasikan solusi yang paling efisien.";
  const closingPrimary = isEn ? "Help me choose" : "Bantu tentukan solusi";

  return (
    <>
      <Navbar />
      <main>
        <section className={`${styles.hero} shell`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{heading}</h1>
            <p>{lead}</p>
            <div className={styles.heroActions}>
              <Link className="primaryButton" href="/coba-masalah">{cta}</Link>
            </div>
          </div>
          <figure className={styles.heroVisual}>
            <Image
              src="/illustrations/qira-services.webp"
              alt={isEn ? "QIRA digital services for websites, automation, administration, and custom business tools" : "Rangkaian layanan digital QIRA untuk website, otomatisasi, administrasi, dan alat kerja digital"}
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
                <strong>{service.result} â†’</strong>
              </Link>
            ))}
          </div>
        </section>

        <ClosingCtaSection
          kicker={closingKicker}
          heading={closingHeading}
          subtext={closingSubtext}
          primaryText={closingPrimary}
        />
      </main>
      <Footer />
    </>
  );
}