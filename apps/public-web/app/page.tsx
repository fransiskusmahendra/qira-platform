import Image from "next/image";
import Link from "next/link";

import { ConversionTracker } from "./_components/ConversionTracker";

const PUBLIC_DEMO_URL = "https://demo.qirasolution.com";

const SERVICES = [
  {
    number: "01",
    title: "Website & digital presence",
    copy: "Website company profile, landing page, katalog sederhana, dan halaman penjualan yang mudah dipahami pelanggan.",
    href: "/harga",
    label: "Lihat layanan",
  },
  {
    number: "02",
    title: "Web app & business tools",
    copy: "Aplikasi ringan untuk membantu pekerjaan operasional seperti pencatatan, invoice, dashboard, formulir, dan workflow internal.",
    href: "/contoh-penerapan",
    label: "Lihat contoh",
  },
  {
    number: "03",
    title: "Automation & integration",
    copy: "Mengurangi pekerjaan manual dengan alur otomatis, integrasi data, API, notifikasi, dan proses yang lebih rapi.",
    href: "/coba-masalah",
    label: "Ceritakan kebutuhan",
  },
  {
    number: "04",
    title: "Discovery & digital solution",
    copy: "Belum tahu harus membuat apa? QIRA membantu memetakan masalah, prioritas, dan solusi digital yang paling masuk akal untuk bisnis Anda.",
    href: "/discovery",
    label: "Mulai discovery",
  },
] as const;

const PROCESS = [
  ["01", "Cerita kebutuhan", "Mulai dari masalah atau target bisnis, bukan dari istilah teknologi."],
  ["02", "Pemetaan sederhana", "Kami bantu menentukan apa yang perlu dirapikan dan mana yang paling penting."],
  ["03", "Solusi & ruang lingkup", "Anda mendapat gambaran solusi, hasil yang diharapkan, waktu, dan biaya awal."],
  ["04", "Build & implement", "Solusi dibuat bertahap, diuji, lalu disiapkan agar mudah digunakan."],
] as const;

