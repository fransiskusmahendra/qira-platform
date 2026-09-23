"use client";

import Image from "next/image";
import Link from "next/link";

import { IsometricStackCanvas } from "../../_components/IsometricStackCanvas";
import styles from "../../SubpageVisual.module.css";
import { Navbar } from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { ClosingCtaSection } from "../../_components/ClosingCtaSection";
import { useLanguage } from "../../../lib/i18n";

const SERVICES_ID = [
  { number: "01", title: "Business Website", description: "Website yang menjelaskan profil usaha, katalog produk, dan kontak bisnis dengan jelas.", result: "Mudah ditemukan & kredibel", href: "/solusi/website-umkm" },
  { number: "02", title: "Workflow Automation", description: "Kurangi pekerjaan berulang seperti follow-up, pengingat jadwal, alur data, dan notifikasi.", result: "Pangkas tugas manual", href: "/solusi/automation-bisnis" },
  { number: "03", title: "Digital Administration", description: "Rapikan form input, data pelanggan, dokumen invoice, dan status order dalam satu sistem teratur.", result: "Data & dokumen rapi", href: "/solusi/digitalisasi-administrasi" },
  { number: "04", title: "Custom Tools & Dashboard", description: "Dashboard operasional, generator invoice PDF, kasir POS, atau tool khusus kebutuhan tim Anda.", result: "Pekerjaan cepat & presisi", href: "/solusi/business-tools" },
] as const;

const SERVICES_EN = [
  { number: "01", title: "Business Websites", description: "Clear, fast websites that showcase your business, services, and make contacting you effortless.", result: "Easier to find & trust", href: "/solusi/website-umkm" },
  { number: "02", title: "Workflow Automation", description: "Cut repetitive tasks like manual follow-ups, reminders, notifications, and data transfers.", result: "Fewer manual tasks", href: "/solusi/automation-bisnis" },
  { number: "03", title: "Digital Administration", description: "Organize forms, customer records, documents, and order statuses in one intuitive flow.", result: "Organized data & records", href: "/solusi/digitalisasi-administrasi" },
  { number: "04", title: "Custom Work Tools", description: "Build lightweight dashboards, invoice generators, or order tools tailored to your daily operations.", result: "Faster, consistent work", href: "/solusi/business-tools" },
] as const;

const TECH_STACK_ID = [
  { name: "Next.js & React", category: "Web & Apps" },
  { name: "TypeScript", category: "Type Safety" },
  { name: "PostgreSQL & Supabase", category: "Database & Backend" },
  { name: "WhatsApp Cloud API", category: "Chat & Notifications" },
  { name: "Python & Node.js", category: "Automation & Scripting" },
  { name: "Resend & Webhooks", category: "Email & Webhooks" },
  { name: "Thermal POS Protocols", category: "Thermal POS & Printing" },
  { name: "REST & External APIs", category: "API Integrations" },
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

  const eyebrow = isEn ? "Solutions" : "Solusi";
  const heading = isEn ? "Practical systems built for real operations." : "Sistem praktis untuk operasional nyata.";
  const lead = isEn
    ? "Focused digital tools engineered to eliminate bottlenecks and streamline daily operations."
    : "Sistem digital terarah untuk memangkas hambatan manual dan merapikan operasional harian.";
  const cta = isEn ? "Tell us what you need" : "Ceritakan kebutuhan";

  const closingKicker = isEn ? "Consultation" : "Konsultasi";
  const closingHeading = isEn ? "Ready to streamline your workflow?" : "Siap merapikan alur kerja bisnis Anda?";
  const closingSubtext = isEn
    ? "Discuss your operational challenges directly with our team to find the right digital fix."
    : "Diskusikan kendala operasional langsung dengan tim kami untuk solusi yang paling tepat.";
  const closingPrimary = isEn ? "Start Consultation" : "Mulai Diskusi";

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
          <figure className={styles.heroVisual} style={{ minHeight: 440 }}>
            <IsometricStackCanvas />
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
            background: "rgba(14, 20, 36, 0.75)",
            backdropFilter: "blur(12px)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
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
            <h2 style={{ fontSize: "22px", fontWeight: "750", marginBottom: "10px", color: "#ffffff" }}>
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
                  background: "rgba(18, 27, 48, 0.7)",
                  borderRadius: "100px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#ffffff",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.2)"
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