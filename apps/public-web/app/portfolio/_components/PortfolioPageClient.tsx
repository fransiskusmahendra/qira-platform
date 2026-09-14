"use client";

import Image from "next/image";
import Link from "next/link";

import { ConversionTracker } from "../../_components/ConversionTracker";
import styles from "../../SubpageVisual.module.css";
import { Navbar } from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { ClosingCtaSection } from "../../_components/ClosingCtaSection";
import { useLanguage } from "../../../lib/i18n";

type PortfolioItem = { number: string; tag: string; title: string; outcome: string; visual: string; image: string; imageAlt: string; href?: string; cta?: string; external?: boolean; note?: string };

const ITEMS_ID: readonly PortfolioItem[] = [
  { number: "01", tag: "Produk QIRA", title: "Pemetaan Kebutuhan", outcome: "Kebutuhan menjadi ruang lingkup yang jelas", visual: "Masalah â†’ Prioritas â†’ Ruang lingkup", image: "/screenshots/qira-discovery.svg", imageAlt: "Tampilan QIRA Discovery dengan progres dan form kebutuhan usaha", href: "/discovery", cta: "Coba alurnya", note: "Tampilan aplikasi menggunakan data contoh." },
  { number: "02", tag: "Produk QIRA", title: "Invoice & Dokumen", outcome: "Data transaksi menjadi invoice siap diperiksa, dicetak, atau disimpan", visual: "Input â†’ Pratinjau â†’ PDF", image: "/screenshots/qira-invoice-maker.svg", imageAlt: "Tampilan QIRA Invoice Maker dengan editor dan pratinjau invoice", note: "Produk internal QIRA. Screenshot memakai data contoh; identitas legal dan informasi pembayaran sensitif disamarkan." },
  { number: "03", tag: "Penerapan klien", title: "Alat Transaksi & Nota", outcome: "Input transaksi sampai nota dalam satu alur kerja", visual: "Input â†’ Nota â†’ Cetak", image: "/screenshots/travel-transaction-demo.svg", imageAlt: "Tampilan aplikasi transaksi perjalanan dan pratinjau nota thermal", note: "Tampilan penerapan nyata dengan nama klien, petugas, identitas, dan data transaksi diganti atau disamarkan untuk portofolio." },
  { number: "04", tag: "Demo publik", title: "Demo Solusi Bisnis", outcome: "Calon klien dapat melihat gambaran solusi sebelum memulai", visual: "Lihat â†’ Coba â†’ Diskusikan", image: "/illustrations/qira-services.webp", imageAlt: "Ilustrasi demo solusi bisnis QIRA", href: "https://demo.qirasolution.com", cta: "Buka demo", external: true, note: "Demo konsep QIRA, bukan klaim sebagai proyek klien." },
] as const;

const ITEMS_EN: readonly PortfolioItem[] = [
  { number: "01", tag: "QIRA Product", title: "Needs Mapping", outcome: "Turns business bottlenecks into a clear project scope", visual: "Problem â†’ Priorities â†’ Scope", image: "/screenshots/qira-discovery.svg", imageAlt: "QIRA Discovery interface showing workflow progress and business needs intake", href: "/discovery", cta: "Try interactive flow", note: "App preview uses sample data." },
  { number: "02", tag: "QIRA Product", title: "Invoice & Documents", outcome: "Transaction data into ready-to-send PDF invoices", visual: "Input â†’ Preview â†’ PDF", image: "/screenshots/qira-invoice-maker.svg", imageAlt: "QIRA Invoice Maker interface with editor and live preview", note: "Internal QIRA product. Preview uses sample data with client details anonymized." },
  { number: "03", tag: "Client Deployment", title: "Transactions & Receipts", outcome: "Order entry to thermal receipt in a single workflow", visual: "Input â†’ Receipt â†’ Print", image: "/screenshots/travel-transaction-demo.svg", imageAlt: "Travel transaction app interface with thermal receipt preview", note: "Real client deployment with names, staff, and transactional details anonymized." },
  { number: "04", tag: "Public Demo", title: "Business Solution Demo", outcome: "Explore interactive samples before committing", visual: "Explore â†’ Test â†’ Discuss", image: "/illustrations/qira-services.webp", imageAlt: "QIRA business solution interactive demo illustration", href: "https://demo.qirasolution.com", cta: "Open demo", external: true, note: "Concept demonstration by QIRA." },
] as const;

function Action({ item }: { item: PortfolioItem }) {
  if (!item.href || !item.cta) return <span />;
  return item.external ? <a className="simplePortfolioAction" href={item.href} target="_blank" rel="noreferrer">{item.cta} â†’</a> : <Link className="simplePortfolioAction" href={item.href}>{item.cta} â†’</Link>;
}

export function PortfolioPageClient() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const items = isEn ? ITEMS_EN : ITEMS_ID;

  const eyebrow = isEn ? "Products & Work" : "Produk & karya";
  const heading = isEn ? "See what we've built." : "Lihat solusi yang sudah dibangun.";
  const lead = isEn
    ? "Internal QIRA tools, verified real-world deployments, and interactive demos you can test."
    : "Produk internal QIRA, penerapan nyata yang aman ditampilkan, dan demo publik yang dapat dicoba.";

  const principles = isEn ? [
    "Interactive demos available",
    "Public previews ready",
    "Client data strictly protected"
  ] : [
    "Produk internal dapat dicoba",
    "Demo publik tersedia",
    "Data klien tidak dipublikasikan tanpa izin"
  ];

  return (
    <>
      <Navbar />
      <main>
        <ConversionTracker event="portfolio_view" />

        <section className={`${styles.hero} shell`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{heading}</h1>
            <p>{lead}</p>
          </div>
          <figure className={styles.heroVisual}>
            <Image
              src="/illustrations/premium/qira-portfolio-premium.webp"
              alt={isEn ? "Collection of QIRA websites, dashboards, automation, documents, and needs discovery" : "Kumpulan website, dashboard, otomatisasi, dokumen, dan pemetaan kebutuhan QIRA"}
              width={1672}
              height={941}
              quality={90}
              priority
              sizes="(max-width: 960px) 100vw, 48vw"
            />
          </figure>
        </section>

        <section className={`${styles.section} shell`}>
          <div className="simplePrinciples" aria-label={isEn ? "QIRA commitments and proof" : "Bukti dan komitmen QIRA"}>
            {principles.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </section>

        <section className={`${styles.section} shell`}>
          <div className="simplePortfolioGrid">
            {items.map((item) => (
              <article className="simplePortfolioCard" key={item.title}>
                <div className="simplePortfolioHead">
                  <span>{item.number}</span>
                  <p className="tag">{item.tag}</p>
                </div>
                <h3>{item.title}</h3>
                <p className="outcome">{item.outcome}</p>
                <div className="simplePortfolioVisual">
                  <strong>{item.visual}</strong>
                  <Image src={item.image} alt={item.imageAlt} width={600} height={340} />
                </div>
                {item.note && <p className="simplePortfolioNote">{item.note}</p>}
                <Action item={item} />
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