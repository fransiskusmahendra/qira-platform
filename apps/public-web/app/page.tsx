import Link from "next/link";

import { ConversionClickTracker, ConversionTracker } from "./_components/ConversionTracker";
import { ContextualWhatsAppCta } from "./_components/ContextualWhatsAppCta";
import { ApplicationShowcase, BeforeAfter, HeroExplainer, SolutionExplorer } from "./_components/HomeExperience";
import { BenefitsArtwork, WhatArtwork } from "./_components/CrispVisuals";

export default function HomePage() {
  return (
    <main className="visualHome">
      <ConversionTracker event="landing_view" />
      <ConversionClickTracker />

      <nav className="companyNav shell" aria-label="Navigasi utama">
        <Link className="brand" href="/">QIRA<span>.</span></Link>
        <div className="companyNavLinks">
          <Link href="/about">Tentang</Link>
          <Link href="/portfolio">Portofolio</Link>
          <Link href="/harga">Harga</Link>
        </div>
        <Link className="smallButton" href="/coba-masalah" data-conversion="homepage_cta_click">Ceritakan masalah</Link>
      </nav>

      <section className="visualHero shell">
        <div className="visualHeroCopy">
          <p className="eyebrow">QIRA · Solusi digital sederhana</p>
          <h1>Bisnis bekerja lebih rapi.<br /><em>Teknologi tetap sederhana.</em></h1>
          <p className="visualHeroLead">QIRA membuat website, form, dashboard, dan otomatisasi agar usaha lebih mudah ditemukan dan dijalankan.</p>
          <div className="companyHeroActions">
            <Link className="primaryButton" href="/coba-masalah" data-conversion="homepage_cta_click">Ceritakan masalah usaha</Link>
            <Link className="textLink" href="#contoh-solusi">Lihat contoh solusi ↓</Link>
          </div>
        </div>
        <div className="visualHeroArt">
          <HeroExplainer />
        </div>
      </section>

      <section className="visualStory shell" id="qira-itu-apa">
        <header className="visualStoryHeading">
          <p className="kicker">QIRA itu apa?</p>
          <h2>Mudah ditemukan. Kerja lebih rapi. <em>Tugas berjalan otomatis.</em></h2>
        </header>
        <figure className="visualStoryCard"><WhatArtwork /></figure>
      </section>

      <section className="visualStory visualSolutionSection shell">
        <header className="visualStoryHeading">
          <p className="kicker">Masalah → solusi → hasil</p>
          <h2>Apa yang paling <em>merepotkan?</em></h2>
        </header>
        <SolutionExplorer />
      </section>

      <section className="visualStory shell" id="contoh-solusi">
        <header className="visualStoryHeading">
          <p className="kicker">Yang didapat</p>
          <h2>Bukan fitur yang rumit.<br /><em>Hasil yang terasa.</em></h2>
        </header>
        <figure className="visualStoryCard"><BenefitsArtwork /></figure>
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
          <h2>Solusi berbeda untuk<br /><em>masalah yang berbeda.</em></h2>
        </header>
        <ApplicationShowcase />
      </section>

      <section className="visualStory shell">
        <header className="visualStoryHeading"><p className="kicker">Untuk usahamu</p><h2>Lihat QIRA dari <em>situasimu.</em></h2></header>
        <div className="audiencePaths">
          <Link href="/untuk/usaha-jasa"><div className="audienceVisual"><span>01</span><strong>Chat</strong><i>→</i><strong>Form</strong><i>→</i><strong>Selesai</strong></div><span>Usaha jasa</span><strong>Chat masuk sampai pekerjaan selesai</strong><small>Lihat alurnya →</small></Link>
          <Link href="/untuk/retail-umkm"><div className="audienceVisual"><span>02</span><strong>Produk</strong><i>→</i><strong>Pesanan</strong><i>→</i><strong>Status</strong></div><span>Retail & UMKM</span><strong>Produk terlihat, pesanan lebih teratur</strong><small>Lihat alurnya →</small></Link>
          <Link href="/untuk/administrasi-tim"><div className="audienceVisual"><span>03</span><strong>Data</strong><i>→</i><strong>Dokumen</strong><i>→</i><strong>Laporan</strong></div><span>Administrasi tim</span><strong>Data, dokumen, dan status lebih rapi</strong><small>Lihat alurnya →</small></Link>
        </div>
      </section>

      <section className="visualProof shell">
        <div>
          <p className="kicker">Produk & karya</p>
          <h2>Lihat yang sudah dibangun.</h2>
        </div>
        <div className="visualProofActions">
          <span>Produk QIRA</span><span>Pekerjaan klien</span><span>Demo solusi</span>
        <Link className="primaryButton" href="/portfolio" data-conversion="homepage_cta_click">Buka portofolio</Link>
        </div>
      </section>

      <section className="visualPricing shell">
        <div>
          <p className="kicker">Harga</p>
          <h2>Mulai dari <em>Rp1,5 juta.</em></h2>
          <p>Mulai kecil. Tambah saat perlu.</p>
        </div>
        <Link className="primaryButton" href="/harga" data-conversion="homepage_cta_click">Lihat 3 pilihan</Link>
      </section>

      <section className="companyClosing shell visualClosing">
        <div><p className="kicker">Mulai sederhana</p><h2>Mulai dari satu masalah.</h2></div>
        <div className="closingActions"><Link className="primaryButton light" href="/coba-masalah" data-conversion="homepage_cta_click">Ceritakan masalah usaha</Link><ContextualWhatsAppCta context="kebutuhan digital bisnis" className="textLink lightText">Konsultasi lewat WhatsApp</ContextualWhatsAppCta></div>
      </section>

      <footer className="companyFooter shell">
        <div><Link className="brand" href="/">QIRA<span>.</span></Link></div>
        <div className="footerLinks"><Link href="/about">Tentang</Link><Link href="/portfolio">Portofolio</Link><Link href="/harga">Harga</Link><Link href="/privasi">Privasi</Link></div>
        <span>QIRA · Solusi digital sederhana untuk bisnis</span>
      </footer>
    </main>
  );
}
