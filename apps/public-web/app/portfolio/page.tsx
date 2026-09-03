import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ConversionTracker } from "../_components/ConversionTracker";
import { ContextualWhatsAppCta } from "../_components/ContextualWhatsAppCta";
import styles from "../SubpageVisual.module.css";

const PORTFOLIO_DESCRIPTION = "Lihat produk internal, penerapan nyata, dan demo solusi QIRA melalui contoh aplikasi yang aman ditampilkan.";

export const metadata: Metadata = {
  title: "Portofolio",
  description: PORTFOLIO_DESCRIPTION,
  alternates: { canonical: "/portfolio" },
  openGraph: { title: "Portofolio QIRA", description: PORTFOLIO_DESCRIPTION, url: "/portfolio", type: "website" },
  twitter: { card: "summary_large_image", title: "Portofolio QIRA", description: PORTFOLIO_DESCRIPTION },
};

type PortfolioItem = { number: string; tag: string; title: string; outcome: string; visual: string; image: string; imageAlt: string; href?: string; cta?: string; external?: boolean; note?: string };

const ITEMS: readonly PortfolioItem[] = [
  { number: "01", tag: "Produk QIRA", title: "Pemetaan Kebutuhan", outcome: "Kebutuhan menjadi ruang lingkup yang jelas", visual: "Masalah → Prioritas → Ruang lingkup", image: "/screenshots/qira-discovery.svg", imageAlt: "Tampilan QIRA Discovery dengan progres dan form kebutuhan usaha", href: "/discovery", cta: "Coba alurnya", note: "Tampilan aplikasi menggunakan data contoh." },
  { number: "02", tag: "Produk QIRA", title: "Invoice & Dokumen", outcome: "Data transaksi menjadi invoice siap diperiksa, dicetak, atau disimpan", visual: "Input → Pratinjau → PDF", image: "/screenshots/qira-invoice-maker.svg", imageAlt: "Tampilan QIRA Invoice Maker dengan editor dan pratinjau invoice", note: "Produk internal QIRA. Screenshot memakai data contoh; identitas legal dan informasi pembayaran sensitif disamarkan." },
  { number: "03", tag: "Penerapan klien", title: "Alat Transaksi & Nota", outcome: "Input transaksi sampai nota dalam satu alur kerja", visual: "Input → Nota → Cetak", image: "/screenshots/travel-transaction-demo.svg", imageAlt: "Tampilan aplikasi transaksi perjalanan dan pratinjau nota thermal", note: "Tampilan penerapan nyata dengan nama klien, petugas, identitas, dan data transaksi diganti atau disamarkan untuk portofolio." },
  { number: "04", tag: "Demo publik", title: "Demo Solusi Bisnis", outcome: "Calon klien dapat melihat gambaran solusi sebelum memulai", visual: "Lihat → Coba → Diskusikan", image: "/illustrations/qira-services.webp", imageAlt: "Ilustrasi demo solusi bisnis QIRA", href: "https://demo.qirasolution.com", cta: "Buka demo", external: true, note: "Demo konsep QIRA, bukan klaim sebagai proyek klien." },
] as const;

function Action({ item }: { item: PortfolioItem }) {
  if (!item.href || !item.cta) return <span />;
  return item.external ? <a className="simplePortfolioAction" href={item.href} target="_blank" rel="noreferrer">{item.cta} →</a> : <Link className="simplePortfolioAction" href={item.href}>{item.cta} →</Link>;
}

export default function PortfolioPage() {
  return (
    <main>
      <ConversionTracker event="portfolio_view" />
      <nav className="companyNav shell" aria-label="Navigasi utama">
        <Link className="brand" href="/">QIRA<span>.</span></Link>
        <div className="companyNavLinks"><Link href="/about">Tentang</Link><Link href="/layanan">Layanan</Link><Link href="/portfolio">Portofolio</Link><Link href="/harga">Harga</Link></div>
        <Link className="smallButton" href="/coba-masalah">Ceritakan masalah</Link>
      </nav>

      <section className={`${styles.hero} shell`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">Produk & karya</p>
          <h1>Lihat solusi yang sudah dibangun.</h1>
          <p>Produk internal QIRA, penerapan nyata yang aman ditampilkan, dan demo publik yang dapat dicoba.</p>
        </div>
        <figure className={styles.heroVisual}>
          <Image src="/illustrations/premium/qira-portfolio-premium.webp" alt="Kumpulan website, dashboard, otomatisasi, dokumen, dan pemetaan kebutuhan QIRA" width={1672} height={941} quality={90} priority sizes="(max-width: 960px) 100vw, 48vw" />
        </figure>
      </section>

      <section className={`${styles.section} shell`}>
        <div className="simplePrinciples" aria-label="Bukti dan komitmen QIRA">
          <span>Produk internal dapat dicoba</span><span>Demo publik tersedia</span><span>Data klien tidak dipublikasikan tanpa izin</span>
        </div>
      </section>

      <section className={`${styles.section} shell`}>
        <div className="portfolioCaseGrid">
          {ITEMS.map((item) => (
            <article className="portfolioCase" key={item.title}>
              <figure><Image src={item.image} alt={item.imageAlt} width={item.image.endsWith(".svg") ? 1600 : 800} height={item.image.endsWith(".svg") ? 900 : 450} quality={90} unoptimized={item.image.endsWith(".svg")} sizes="(max-width: 680px) 100vw, 50vw" /></figure>
              <div className="portfolioCaseBody">
                <div className="portfolioCaseMeta"><span>{item.number}</span><small>{item.tag}</small></div>
                <h2>{item.title}</h2>
                <p>{item.outcome}</p>
                <div className="portfolioCaseFlow">{item.visual.split(" → ").map((step) => <span key={step}>{step}</span>)}</div>
                <Action item={item} />
                {item.note ? <p className="portfolioDisclosure">{item.note}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="companyClosing simpleCompactClosing shell">
        <div><p className="kicker">Untuk usahamu</p><h2>Punya kebutuhan serupa?</h2></div>
        <div className="closingActions"><ContextualWhatsAppCta context="proyek serupa" className="primaryButton light">Mulai konsultasi</ContextualWhatsAppCta></div>
      </section>

      <footer className="companyFooter shell">
        <div><Link className="brand" href="/">QIRA<span>.</span></Link></div>
        <div className="footerLinks"><Link href="/">Beranda</Link><Link href="/about">Tentang</Link><Link href="/layanan">Layanan</Link><Link href="/harga">Harga</Link><Link href="/privasi">Privasi</Link></div>
        <span>QIRA · Solusi digital sederhana untuk bisnis</span>
      </footer>
    </main>
  );
}
