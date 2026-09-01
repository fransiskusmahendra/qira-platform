import type { Metadata } from "next";
import Link from "next/link";

import styles from "../SubpageVisual.module.css";

const PORTFOLIO_DESCRIPTION = "Lihat produk internal, pekerjaan klien, dan solution demo QIRA melalui contoh singkat yang mudah dipahami.";

export const metadata: Metadata = {
  title: "Portfolio",
  description: PORTFOLIO_DESCRIPTION,
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "QIRA Products & Work",
    description: PORTFOLIO_DESCRIPTION,
    url: "/portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QIRA Products & Work",
    description: PORTFOLIO_DESCRIPTION,
  },
};

type PortfolioItem = {
  number: string;
  tag: string;
  title: string;
  summary: string;
  outcome: string;
  visual: string;
  href?: string;
  cta?: string;
  external?: boolean;
  note?: string;
};

const ITEMS: readonly PortfolioItem[] = [
  {
    number: "01",
    tag: "QIRA Product",
    title: "QIRA Business Discovery",
    summary: "Flow untuk memahami masalah, prioritas, anggaran, dan kesiapan sebelum solusi dibangun.",
    outcome: "Scope awal lebih jelas",
    visual: "Masalah → Prioritas → Scope",
    href: "/discovery",
    cta: "Coba discovery",
  },
  {
    number: "02",
    tag: "QIRA Product",
    title: "Invoice & Document Generator",
    summary: "Tool internal untuk membuat dokumen operasional dengan format yang konsisten tanpa menyusun ulang dari awal.",
    outcome: "Administrasi lebih ringkas",
    visual: "Data → Dokumen → Siap pakai",
    note: "Digunakan untuk operasional internal QIRA. Akses tidak dipublikasikan.",
  },
  {
    number: "03",
    tag: "Client Work",
    title: "Transaction & Thermal Receipt Tool",
    summary: "Aplikasi mobile ringan untuk mencatat transaksi dan menyiapkan nota thermal dengan input seminimal mungkin.",
    outcome: "Alur transaksi lebih cepat",
    visual: "Input → Nota → Cetak",
    note: "Identitas klien, data, dan akses aplikasi tidak dipublikasikan.",
  },
  {
    number: "04",
    tag: "Solution Demo",
    title: "Business Solution Demo",
    summary: "Demo publik untuk melihat bentuk workflow, operasional, dan pengalaman digital sebelum membangun solusi sendiri.",
    outcome: "Solusi lebih mudah dibayangkan",
    visual: "Lihat → Coba → Diskusikan",
    href: "https://demo.qirasolution.com",
    cta: "Buka demo",
    external: true,
    note: "Demo konsep QIRA, bukan klaim sebagai project klien.",
  },
] as const;

function CaseAction({ item }: { item: PortfolioItem }) {
  if (!item.href || !item.cta) return null;
  if (item.external) {
    return <a href={item.href} target="_blank" rel="noreferrer">{item.cta} →</a>;
  }
  return <Link href={item.href}>{item.cta} →</Link>;
}

export default function PortfolioPage() {
  return (
    <main>
      <nav className="companyNav shell" aria-label="Navigasi utama">
        <Link className="brand" href="/">QIRA<span>.</span></Link>
        <div className="companyNavLinks">
          <Link href="/about">About Us</Link>
          <Link href="/#services">Services</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/harga">Pricing</Link>
        </div>
        <Link className="smallButton" href="/coba-masalah">Mulai konsultasi</Link>
      </nav>

      <section className={`${styles.hero} shell`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">Products & Work</p>
          <h1>Solusi yang sudah dibangun, digunakan, dan dicoba.</h1>
          <p>
            QIRA menampilkan produk internal, pekerjaan klien, dan demo secara terpisah agar konteksnya jelas tanpa membuka informasi yang bersifat private.
          </p>
          <div className={styles.heroActions}>
            <Link className="primaryButton" href="/contoh-penerapan">Lihat contoh penerapan</Link>
            <Link className="textLink" href="/coba-masalah">Punya kebutuhan serupa? →</Link>
          </div>
        </div>
        <div className={styles.portfolioHeroVisual} aria-label="Ringkasan kategori portfolio QIRA">
          <div className={styles.portfolioMiniCard}><small>QIRA Product</small><strong>Tools yang QIRA gunakan sendiri</strong></div>
          <div className={styles.portfolioMiniCard}><small>Client Work</small><strong>Solusi untuk kebutuhan operasional nyata</strong></div>
          <div className={styles.portfolioMiniCard}><small>Solution Demo</small><strong>Konsep yang bisa dilihat sebelum membangun</strong></div>
        </div>
      </section>

      <section className={`${styles.section} shell`}>
        <div className={styles.sectionHeader}>
          <div>
            <p className="kicker">Selected work</p>
            <h2>Empat contoh, tanpa penjelasan yang bertele-tele.</h2>
          </div>
          <p>Setiap kartu menunjukkan fungsi utama dan hasil yang ingin dicapai. Detail private tetap tidak ditampilkan.</p>
        </div>

        <div className={styles.caseGrid}>
          {ITEMS.map((item) => (
            <article className={styles.caseCard} key={item.title}>
              <div className={styles.caseVisual}>
                <span>{item.number}</span>
                <span>{item.visual}</span>
              </div>
              <span className={styles.caseTag}>{item.tag}</span>
              <h3>{item.title}</h3>
              <p className={styles.caseSummary}>{item.summary}</p>
              <div className={styles.caseOutcome}>
                <span><strong>Hasil:</strong> {item.outcome}</span>
                <CaseAction item={item} />
              </div>
              {item.note ? <p className={styles.note}>{item.note}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} shell`}>
        <div className={styles.principleStrip}>
          <span className={styles.miniLabel}>Prinsip QIRA</span>
          <strong>Lebih baik satu workflow yang benar-benar dipakai daripada banyak fitur yang tidak diperlukan.</strong>
          <Link className="closingTextLink" href="/harga">Lihat harga awal →</Link>
        </div>
      </section>

      <section className="companyClosing shell">
        <div>
          <p className="kicker">Your project</p>
          <h2>Ada pekerjaan yang bisa dibuat lebih cepat atau lebih rapi?</h2>
        </div>
        <div className="closingActions">
          <Link className="primaryButton light" href="/coba-masalah">Ceritakan kebutuhan</Link>
          <Link className="closingTextLink" href="/contoh-penerapan">Lihat contoh solusi →</Link>
        </div>
      </section>

      <footer className="companyFooter shell">
        <div>
          <Link className="brand" href="/">QIRA<span>.</span></Link>
          <p>Simple digital solutions for growing businesses.</p>
        </div>
        <div className="footerLinks">
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/harga">Services & Pricing</Link>
          <Link href="/discovery">Discovery</Link>
          <Link href="/privasi">Privacy</Link>
        </div>
        <span>QIRA · PT Rays Solusi Informasi</span>
      </footer>
    </main>
  );
}