const SELECTED_WORK = [
  {
    tag: "QIRA Product",
    title: "QIRA Business Discovery",
    copy: "Flow discovery yang digunakan QIRA sendiri untuk memahami masalah, prioritas, anggaran, dan kesiapan implementasi sebelum menyusun solusi.",
    meta: "Internal use · Discovery · Scoping",
    href: "/discovery",
    external: false,
    action: "Coba discovery →",
  },
  {
    tag: "Client Work",
    title: "Transaction & Thermal Receipt Tool",
    copy: "Aplikasi operasional ringan untuk membantu petugas melakukan transaksi dan menyiapkan nota thermal melalui alur mobile yang sederhana.",
    meta: "Client solution · Mobile workflow",
    href: "/portfolio#client-work",
    external: false,
    action: "Lihat studi kasus →",
  },
  {
    tag: "Solution Demo",
    title: "Business Solution Demo",
    copy: "Demo konsep untuk membantu bisnis melihat contoh workflow, operasional, dokumen, dan pendekatan solusi QIRA sebelum membangun.",
    meta: "Public demo · Sales enablement",
    href: PUBLIC_DEMO_URL,
    external: true,
    action: "Buka demo →",
  },
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
        <Link className="smallButton" href="/coba-masalah">Mulai konsultasi</Link>
      </nav>

      <section className="companyHero shell">
        <div className="companyHeroCopy">
          <p className="eyebrow">QIRA · Simple Digital Solutions</p>
          <h1>Solusi digital yang membuat bisnis <em>lebih sederhana.</em></h1>
          <p className="companyLead">
            QIRA membantu bisnis dan UMKM membangun website, aplikasi sederhana, automation, serta workflow digital tanpa proses yang terasa rumit.
          </p>
          <div className="companyHeroActions">
            <Link className="primaryButton" href="/coba-masalah">Ceritakan kebutuhanmu</Link>
            <Link className="textLink" href="/about">Kenal QIRA lebih dekat →</Link>
          </div>
        </div>
        <figure className="companyHeroVisual">
          <Image
            src="/illustrations/qira-hero.webp"
            alt="Pemilik usaha mengelola website, pesanan, dashboard, dan notifikasi dalam satu alur digital"
            width={1536}
            height={1024}
            priority
            sizes="(max-width: 960px) 100vw, 56vw"
          />
          <figcaption><strong>Pekerjaan lebih ringkas.</strong> Informasi, transaksi, dan tindak lanjut terhubung dalam satu alur.</figcaption>
        </figure>
      </section>

      <section className="companyIntro shell">
        <p className="kicker">Tentang QIRA</p>
        <div>
          <h2>Partner digital untuk bisnis yang ingin bergerak lebih cepat tanpa menambah kerumitan.</h2>
          <p>
            QIRA adalah brand solusi digital dari PT Rays Solusi Informasi. Fokus kami adalah membuat teknologi terasa praktis: mudah dipahami, mudah dipakai, dan relevan dengan kebutuhan bisnis sehari-hari.
          </p>
          <Link className="textLink" href="/about">Baca About Us →</Link>
        </div>
      </section>

      <section className="companyServices shell" id="services">
        <div className="companySectionHeading">
          <div>
            <p className="kicker">Services</p>
            <h2>Mulai dari kebutuhan kecil, lalu berkembang saat memang diperlukan.</h2>
          </div>
          <p>QIRA tidak memaksa bisnis menggunakan sistem yang terlalu besar. Kami memilih solusi sesuai masalah, kapasitas, dan tahap bisnis Anda.</p>
        </div>

        <figure className="companySectionVisual serviceVisual">
          <Image
            src="/illustrations/qira-services.webp"
            alt="Empat layanan QIRA yang saling terhubung: website, aplikasi bisnis, automation, dan discovery"
            width={1536}
            height={1024}
            sizes="(max-width: 680px) 100vw, 1160px"
          />
          <figcaption>Empat kemampuan, dipilih sesuai kebutuhan bisnis Anda—tidak harus semuanya sekaligus.</figcaption>
        </figure>

        <div className="companyServiceGrid">
          {SERVICES.map((service) => (
            <article className="companyServiceCard" key={service.title}>
              <span>{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
              <Link href={service.href}>{service.label} →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="companyWork shell" id="work">
        <div className="companySectionHeading compact">
          <div>
            <p className="kicker">How it works</p>
            <h2>Proses yang jelas dari masalah sampai solusi.</h2>
          </div>
        </div>
        <figure className="companySectionVisual processVisual">
          <Image
            src="/illustrations/qira-process.webp"
            alt="Alur kerja QIRA dari percakapan kebutuhan, penentuan prioritas, penyusunan solusi, hingga peluncuran"
            width={1984}
            height={793}
            sizes="(max-width: 680px) 130vw, 1160px"
          />
          <figcaption>Cerita kebutuhan → pilih prioritas → sepakati solusi → gunakan hasilnya.</figcaption>
        </figure>
        <div className="companyProcessGrid">
          {PROCESS.map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="companyShowcase shell">
        <div className="companySectionHeading">
          <div>
            <p className="kicker">Explore QIRA</p>
            <h2>Lihat cara QIRA bekerja sebelum memutuskan.</h2>
          </div>
          <p>Kami siapkan jalur sederhana untuk mencoba pendekatan QIRA, melihat contoh, atau langsung memetakan kebutuhan bisnis.</p>
        </div>

        <div className="showcaseGrid">
          <Link className="showcaseCard" href="/contoh-penerapan">
            <span>Examples</span>
            <h3>Contoh penerapan solusi</h3>
            <p>Lihat gambaran jenis masalah bisnis yang dapat dibantu dengan solusi digital sederhana.</p>
            <strong>Lihat contoh →</strong>
          </Link>
          <a
            className="showcaseCard"
            href={PUBLIC_DEMO_URL}
            target="_blank"
            rel="noreferrer"
          >
            <span>Live Demo</span>
            <h3>Demo solusi UMKM</h3>
            <p>Jelajahi contoh pengalaman digital yang disiapkan QIRA untuk bisnis dan UMKM.</p>
            <strong>Buka demo →</strong>
          </a>
          <Link className="showcaseCard emphasis" href="/discovery">
            <span>Discovery</span>
            <h3>Petakan kebutuhan bisnis</h3>
            <p>Jawab beberapa pertanyaan sederhana untuk membantu QIRA memahami kebutuhan dan peluang solusi.</p>
            <strong>Mulai discovery →</strong>
          </Link>
        </div>
      </section>

      <section className="companyPortfolio shell" id="portfolio">
        <div className="companySectionHeading">
          <div>
            <p className="kicker">Products & Work</p>
            <h2>Apa yang QIRA gunakan sendiri, bangun untuk klien, dan demonstrasikan.</h2>
          </div>
          <p>Portfolio dibagi secara transparan menjadi QIRA Products, Client Work, dan Solution Demos agar setiap karya ditampilkan sesuai konteks sebenarnya.</p>
        </div>

        <div className="portfolioPreviewGrid">
          {SELECTED_WORK.map((item) => {
            const content = (
              <>
                <span className="portfolioTag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <small>{item.meta}</small>
                <strong>{item.action}</strong>
              </>
            );

            return item.external ? (
              <a className="portfolioPreviewCard" href={item.href} target="_blank" rel="noreferrer" key={item.title}>{content}</a>
            ) : (
              <Link className="portfolioPreviewCard" href={item.href} key={item.title}>{content}</Link>
            );
          })}
        </div>

        <div className="portfolioMore">
          <Link className="textLink" href="/portfolio">Lihat QIRA Products & Client Work →</Link>
        </div>
      </section>

      <section className="companyClosing shell">
        <div>
          <p className="kicker">Start simple</p>
          <h2>Tidak perlu tahu nama teknologinya. Mulai dari masalah yang ingin diselesaikan.</h2>
        </div>
        <div className="closingActions">
          <Link className="primaryButton light" href="/coba-masalah">Ceritakan kebutuhan</Link>
          <Link className="closingTextLink" href="/harga">Lihat harga awal →</Link>
        </div>
      </section>

      <footer className="companyFooter shell">
        <div>
          <Link className="brand" href="/">QIRA<span>.</span></Link>
          <p>Simple digital solutions for growing businesses.</p>
        </div>
        <div className="footerLinks">
          <Link href="/about">About Us</Link>
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
