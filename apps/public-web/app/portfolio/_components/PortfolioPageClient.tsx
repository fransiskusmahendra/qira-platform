"use client";

import Image from "next/image";
import Link from "next/link";

import { NodeNetworkCanvas } from "../../_components/NodeNetworkCanvas";
import { ConversionTracker } from "../../_components/ConversionTracker";
import styles from "../../SubpageVisual.module.css";
import { Navbar } from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { ClosingCtaSection } from "../../_components/ClosingCtaSection";
import { useLanguage } from "../../../lib/i18n";

type PortfolioItem = {
  number: string;
  tag: string;
  title: string;
  outcome: string;
  problem: string;
  solution: string;
  result: string;
  visual: string;
  image: string;
  imageAlt: string;
  href?: string;
  cta?: string;
  external?: boolean;
  note?: string;
};

const ITEMS_ID: readonly PortfolioItem[] = [
  {
    number: "01",
    tag: "Produk QIRA",
    title: "Pemetaan Kebutuhan (QIRA Discovery)",
    outcome: "Mengubah hambatan operasional menjadi ruang lingkup proyek yang jelas dan terukur.",
    problem: "Bisnis sering merasakan kendala harian, namun bingung menentukan bentuk sistem yang tepat.",
    solution: "Memetakan kendala menjadi skala prioritas, konteks bisnis, dan kebutuhan modul teknis.",
    result: "Pijakan jelas untuk kesepakatan ruang lingkup transparan tanpa pemborosan anggaran.",
    visual: "Masalah → Prioritas → Ruang lingkup",
    image: "/screenshots/qira-discovery.svg",
    imageAlt: "Tampilan QIRA Discovery dengan progres dan form kebutuhan usaha",
    href: "/discovery",
    cta: "Coba Alur Interaktif",
    note: "Tampilan aplikasi menggunakan data contoh untuk privasi."
  },
  {
    number: "02",
    tag: "Produk QIRA",
    title: "Invoice & Dokumen Otomatis",
    outcome: "Data transaksi terkonversi instan menjadi invoice siap periksa, kirim, dan cetak.",
    problem: "Pembuatan dokumen manual berulang rawan salah hitung, tidak seragam, dan makan waktu.",
    solution: "Editor terpadu dengan pratinjau langsung sebelum dokumen PDF diterbitkan.",
    result: "Satu alur menangani input data sampai dokumen akhir tanpa berpindah-pindah aplikasi.",
    visual: "Input → Pratinjau → PDF",
    image: "/screenshots/qira-invoice-maker.svg",
    imageAlt: "Tampilan QIRA Invoice Maker dengan editor dan pratinjau invoice",
    href: "/discovery?context=invoice%20maker",
    cta: "Konsultasi Sistem Ini",
    note: "Produk internal QIRA. Data dan informasi pembayaran sensitif disamarkan."
  },
  {
    number: "03",
    tag: "Penerapan Klien",
    title: "Kasir Web & Nota Thermal Instan",
    outcome: "Input transaksi hingga cetak nota dalam satu alur kerja cepat tanpa kendala.",
    problem: "Pencatatan kasir dan pembuatan nota manual membuat antrean panjang dan rentan selisih.",
    solution: "Aplikasi ringan yang menyatukan input kasir, rekap diskon, pratinjau nota, dan cetak thermal.",
    result: "Proses transaksi menjadi instan, rekap penjualan otomatis tersimpan rapi di database.",
    visual: "Input → Nota → Cetak",
    image: "/screenshots/travel-transaction-demo.svg",
    imageAlt: "Tampilan aplikasi transaksi perjalanan dan pratinjau nota thermal",
    href: "/discovery?context=pos%20kasir%20nota",
    cta: "Konsultasi Sistem Kasir",
    note: "Penerapan nyata klien dengan nama dan transaksi disamarkan untuk privasi."
  },
  {
    number: "04",
    tag: "Penerapan Klien",
    title: "Toko Bangunan Maduratna — POS & Stok Cloud",
    outcome: "Digitalisasi kasir multi-SKU dan pemantauan stok real-time untuk toko retail & material.",
    problem: "Ribuan item bangunan dicatat manual di buku, rawan selisih stok dan rekap harian melelahkan.",
    solution: "Sistem kasir cloud dengan pencarian instan, auto-deduct inventaris, dan dashboard ringkasan pemilik.",
    result: "Kecepatan kasir 10x lebih cepat, akurasi stok 0% error, dan rekap omset otomatis seketika.",
    visual: "Multi-SKU → Auto Deduct → Rekap Cloud",
    image: "/illustrations/qira-services.webp",
    imageAlt: "Digitalisasi POS dan stok toko bangunan",
    href: "/discovery?context=sistem%20stok%20retail",
    cta: "Konsultasi Sistem Serupa",
    note: "Implementasi operasional retail aktif."
  },
  {
    number: "05",
    tag: "Demo Publik",
    title: "Demo Ekosistem Solusi Bisnis",
    outcome: "Eksplorasi modul sistem terintegrasi yang siap disesuaikan dengan alur bisnis Anda.",
    problem: "Calon klien ingin melihat gambaran sistem sebelum memutuskan berinvestasi teknologi.",
    solution: "Lingkungan demo live interaktif yang menyajikan contoh portal operasional dan alur data.",
    result: "Kepastian implementasi digital dengan melihat langsung interaksi sistem.",
    visual: "Jelajahi → Uji Coba → Terapkan",
    image: "/illustrations/qira-services.webp",
    imageAlt: "Ilustrasi demo solusi bisnis QIRA",
    href: "https://demo.qirasolution.com",
    cta: "Buka Demo Publik",
    external: true,
    note: "Demo konsep interaktif yang siap disesuaikan kebutuhan usaha."
  },
] as const;

