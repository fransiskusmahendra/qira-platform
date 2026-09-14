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

const TECH_STACK_ID = [
  { name: "Next.js & React", category: "Web & Aplikasi" },
  { name: "TypeScript", category: "Kualitas Kode" },
  { name: "PostgreSQL & Supabase", category: "Database Mandiri" },
  { name: "WhatsApp Cloud API", category: "Chat & Notifikasi" },
  { name: "Python & Node.js", category: "Otomasi & Scripting" },
  { name: "Resend & Webhooks", category: "Alur Email & Event" },
  { name: "Thermal POS Protocols", category: "Cetak Nota Kasir" },
  { name: "REST & External APIs", category: "Integrasi Sistem" },
];

const TECH_STACK_EN = [
  { name: "Next.js & React", category: "Web & Apps" },
  { name: "TypeScript", category: "Code Quality" },
  { name: "PostgreSQL & Supabase", category: "Standalone Database" },
  { name: "WhatsApp Cloud API", category: "Chat & Notifications" },
  { name: "Python & Node.js", category: "Automation & Backend" },
  { name: "Resend & Webhooks", category: "Transactional & Events" },
  { name: "Thermal POS Protocols", category: "Receipt Printing" },
  { name: "REST & External APIs", category: "System Integrations" },
];

export function ServicesPageClient() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const services = isEn ? SERVICES_EN : SERVICES_ID;
  const techStack = isEn ? TECH_STACK_EN : TECH_STACK_ID;

  const eyebrow = isEn ? "QIRA Services" : "Layanan QIRA";
  const heading = isEn ? "Pick a solution based on the problem you want solved." : "Pilih solusi dari masalah yang ingin dirapikan.";
  const lead = isEn
    ? "No need for bloated software. We build simple, targeted digital tools tailored to your business today."
    : "Tidak perlu memulai dari sistem besar. QIRA membantu memilih solusi yang paling berguna untuk kondisi usaha saat ini.";
  const cta = isEn ? "Tell us what you need" : "Ceritakan kebutuhan";

  const closingKicker = isEn ? "Unsure where to start?" : "Belum tahu pilih yang mana?";
  const closingHeading = isEn ? "Start with one problem." : "Mulai dari satu masalah usaha.";
  const closingSubtext = isEn
    ? "Tell us what consumes the most time right now — we will recommend the simplest fix."
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
                <strong>{service.result} →</strong>
              </Link>
            ))}
          </div>
        </section>

        {/* Tech Ecosystem & Standards for Tech-Savvy Clients */}
        <section className={`${styles.section} shell`}>
          <div style={{
            padding: "36px 28px",
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            border: "1px solid var(--line)",
            textAlign: "center"
          }}>
            <p style={{
              fontSize: "12px",
              fontWeight: "750",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--blue)",
              marginBottom: "8px"
            }}>
              {isEn ? "Tech Ecosystem & Standards" : "Ekosistem Teknologi & Standar"}
            </p>
            <h2 style={{ fontSize: "22px", fontWeight: "750", marginBottom: "10px", color: "var(--ink)" }}>
              {isEn ? "Built with modern, battle-tested technologies." : "Dibangun dengan teknologi modern dan teruji."}
            </h2>
            <p style={{ maxWidth: "620px", margin: "0 auto 24px", fontSize: "14px", color: "var(--muted)", lineHeight: "1.6" }}>
              {isEn
                ? "We engineer standalone architectures without vendor lock-in. Your code, database, and domain remain 100% your own business property."
                : "Kami merancang arsitektur mandiri tanpa vendor lock-in. Seluruh kode, database, dan domain 100% menjadi aset milik usaha Anda."}
            </p>

            <div style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "10px",
              maxWidth: "760px",
              margin: "0 auto"
            }}>
              {techStack.map((tech) => (
                <span key={tech.name} style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 14px",
                  background: "white",
                  borderRadius: "100px",
                  border: "1px solid var(--line)",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--ink)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
                }}>
                  <span>{tech.name}</span>
                  <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: "500" }}>({tech.category})</span>
                </span>
              ))}
            </div>
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