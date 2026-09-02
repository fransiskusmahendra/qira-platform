import Image from "next/image";
import Link from "next/link";

import { ConversionTracker } from "./_components/ConversionTracker";

const VISUALS = {
  hero: "/illustrations/visual/qira-hero.webp",
  what: "/illustrations/visual/qira-what.webp",
  problems: "/illustrations/visual/qira-problems.webp",
  offerings: "/illustrations/visual/qira-offerings.webp",
  benefits: "/illustrations/visual/qira-benefits.webp",
  beforeAfter: "/illustrations/visual/qira-beforeafter.webp",
} as const;

function StoryVisual({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  return (
    <figure className="visualStoryCard">
      <Image src={src} alt={alt} width={640} height={360} priority={eager} sizes="(max-width: 760px) 100vw, 1160px" />
    </figure>
  );
}

export default function HomePage() {
  return (
    <main className="visualHome">
      <ConversionTracker event="landing_view" />

      <nav className="companyNav shell" aria-label="Navigasi utama">
        <Link className="brand" href="/">QIRA<span>.</span></Link>
        <div className="companyNavLinks">
          <Link href="/about">About</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/harga">Pricing</Link>
        </div>
        <Link className="smallButton" href="/coba-masalah">Mulai</Link>
      </nav>

      <section className="visualHero shell">
        <div className="visualHeroCopy">
          <p className="eyebrow">QIRA · Simple Digital Solutions</p>
          <h1>Bisnis lebih rapi.<br /><em>Teknologi lebih sederhana.</em></h1>
          <p className="visualHeroLead">Website · tools · automation · discovery.</p>
          <div className="companyHeroActions">
            <Link className="primaryButton" href="/coba-masalah">Ceritakan masalahmu</Link>
            <Link className="textLink" href="#qira-itu-apa">Lihat cara kerjanya ↓</Link>
          </div>
        </div>
        <div className="visualHeroArt">
          <StoryVisual src={VISUALS.hero} alt="Masalah bisnis yang berantakan dirapikan QIRA menjadi website, dashboard, workflow otomatis, dan laporan" eager />
        </div>
      </section>

      <section className="visualStory shell" id="qira-itu-apa">
        <header className="visualStoryHeading">
          <p className="kicker">QIRA itu apa?</p>
          <h2>Biar usaha <em>terlihat, rapi, otomatis.</em></h2>
        </header>
        <StoryVisual src={VISUALS.what} alt="QIRA membantu usaha lebih terlihat, pekerjaan lebih rapi, dan tugas berulang menjadi otomatis" />
      </section>

      <section className="visualStory shell">
        <header className="visualStoryHeading">
          <p className="kicker">Mulai dari masalah</p>
          <h2>Pilih yang paling <em>terasa.</em></h2>
        </header>
        <StoryVisual src={VISUALS.problems} alt="Empat masalah bisnis: sulit ditemukan, pekerjaan tercecer, tugas berulang, dan bingung mulai" />
        <Link className="visualInlineAction" href="/coba-masalah">Pilih masalahmu →</Link>
      </section>

      <section className="visualStory shell">
        <header className="visualStoryHeading">
          <p className="kicker">Yang QIRA buat</p>
          <h2>Solusi seperlunya.<br /><em>Bukan sistem yang ribet.</em></h2>
        </header>
        <StoryVisual src={VISUALS.offerings} alt="Empat layanan QIRA: website, business tools, automation, dan discovery" />
      </section>

      <section className="visualStory shell">
        <header className="visualStoryHeading">
          <p className="kicker">Yang kamu dapat</p>
          <h2>Hasil yang langsung <em>terasa.</em></h2>
        </header>
        <StoryVisual src={VISUALS.benefits} alt="Manfaat QIRA: mudah ditemukan, kerja lebih rapi, hemat waktu, dan langkah lebih jelas" />
      </section>

      <section className="visualStory shell">
        <header className="visualStoryHeading">
          <p className="kicker">Sebelum → Sesudah</p>
          <h2>Dari berantakan jadi <em>jelas.</em></h2>
        </header>
        <StoryVisual src={VISUALS.beforeAfter} alt="Perbandingan kondisi bisnis sebelum dan sesudah menggunakan solusi QIRA" />
        <Link className="visualInlineAction" href="/contoh-penerapan">Lihat contoh penerapan →</Link>
      </section>

      <section className="visualProof shell">
        <div>
          <p className="kicker">Products & Work</p>
          <h2>Lihat yang sudah dibangun.</h2>
        </div>
        <div className="visualProofActions">
          <span>QIRA Product</span><span>Client Work</span><span>Solution Demo</span>
          <Link className="primaryButton" href="/portfolio">Buka portfolio</Link>
        </div>
      </section>

      <section className="visualPricing shell">
        <div>
          <p className="kicker">Pricing</p>
          <h2>Mulai dari <em>Rp1,5 juta.</em></h2>
          <p>Mulai kecil. Tambah saat perlu.</p>
        </div>
        <Link className="primaryButton" href="/harga">Lihat 3 pilihan</Link>
      </section>

      <section className="companyClosing shell visualClosing">
        <div><p className="kicker">Start simple</p><h2>Mulai dari satu masalah.</h2></div>
        <div className="closingActions"><Link className="primaryButton light" href="/coba-masalah">Mulai sekarang</Link></div>
      </section>

      <footer className="companyFooter shell">
        <div><Link className="brand" href="/">QIRA<span>.</span></Link></div>
        <div className="footerLinks"><Link href="/about">About</Link><Link href="/portfolio">Portfolio</Link><Link href="/harga">Pricing</Link><Link href="/privasi">Privacy</Link></div>
        <span>QIRA · PT Rays Solusi Informasi</span>
      </footer>
    </main>
  );
}