const ITEMS_EN: readonly PortfolioItem[] = [
  {
    number: "01",
    tag: "QIRA Product",
    title: "Needs Mapping (QIRA Discovery)",
    outcome: "Turns business bottlenecks into a clear, measurable project scope.",
    problem: "Businesses feel daily friction, but lack clarity on what digital system fits best.",
    solution: "Deconstructs challenges into priorities, business context, and lean technical requirements.",
    result: "A solid baseline for transparent project scoping and realistic budgeting.",
    visual: "Problem → Priorities → Scope",
    image: "/screenshots/qira-discovery.svg",
    imageAlt: "QIRA Discovery interface showing workflow progress and business needs intake",
    href: "/discovery",
    cta: "Try Interactive Flow",
    note: "Preview uses anonymized sample data."
  },
  {
    number: "02",
    tag: "QIRA Product",
    title: "Automated Invoicing & Documents",
    outcome: "Converts transactional data instantly into validated, print-ready PDF invoices.",
    problem: "Manual repetitive invoice creation leads to calculation errors and formatting discrepancies.",
    solution: "Unified data editor with real-time preview before document generation.",
    result: "A single streamlined flow handling data intake to finalized PDFs without tool fragmentation.",
    visual: "Input → Preview → PDF",
    image: "/screenshots/qira-invoice-maker.svg",
    imageAlt: "QIRA Invoice Maker interface with editor and live preview",
    href: "/discovery?context=invoice%20maker",
    cta: "Consult on this System",
    note: "Internal QIRA product. Sensitive payment details anonymized."
  },
  {
    number: "03",
    tag: "Client Deployment",
    title: "Web POS & Instant Thermal Receipts",
    outcome: "Sales input to thermal printing in a unified, friction-free cashier workflow.",
    problem: "Separating order recording and receipt printing causes checkout queues and entry mistakes.",
    solution: "Lightweight application integrating item entry, discounts, live preview, and thermal printing.",
    result: "Instant transaction throughput with automated daily transaction logs in the database.",
    visual: "Input → Receipt → Print",
    image: "/screenshots/travel-transaction-demo.svg",
    imageAlt: "Travel transaction app interface with thermal receipt preview",
    href: "/discovery?context=pos%20kasir%20nota",
    cta: "Consult on POS Systems",
    note: "Real client deployment with names and transactions anonymized."
  },
  {
    number: "04",
    tag: "Client Deployment",
    title: "Maduratna Building Supplies — Cloud POS & Stock",
    outcome: "Multi-SKU cashier digital flow and real-time inventory management for retail.",
    problem: "Thousands of SKUs logged manually in paper books, leading to stock discrepancies and hours of daily reconciliation.",
    solution: "Cloud-based cashier system with instant search, auto-inventory deductions, and owner dashboards.",
    result: "10x faster checkout, 0% inventory variance, and instantaneous daily reconciliation.",
    visual: "Multi-SKU → Auto Deduct → Cloud Summary",
    image: "/illustrations/qira-services.webp",
    imageAlt: "POS and inventory digitalization for building supplies retail",
    href: "/discovery?context=sistem%20stok%20retail",
    cta: "Consult on Similar Systems",
    note: "Active retail deployment."
  },
  {
    number: "05",
    tag: "Public Demo",
    title: "Business Solution Demo Ecosystem",
    outcome: "Explore pre-built interactive modules designed to adapt to your operational workflows.",
    problem: "Business leaders prefer experiencing real functionality before investing in software.",
    solution: "Live interactive demo environment showcasing operations portals, form flows, and reporting.",
    result: "Complete implementation clarity with zero guesswork on software capabilities.",
    visual: "Explore → Test → Implement",
    image: "/illustrations/qira-services.webp",
    imageAlt: "QIRA business solution interactive demo illustration",
    href: "https://demo.qirasolution.com",
    cta: "Open Public Demo",
    external: true,
    note: "Interactive concept demonstration ready for customization."
  },
] as const;

