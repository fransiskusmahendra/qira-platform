import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ConversionTracker } from "../_components/ConversionTracker";
import { ContextualWhatsAppCta } from "../_components/ContextualWhatsAppCta";
import styles from "../SubpageVisual.module.css";

const PORTFOLIO_DESCRIPTION = "Lihat produk internal, pekerjaan klien, dan demo solusi QIRA melalui contoh singkat yang mudah dipahami.";

export const metadata: Metadata = {
  title: "Portofolio",
  description: PORTFOLIO_DESCRIPTION,
  alternates: { canonical: "/portfolio" },
  openGraph: { title: "Portofolio QIRA", description: PORTFOLIO_DESCRIPTION, url: "/portfolio", type: "website" },
  twitter: { card: "summary_large_image", title: "Portofolio QIRA", description: PORTFOLIO_DESCRIPTION },
};

type PortfolioItem = { number: string; tag: string; title: string; outcome: string; visual: string; image: string; href?: string; cta?: string; external?: boolean; note?: string };

const ITEMS: readonly PortfolioItem[] = [
  { number: "01", tag: "Produk QIRA", title: "Pemetaan Kebutuhan", outcome: "Kebutuhan menjadi ruang lingkup yang jelas", visual: "Masalah → Prioritas → Ruang lingkup", image: "/illustrations/premium/qira-problem-premium.webp", href: "/discovery", cta: "Coba alurnya" },
  { number: "02", tag: "Produk QIRA", title: "Pembuat Dokumen", outcome: "Data menjadi dokumen siap digunakan", visual: "Data → Dokumen → Unduh", image: "/illustrations/premium/qira-examples-premium.webp", note: "Digunakan untuk operasional internal QIRA." },
  { number: "03", tag: "Pekerjaan klien", title: "Alat Transaksi & Nota", outcome: "Input transaksi sampai nota dalam satu alur", visual: "Input → Nota → Cetak", image: "/illustrations/qira-process.webp", note: "Identitas klien, data, dan akses aplikasi tidak dipublikasikan." },
  { number: "04", tag: "Demo solusi", title: "Demo Solusi Bisnis", outcome: "Calon klien dapat melihat gambaran solusi sebelum memulai", visual: "Lihat → Coba → Diskusikan", image: "/illustrations/qira-services.webp", href: "https://demo.qirasolution.com", cta: "Buka demo", external: true, note: "Demo konsep QIRA, bukan klaim sebagai proyek klien." },
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
        <div className="companyNavLinks"><Link href="/about">Tentang</Link><Link href="/portfolio">Portofolio</Link><Link href="/harga">Harga</Link></div>
        <Link className="smallButton" href="/coba-masalah">Ceritakan masalah</Link>
      </nav>

      <section className={`${styles.hero} shell`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">Produk & karya</p>
          <h1>Lihat solusi yang sudah dibangun.</h1>
          <p>Produk internal QIRA, pekerjaan klien, dan demo yang dapat dicoba.</p>
        </div>
        <figure className={styles.heroVisual}>
          <Image src="/illustrations/premium/qira-portfolio-premium.webp" alt="Kumpulan website, dashboard, otomatisasi, dokumen, dan pemetaan kebutuhan QIRA" width={1672} height={941} quality={90} priority sizes="(max-width: 960px) 100vw, 48vw" />
        </figure>
      </section>

      <section className={`${styles.section} shell`}>
        <div className="portfolioCaseGrid">
          {ITEMS.map((item) => (
            <article className="portfolioCase" key={item.title}>
              <figure><Image src={item.image} alt="" width={1672} height={941} quality={90} sizes="(max-width: 680px) 100vw, 50vw" /></figure>
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
        <div className="closingActions"><ContextualWhatsAppCta context="proyek serupa" className="primaryButton light">Konsultasi lewat WhatsApp</ContextualWhatsAppCta></div>
      </section>

      <footer className="companyFooter shell">
        <div><Link className="brand" href="/">QIRA<span>.</span></Link></div>
        <div className="footerLinks"><Link href="/">Beranda</Link><Link href="/about">Tentang</Link><Link href="/harga">Harga</Link><Link href="/privasi">Privasi</Link></div>
        <span>QIRA · Solusi digital sederhana untuk bisnis</span>
      </footer>
    </main>
  );
}
