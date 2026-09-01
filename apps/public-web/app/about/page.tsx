import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import styles from "../SubpageVisual.module.css";

const ABOUT_DESCRIPTION = "Kenali cara QIRA membantu bisnis membuat teknologi lebih sederhana, praktis, dan sesuai kebutuhan nyata.";

export const metadata: Metadata = {
  title: "About Us",
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About QIRA",
    description: ABOUT_DESCRIPTION,
    url: "/about",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "About QIRA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About QIRA",
    description: ABOUT_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

const VALUES = [
  ["01", "Simple first", "Mudah dipahami dan digunakan lebih penting daripada terlihat rumit."],
  ["02", "Business first", "Kami mulai dari pekerjaan yang ingin dibuat lebih cepat, rapi, atau mudah."],
  ["03", "Build what matters", "Fitur dibuat seperlunya agar waktu dan biaya tetap terkendali."],
] as const;

const FOCUS = [
  "Website & digital presence",
  "Web app & internal tools",
  "Automation & integration",
  "Business discovery",
  "Implementation support",
] as const;

export default function AboutPage() {
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
          <p className="eyebrow">About QIRA</p>
          <h1>Teknologi yang terasa lebih sederhana untuk bisnis.</h1>
          <p>
            QIRA adalah brand solusi digital dari PT Rays Solusi Informasi. Kami membantu bisnis dan UMKM merapikan proses, membangun tools, dan memilih teknologi yang benar-benar diperlukan.
          </p>
          <div className={styles.heroActions}>
            <Link className="primaryButton" href="/coba-masalah">Ceritakan kebutuhanmu</Link>
            <Link className="textLink" href="/portfolio">Lihat yang sudah dibangun →</Link>
          </div>
        </div>
        <figure className={styles.heroVisual}>
          <Image
            src="/illustrations/qira-services.webp"
            alt="Website, aplikasi, automation, dan discovery sebagai kemampuan digital QIRA"
            width={1536}
            height={1024}
            priority
            sizes="(max-width: 960px) 100vw, 48vw"
          />
          <figcaption>Satu tujuan: membuat pekerjaan bisnis lebih mudah dijalankan.</figcaption>
        </figure>
      </section>

      <section className={`${styles.section} shell`}>
        <div className={styles.sectionHeader}>
          <div>
            <p className="kicker">Cara kami berpikir</p>
            <h2>Mulai dari kebutuhan. Teknologi menyusul.</h2>
          </div>
          <p>QIRA tidak memulai percakapan dari nama aplikasi atau tren teknologi. Kami mulai dari pekerjaan yang ingin dibuat lebih baik.</p>
        </div>
        <div className={styles.valueGrid}>
          {VALUES.map(([number, title, copy]) => (
            <article className={styles.valueCard} key={title}>
              <span className={styles.valueIndex}>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} shell`}>
        <div className={styles.sectionHeader}>
          <div>
            <p className="kicker">From problem to solution</p>
            <h2>Proses singkat yang menjaga solusi tetap relevan.</h2>
          </div>
          <p>Solusi boleh kecil selama langsung membantu pekerjaan penting dan masih punya ruang untuk berkembang.</p>
        </div>
        <div className={styles.flow} aria-label="Alur pendekatan QIRA">
          <div className={styles.flowCard}><strong>Masalah</strong><span>Apa yang terasa lambat, berulang, atau membingungkan?</span></div>
          <div className={styles.flowArrow}>→</div>
          <div className={styles.flowCard}><strong>Prioritas</strong><span>Pilih kebutuhan yang paling memberi dampak.</span></div>
          <div className={styles.flowArrow}>→</div>
          <div className={styles.flowCard}><strong>Solusi</strong><span>Bangun secukupnya, gunakan, lalu kembangkan bila perlu.</span></div>
        </div>
        <div className={styles.focusPills} aria-label="Fokus layanan QIRA">
          {FOCUS.map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>

      <section className="companyClosing shell">
        <div>
          <p className="kicker">Work with QIRA</p>
          <h2>Punya proses yang ingin dibuat lebih sederhana?</h2>
        </div>
        <div className="closingActions">
          <Link className="primaryButton light" href="/coba-masalah">Mulai dari kebutuhanmu</Link>
          <Link className="closingTextLink" href="/contoh-penerapan">Lihat contoh penerapan →</Link>
        </div>
      </section>

      <footer className="companyFooter shell">
        <div>
          <Link className="brand" href="/">QIRA<span>.</span></Link>
          <p>Simple digital solutions for growing businesses.</p>
        </div>
        <div className="footerLinks">
          <Link href="/">Home</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/harga">Services & Pricing</Link>
          <Link href="/discovery">Discovery</Link>
          <Link href="/privasi">Privacy</Link>
        </div>
        <span>QIRA · PT Rays Solusi Informasi</span>
      </footer>
    </main>
  );
}
