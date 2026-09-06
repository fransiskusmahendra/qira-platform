import Image from "next/image";
import Link from "next/link";
import { ConversionClickTracker, ConversionTracker } from "./_components/ConversionTracker";
import { ApplicationShowcase, BeforeAfter, HeroExplainer, SolutionExplorer } from "./_components/HomeExperience";
import { BenefitsArtwork, WhatArtwork } from "./_components/CrispVisuals";
import { Navbar } from "./_components/Navbar";
import { Footer } from "./_components/Footer";
import { ClosingCtaSection } from "./_components/ClosingCtaSection";
import { FaqSection } from "./_components/FaqSection";
import { ContextualWhatsAppCta } from "./_components/ContextualWhatsAppCta";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="visualHome">
        <ConversionTracker event="landing_view" />
        <ConversionClickTracker />

        {/* Hero Section */}
        <section className="visualHero shell">
          <div className="visualHeroCopy">
            <p className="eyebrow">QIRA · Partner Solusi Digital Bisnis & UMKM</p>
            <h1 style={{ fontSize: "clamp(46px, 6.5vw, 82px)" }}>
              Bisnis bekerja lebih rapi.<br />
              <em>Teknologi tetap sederhana.</em>
            </h1>
            <p className="visualHeroLead">
              Kami bantu buatkan website profesional, form pemesanan digital, dashboard rekap, dan otomatisasi kerja khusus untuk bisnis Anda — siap pakai tanpa repot belajar sistem rumit.
            </p>
            <div className="companyHeroActions">
              <Link className="primaryButton" href="/coba-masalah" data-conversion="homepage_cta_click">
                Ceritakan masalah usaha
              </Link>
              <ContextualWhatsAppCta
                context="solusi digital bisnis dari beranda"
                className="secondaryHeroButton"
              >
                Konsultasi WhatsApp →
              </ContextualWhatsAppCta>
              <Link className="textLink" href="#contoh-solusi">
                Lihat contoh solusi ↓
              </Link>
            </div>
          </div>
          <div className="visualHeroArt">
            <HeroExplainer />
          </div>
        </section>

        {/* Story Section */}
        <section className="visualStory shell" id="qira-itu-apa">
          <header className="visualStoryHeading">
            <p className="kicker">QIRA itu apa?</p>
            <h2>Mudah ditemukan. Kerja lebih rapi. <em>Tugas berjalan otomatis.</em></h2>
          </header>
          <figure className="visualStoryCard">
            <WhatArtwork />
          </figure>
        </section>

        {/* Solution Explorer */}
        <section className="visualStory visualSolutionSection shell">
          <header className="visualStoryHeading">
            <p className="kicker">Masalah → solusi → hasil</p>
            <h2>Apa yang paling <em>merepotkan?</em></h2>
          </header>
          <SolutionExplorer />
        </section>

        {/* What You Get */}
        <section className="visualStory shell" id="contoh-solusi">
          <header className="visualStoryHeading">
            <p className="kicker">Yang didapat</p>
            <h2>Bukan fitur yang rumit.<br /><em>Hasil yang terasa.</em></h2>
          </header>
          <figure className="visualStoryCard">
            <BenefitsArtwork />
          </figure>
        </section>

        {/* Before / After */}
        <section className="visualStory shell">
          <header className="visualStoryHeading">
            <p className="kicker">Sebelum → Sesudah</p>
            <h2>Dari berantakan jadi <em>jelas.</em></h2>
          </header>
          <BeforeAfter />
        </section>

        {/* Application Showcase */}
        <section className="visualStory shell">
          <header className="visualStoryHeading">
            <p className="kicker">Contoh penerapan</p>
            <h2>Solusi berbeda untuk<br /><em>masalah yang berbeda.</em></h2>
          </header>
          <ApplicationShowcase />
        </section>

        {/* Audience Paths */}
        <section className="visualStory shell">
          <header className="visualStoryHeading">
            <p className="kicker">Untuk usahamu</p>
            <h2>Lihat QIRA dari <em>situasimu.</em></h2>
          </header>
          <div className="audiencePaths">
            <Link href="/untuk/usaha-jasa">
              <Image
                src="/illustrations/premium/qira-service-business.webp"
                alt="Alur digital usaha jasa dari pesan pelanggan hingga pekerjaan selesai"
                width={1672}
                height={941}
                quality={90}
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <span>Usaha jasa</span>
              <strong>Chat masuk sampai pekerjaan selesai</strong>
              <small>Lihat alurnya →</small>
            </Link>
            <Link href="/untuk/retail-umkm">
              <Image
                src="/illustrations/premium/qira-retail-business.webp"
                alt="Alur digital retail dari produk menuju pesanan dan pencatatan"
                width={1672}
                height={941}
                quality={90}
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <span>Retail & UMKM</span>
              <strong>Produk terlihat, pesanan lebih teratur</strong>
              <small>Lihat alurnya →</small>
            </Link>
            <Link href="/untuk/administrasi-tim">
              <Image
                src="/illustrations/premium/qira-admin-business.webp"
                alt="Alur administrasi digital dari data menuju dokumen dan laporan"
                width={1672}
                height={941}
                quality={90}
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <span>Administrasi tim</span>
              <strong>Data, dokumen, dan status lebih rapi</strong>
              <small>Lihat alurnya →</small>
            </Link>
          </div>
        </section>

        {/* Proof Section */}
        <section className="visualStory shell">
          <header className="visualStoryHeading">
            <p className="kicker">Bukti nyata</p>
            <h2>Lihat aplikasi yang <em>sudah dibangun.</em></h2>
          </header>
          <div className="audiencePaths">
            <Link href="/discovery">
              <Image
                src="/screenshots/qira-discovery.svg"
                alt="Tampilan QIRA Discovery dengan form kebutuhan usaha"
                width={1600}
                height={900}
                unoptimized
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <span>Demo Interaktif</span>
              <strong>Kebutuhan menjadi arah solusi yang jelas</strong>
              <small style={{ color: "var(--blue)", fontWeight: 700 }}>Coba Demo Interaktif (±2 Menit) →</small>
            </Link>
            <Link href="/portfolio">
              <Image
                src="/screenshots/qira-invoice-maker.svg"
                alt="Tampilan QIRA Invoice Maker dan pratinjau invoice"
                width={1600}
                height={900}
                unoptimized
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <span>Invoice Maker</span>
              <strong>Input data sampai invoice siap digunakan</strong>
              <small>Data contoh · Lihat portofolio →</small>
            </Link>
            <Link href="/portfolio">
              <Image
                src="/screenshots/travel-transaction-demo.svg"
                alt="Tampilan aplikasi transaksi dan pratinjau nota thermal"
                width={1600}
                height={900}
                unoptimized
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <span>Transaksi & nota</span>
              <strong>Input transaksi sampai nota thermal</strong>
              <small>Identitas disamarkan · Lihat portofolio →</small>
            </Link>
          </div>
          <p style={{ marginTop: 18, color: "var(--muted)", fontSize: 13 }}>
            Semua tampilan menggunakan data contoh atau data yang telah dianonimkan. Identitas klien dan informasi sensitif tidak dipublikasikan tanpa izin.
          </p>
        </section>

        {/* Process Section */}
        <section className="visualStory shell">
          <header className="visualStoryHeading">
            <p className="kicker">Cara kami bekerja</p>
            <h2>Kepercayaan dibangun dari <em>proses yang jelas.</em></h2>
          </header>
          <div className="trustGrid">
            <article>
              <span>01</span>
              <h3>Ruang lingkup dulu</h3>
              <p>Kebutuhan, prioritas, dan batas pekerjaan dijelaskan sebelum pembangunan dimulai.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Mulai sederhana</h3>
              <p>Versi awal fokus pada pekerjaan yang paling penting, lalu berkembang jika memang diperlukan.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Data tetap dijaga</h3>
              <p>Identitas dan informasi sensitif tidak digunakan sebagai materi publik tanpa izin.</p>
            </article>
            <article>
              <span>04</span>
              <h3>Review sebelum jalan</h3>
              <p>Solusi diperiksa bersama sebelum menjadi bagian dari pekerjaan sehari-hari.</p>
            </article>
          </div>
        </section>

        {/* Guarantees Section */}
        <section className="visualStory shell" id="jaminan-layanan">
          <header className="visualStoryHeading">
            <p className="kicker">Jaminan Layanan</p>
            <h2>3 Komitmen pasti untuk <em>ketenangan usaha Anda.</em></h2>
          </header>
          <div className="guaranteeGrid">
            <article className="guaranteeCard">
              <div className="guaranteeIconWrapper">
                <span className="guaranteeBadge">01</span>
                <span className="guaranteeIcon" aria-hidden="true">🛡️</span>
              </div>
              <h3>100% Hak Milik Kode & Data</h3>
              <p>
                Aplikasi, database, dan domain sepenuhnya menjadi aset milik usaha Anda. Tanpa <em>vendor lock-in</em> ataupun biaya lisensi tersembunyi.
              </p>
              <ul className="guaranteePoints">
                <li>Source code diserahkan penuh</li>
                <li>Data pelanggan milik Anda pribadi</li>
              </ul>
            </article>

            <article className="guaranteeCard">
              <div className="guaranteeIconWrapper">
                <span className="guaranteeBadge">02</span>
                <span className="guaranteeIcon" aria-hidden="true">⏱️</span>
              </div>
              <h3>Jadwal Pasti 1–3 Minggu</h3>
              <p>
                Ruang lingkup dan tanggal serah terima disepakati transparan di awal. Anda tahu persis kapan sistem selesai diuji dan siap dipakai tim operasional.
              </p>
              <ul className="guaranteePoints">
                <li>Timeline transparan per tahap</li>
                <li>Langsung siap digunakan tanpa molor</li>
              </ul>
            </article>

            <article className="guaranteeCard">
              <div className="guaranteeIconWrapper">
                <span className="guaranteeBadge">03</span>
                <span className="guaranteeIcon" aria-hidden="true">🤝</span>
              </div>
              <h3>Garansi Revisi & Pendampingan</h3>
              <p>
                Setelah sistem jalan, kami tidak meninggalkan Anda. Termasuk garansi revisi perbaikan dan panduan operasional sampai tim Anda benar-benar mahir.
              </p>
              <ul className="guaranteePoints">
                <li>Garansi perbaikan pasca-peluncuran</li>
                <li>Sesi pelatihan hingga tim mandiri</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Learn Section */}
        <section className="visualStory shell">
          <header className="visualStoryHeading">
            <p className="kicker">Pelajari dulu</p>
            <h2>Nilai QIRA sebelum <em>memulai.</em></h2>
          </header>
          <div className="learningGrid">
            <Link href="/studi-kasus">
              <span>Studi kasus</span>
              <strong>Masalah → solusi → hasil yang dapat diperiksa</strong>
              <small>Lihat contoh nyata →</small>
            </Link>
            <Link href="/cara-kerja">
              <span>Cara kerja</span>
              <strong>Dari kebutuhan sampai implementasi</strong>
              <small>Lihat proses QIRA →</small>
            </Link>
            <Link href="/panduan">
              <span>Panduan bisnis</span>
              <strong>Pelajari website, otomatisasi, administrasi, dan aplikasi custom</strong>
              <small>Baca panduan →</small>
            </Link>
          </div>
        </section>

        {/* Pricing Teaser */}
        <section className="visualPricing shell">
          <div>
            <p className="kicker">Harga</p>
            <h2>Mulai dari <em>Rp1,5 juta.</em></h2>
            <p>Mulai kecil. Tambah saat perlu.</p>
          </div>
          <Link className="primaryButton" href="/harga" data-conversion="homepage_cta_click">
            Lihat 3 pilihan
          </Link>
        </section>

        {/* Interactive FAQ Section */}
        <FaqSection />

        {/* Closing CTA */}
        <ClosingCtaSection />
      </main>
      <Footer />
    </>
  );
}
