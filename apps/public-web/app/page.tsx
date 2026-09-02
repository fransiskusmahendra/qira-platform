import Image from "next/image";
import Link from "next/link";

import { ConversionTracker } from "./_components/ConversionTracker";
import { ApplicationShowcase, BeforeAfter, HeroExplainer, SolutionExplorer } from "./_components/HomeExperience";

const VISUALS = {
  what: "/illustrations/visual/qira-what.webp",
  benefits: "/illustrations/visual/qira-benefits.webp",
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
          <Link href="/about">Tentang</Link>
          <Link href="/portfolio">Portofolio</Link>
          <Link href="/harga">Harga</Link>
        </div>
        <Link className="smallButton" href="/coba-masalah">Mulai</Link>
      </nav>

      <section className="visualHero shell">
        <div className="visualHeroCopy">
          <p className="eyebrow">QIRA · Simple Digital Solutions</p>
          <h1>Bisnis bekerja lebih rapi.<br /><em>Teknologi tetap sederhana.</em></h1>
          <p className="visualHeroLead">QIRA membuat website, alat kerja, dan otomatisasi yang sesuai dengan masalah bisnismu.</p>
          <div className="companyHeroActions">
            <Link className="primaryButton" href="/coba-masalah">Ceritakan masalahmu</Link>
            <Link className="textLink" href="#qira-itu-apa">Lihat cara kerjanya ↓</Link>
          </div>
        </div>
        <div className="visualHeroArt">
          <HeroExplainer />
        </div>
      </section>

      <section className="visualStory shell" id="qira-itu-apa">
        <header className="visualStoryHeading">
          <p className="kicker">QIRA itu apa?</p>
          <h2>Terlihat. Rapi. <em>Berjalan otomatis.</em></h2>
        </header>
        <StoryVisual src={VISUALS.what} alt="QIRA membantu usaha lebih terlihat, pekerjaan lebih rapi, dan tugas berulang menjadi otomatis" />
      </section>

      <section className="visualStory visualSolutionSection shell">
        <header className="visualStoryHeading">
          <p className="kicker">Masalah → solusi → hasil</p>
          <h2>Apa yang paling <em>merepotkan?</em></h2>
        </header>
        <SolutionExplorer />
      </section>

      <section className="visualStory shell">
        <header className="visualStoryHeading">
          <p className="kicker">Yang didapat</p>
          <h2>Bukan fitur yang rumit.<br /><em>Hasil yang terasa.</em></h2>
        </header>
        <StoryVisual src={VISUALS.benefits} alt="Manfaat QIRA: mudah ditemukan, kerja lebih rapi, hemat waktu, dan langkah lebih jelas" />
      </section>

      <section className="visualStory shell">
        <header className="visualStoryHeading">
          <p className="kicker">Sebelum → Sesudah</p>
          <h2>Dari berantakan jadi <em>jelas.</em></h2>
        </header>
        <BeforeAfter />
      </section>

      <section className="visualStory shell">
        <header className="visualStoryHeading">
          <p className="kicker">Contoh penerapan</p>
          <h2>Bentuknya berbeda.<br /><em>Tujuannya tetap sederhana.</em></h2>
        </header>
        <ApplicationShowcase />
      </section>

      <section className="visualProof shell">
        <div>
          <p className="kicker">Produk & karya</p>
          <h2>Lihat yang sudah dibangun.</h2>
        </div>
        <div className="visualProofActions">
          <span>QIRA Product</span><span>Client Work</span><span>Solution Demo</span>
          <Link className="primaryButton" href="/portfolio">Buka portofolio</Link>
        </div>
      </section>

      <section className="visualPricing shell">
        <div>
          <p className="kicker">Harga</p>
          <h2>Mulai dari <em>Rp1,5 juta.</em></h2>
          <p>Mulai kecil. Tambah saat perlu.</p>
        </div>
        <Link className="primaryButton" href="/harga">Lihat 3 pilihan</Link>
      </section>

      <section className="companyClosing shell visualClosing">
        <div><p className="kicker">Mulai sederhana</p><h2>Mulai dari satu masalah.</h2></div>
        <div className="closingActions"><Link className="primaryButton light" href="/coba-masalah">Mulai sekarang</Link></div>
      </section>

      <footer className="companyFooter shell">
        <div><Link className="brand" href="/">QIRA<span>.</span></Link></div>
        <div className="footerLinks"><Link href="/about">Tentang</Link><Link href="/portfolio">Portofolio</Link><Link href="/harga">Harga</Link><Link href="/privasi">Privasi</Link></div>
        <span>QIRA · PT Rays Solusi Informasi</span>
      </footer>
    </main>
  );
}