function Action({ item }: { item: PortfolioItem }) {
  if (!item.href || !item.cta) return <span />;
  return item.external ? (
    <a className="simplePortfolioAction" href={item.href} target="_blank" rel="noreferrer">
      {item.cta} →
    </a>
  ) : (
    <Link className="simplePortfolioAction" href={item.href}>
      {item.cta} →
    </Link>
  );
}

export function PortfolioPageClient() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const items = isEn ? ITEMS_EN : ITEMS_ID;

  const eyebrow = isEn ? "Work & Deployments" : "Karya & Penerapan";
  const heading = isEn ? "Proven software in production." : "Software terbukti di lapangan.";
  const lead = isEn
    ? "Internal products, verified client deployments, and operational systems engineered for measurable business outcomes."
    : "Sistem produk internal, implementasi nyata di klien, dan software operasional yang dibangun untuk memecahkan hambatan bisnis.";

  const principles = isEn
    ? ["Interactive Demos Ready", "Production Systems", "Client Data Protected"]
    : ["Demo Interaktif Siap Pakai", "Sistem Teruji Lapangan", "Kerahasiaan Data Terjamin"];

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
          <figure className={styles.heroVisual} style={{ minHeight: 440 }}>
            <NodeNetworkCanvas />
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

                {/* Problem -> Solution -> Result Compact Flow */}
                <div className="karyaFlowGrid">
                  <div className="karyaFlowCol">
                    <small style={{ color: "#f87171" }}>{isEn ? "Challenge" : "Tantangan"}</small>
                    <p>{item.problem}</p>
                  </div>
                  <div className="karyaFlowCol">
                    <small style={{ color: "#38bdf8" }}>{isEn ? "Solution" : "Solusi"}</small>
                    <p>{item.solution}</p>
                  </div>
                  <div className="karyaFlowCol">
                    <small style={{ color: "#34d399" }}>{isEn ? "Result" : "Hasil"}</small>
                    <p>{item.result}</p>
                  </div>
                </div>

                <div className="simplePortfolioVisual">
                  <strong>{item.visual}</strong>
                  <Image src={item.image} alt={item.imageAlt} width={600} height={340} />
                </div>
                <Action item={item} />
              </article>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0 }}>
              {isEn
                ? "* Previews and client deployments use anonymized data to respect privacy."
                : "* Seluruh tampilan dan penerapan menggunakan data yang disamarkan demi menjaga privasi klien."}
            </p>
          </div>
        </section>

        <ClosingCtaSection />
      </main>
      <Footer />
    </>
  );
}