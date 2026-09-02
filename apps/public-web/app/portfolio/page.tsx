import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ConversionTracker } from "../_components/ConversionTracker";
import styles from "../SubpageVisual.module.css";

const PORTFOLIO_DESCRIPTION = "Lihat produk internal, pekerjaan klien, dan solution demo QIRA melalui contoh singkat yang mudah dipahami.";

export const metadata: Metadata = {
  title: "Portfolio",
  description: PORTFOLIO_DESCRIPTION,
  alternates: { canonical: "/portfolio" },
  openGraph: { title: "QIRA Products & Work", description: PORTFOLIO_DESCRIPTION, url: "/portfolio", type: "website" },
  twitter: { card: "summary_large_image", title: "QIRA Products & Work", description: PORTFOLIO_DESCRIPTION },
};

type PortfolioItem = { number: string; tag: string; title: string; outcome: string; visual: string; href?: string; cta?: string; external?: boolean; note?: string };

const ITEMS: readonly PortfolioItem[] = [
  { number: "01", tag: "QIRA Product", title: "Business Discovery", outcome: "Scope lebih jelas", visual: "Masalah → Prioritas → Scope", href: "/discovery", cta: "Coba" },
  { number: "02", tag: "QIRA Product", title: "Document Generator", outcome: "Administrasi lebih ringkas", visual: "Data → Dokumen", note: "Digunakan untuk operasional internal QIRA." },
  { number: "03", tag: "Client Work", title: "Transaction & Receipt Tool", outcome: "Transaksi lebih cepat", visual: "Input → Nota → Cetak", note: "Identitas klien, data, dan akses aplikasi tidak dipublikasikan." },
  { number: "04", tag: "Solution Demo", title: "Business Solution Demo", outcome: "Solusi mudah dibayangkan", visual: "Lihat → Coba → Diskusikan", href: "https://demo.qirasolution.com", cta: "Demo", external: true, note: "Demo konsep QIRA, bukan klaim sebagai project klien." },
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
        <div className="companyNavLinks"><Link href="/about">About</Link><Link href="/portfolio">Portfolio</Link><Link href="/harga">Pricing</Link></div>
        <Link className="smallButton" href="/coba-masalah">Mulai</Link>
      </nav>

      <section className={`${styles.hero} shell`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">Products & Work</p>
          <h1>Lihat yang sudah dibangun.</h1>
          <p>Produk · Client work · Demo.</p>
        </div>
        <figure className={styles.heroVisual}>
          <Image src="/illustrations/qira-portfolio-visual.svg" alt="Produk QIRA, client solution, prototype, dan discovery workflow dalam satu visual" width={500} height={375} priority unoptimized sizes="(max-width: 960px) 100vw, 48vw" />
        </figure>
      </section>

      <section className={`${styles.section} shell`}>
        <div className="simplePortfolioList">
          {ITEMS.map((item) => (
            <article className="simplePortfolioRow" key={item.title}>
              <span>{item.number}</span>
              <div className="simplePortfolioMain"><small>{item.tag}</small><strong>{item.title}</strong><span>{item.outcome}</span></div>
              <span className="simplePortfolioFlow">{item.visual}</span>
              <Action item={item} />
              {item.note ? <details className="simplePortfolioNote"><summary>Konteks</summary><p>{item.note}</p></details> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="companyClosing simpleCompactClosing shell">
        <div><p className="kicker">Your project</p><h2>Punya kebutuhan serupa?</h2></div>
        <div className="closingActions"><Link className="primaryButton light" href="/coba-masalah">Ceritakan</Link></div>
      </section>

      <footer className="companyFooter shell">
        <div><Link className="brand" href="/">QIRA<span>.</span></Link></div>
        <div className="footerLinks"><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/harga">Pricing</Link><Link href="/privasi">Privacy</Link></div>
        <span>QIRA · PT Rays Solusi Informasi</span>
      </footer>
    </main>
  );
}
