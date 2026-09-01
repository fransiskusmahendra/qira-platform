import Image from "next/image";
import Link from "next/link";

import { ConversionTracker } from "./_components/ConversionTracker";
import { BusinessExamples } from "./_components/BusinessExamples";
import { ProblemSelector } from "./_components/ProblemSelector";

const SERVICES = [
  ["01", "Website"],
  ["02", "Business tools"],
  ["03", "Automation"],
  ["04", "Discovery"],
] as const;

const PROCESS = [
  ["01", "Cerita"],
  ["02", "Prioritas"],
  ["03", "Solusi"],
  ["04", "Gunakan"],
] as const;

export default function HomePage() {
  return (
    <main>
      <ConversionTracker event="landing_view" />

      <nav className="companyNav shell" aria-label="Navigasi utama">
        <Link className="brand" href="/">QIRA<span>.</span></Link>
        <div className="companyNavLinks">
          <Link href="/about">About Us</Link>
          <a href="#services">Services</a>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/harga">Pricing</Link>
        </div>
        <Link className="smallButton" href="/coba-masalah">Mulai</Link>
      </nav>

      <section className="companyHero shell">
        <div className="companyHeroCopy">
          <p className="eyebrow">QIRA · Simple Digital Solutions</p>
          <h1>Bisnis lebih rapi. <em>Teknologi lebih sederhana.</em></h1>
          <p className="companyLead">Website, tools, dan automation yang langsung membantu pekerjaan.</p>
          <div className="companyHeroActions">
            <Link className="primaryButton" href="/coba-masalah">Ceritakan masalahmu</Link>
            <Link className="textLink" href="/contoh-penerapan">Lihat contoh →</Link>
          </div>
        </div>
        <figure className="companyHeroVisual">
          <Image src="/illustrations/qira-hero.webp" alt="Pekerjaan bisnis yang terhubung dalam satu alur digital" width={1536} height={1024} priority sizes="(max-width: 960px) 100vw, 56vw" />
        </figure>
      </section>

      <section className="companyProblems shell">
        <div className="companySectionHeading compact">
          <div><p className="kicker">Mulai di sini</p><h2>Apa yang bikin repot?</h2></div>
        </div>
        <ProblemSelector />
      </section>

      <section className="companyIntro shell">
        <p className="kicker">QIRA</p>
        <div>
          <h2>Mulai dari masalah bisnis, bukan istilah teknologi.</h2>
          <Link className="textLink" href="/about">Tentang QIRA →</Link>
        </div>
      </section>

      <section className="companyServices shell" id="services">
        <div className="companySectionHeading compact">
          <div><p className="kicker">Services</p><h2>Pilih yang dibutuhkan.</h2></div>
        </div>
        <figure className="companySectionVisual serviceVisual">
          <Image src="/illustrations/qira-services.webp" alt="Website, aplikasi bisnis, automation, dan discovery QIRA" width={1536} height={1024} sizes="(max-width: 680px) 100vw, 1160px" />
        </figure>
        <div className="companyServiceGrid">
          {SERVICES.map(([number, title]) => <article className="companyServiceCard" key={title}><span>{number}</span><h3>{title}</h3></article>)}
        </div>
      </section>

      <section className="companyBeforeAfter shell">
        <div className="companySectionHeading compact">
          <div><p className="kicker">Before → After</p><h2>Dari repot menjadi lebih rapi.</h2></div>
        </div>
        <figure className="companySectionVisual processVisual">
          <Image src="/illustrations/qira-examples-visual.svg" alt="Empat contoh masalah bisnis yang berubah menjadi workflow digital yang lebih rapi" width={500} height={281} unoptimized sizes="(max-width: 680px) 100vw, 1160px" />
        </figure>
      </section>

      <section className="companyWork shell" id="work">
        <div className="companySectionHeading compact">
          <div><p className="kicker">How it works</p><h2>Empat langkah.</h2></div>
        </div>
        <figure className="companySectionVisual processVisual">
          <Image src="/illustrations/qira-process.webp" alt="Alur kerja QIRA dari kebutuhan hingga solusi digunakan" width={1984} height={793} sizes="(max-width: 680px) 130vw, 1160px" />
        </figure>
        <div className="companyProcessGrid">
          {PROCESS.map(([number, title]) => <article key={number}><span>{number}</span><h3>{title}</h3></article>)}
        </div>
      </section>

      <section className="companyShowcase shell">
        <div className="companySectionHeading compact">
          <div><p className="kicker">Sesuai usaha</p><h2>Lihat yang bisa dirapikan.</h2></div>
        </div>
        <BusinessExamples />
      </section>

      <section className="companyOutcomes shell" aria-label="Hasil fungsional solusi QIRA">
        <span><strong>1</strong> tempat</span>
        <span><strong>↓</strong> input ulang</span>
        <span><strong>24/7</strong> akses</span>
        <span><strong>✓</strong> sesuai kebutuhan</span>
      </section>

      <section className="companyPortfolio shell" id="portfolio">
        <div className="companySectionHeading compact">
          <div><p className="kicker">Products & Work</p><h2>Yang sudah dibangun.</h2></div>
        </div>
        <figure className="companySectionVisual serviceVisual">
          <Image src="/illustrations/qira-portfolio-visual.svg" alt="Produk internal, pekerjaan klien, demo, dan workflow discovery QIRA" width={500} height={375} unoptimized sizes="(max-width: 680px) 100vw, 1160px" />
        </figure>
        <div className="portfolioMore"><Link className="textLink" href="/portfolio">Lihat portfolio →</Link></div>
      </section>

      <section className="companyClosing shell">
        <div><p className="kicker">Start simple</p><h2>Punya pekerjaan yang ingin dibuat lebih mudah?</h2></div>
        <div className="closingActions">
          <Link className="primaryButton light" href="/coba-masalah">Ceritakan masalahmu</Link>
          <Link className="closingTextLink" href="/harga">Lihat harga →</Link>
        </div>
      </section>

      <footer className="companyFooter shell">
        <div><Link className="brand" href="/">QIRA<span>.</span></Link><p>Simple digital solutions.</p></div>
        <div className="footerLinks"><Link href="/about">About</Link><Link href="/portfolio">Portfolio</Link><Link href="/harga">Pricing</Link><Link href="/privasi">Privacy</Link></div>
        <span>QIRA · PT Rays Solusi Informasi</span>
      </footer>
    </main>
  );
}
