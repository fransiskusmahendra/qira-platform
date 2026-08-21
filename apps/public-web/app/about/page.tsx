import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description: "Kenali QIRA, partner solusi digital yang membantu bisnis membuat teknologi lebih sederhana, praktis, dan relevan.",
};

const VALUES = [
  ["Simple first", "Solusi harus mudah dipahami dan digunakan sebelum menjadi canggih."],
  ["Business before technology", "Kami mulai dari kebutuhan bisnis, bukan dari tren atau tools yang sedang populer."],
  ["Build what matters", "Fitur dibuat berdasarkan manfaat nyata agar biaya dan waktu tetap terkendali."],
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

      <section className="aboutHero shell">
        <p className="eyebrow">About QIRA</p>
        <h1>Teknologi seharusnya membantu bisnis bekerja lebih mudah, bukan membuatnya semakin rumit.</h1>
        <p>
          QIRA adalah brand solusi digital dari PT Rays Solusi Informasi yang membantu bisnis dan UMKM merapikan proses, membangun pengalaman digital, dan membuat tools yang sesuai kebutuhan nyata.
        </p>
      </section>

      <section className="aboutStory shell">
        <p className="kicker">Why QIRA</p>
        <div>
          <h2>Kami percaya bisnis tidak harus menjadi perusahaan teknologi untuk mendapatkan manfaat dari teknologi.</h2>
          <p>
            Banyak kebutuhan sebenarnya bisa diselesaikan dengan solusi yang lebih sederhana: sebuah website yang jelas, form yang lebih rapi, dashboard yang mudah dibaca, proses manual yang diotomatisasi, atau aplikasi kecil yang memang dibuat untuk satu pekerjaan penting.
          </p>
          <p>
            Karena itu, pendekatan QIRA selalu dimulai dari masalah, target, dan cara kerja bisnis. Teknologi dipilih setelah kebutuhan dipahami.
          </p>
        </div>
      </section>

      <section className="aboutValues shell">
        {VALUES.map(([title, copy], index) => (
          <article key={title}>
            <span>0{index + 1}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="aboutFocus shell">
        <div>
          <p className="kicker">What we focus on</p>
          <h2>Solusi kecil yang berguna hari ini, dengan ruang untuk berkembang besok.</h2>
        </div>
        <div className="aboutFocusList">
          <p>Website & digital presence</p>
          <p>Web application & internal tools</p>
          <p>Automation & API integration</p>
          <p>Business process discovery</p>
          <p>Digital implementation support</p>
        </div>
      </section>

      <section className="companyClosing shell">
        <div>
          <p className="kicker">Work with QIRA</p>
          <h2>Punya proses yang ribet atau ide yang ingin dibuat lebih nyata?</h2>
        </div>
        <div className="closingActions">
          <Link className="primaryButton light" href="/coba-masalah">Mulai dari kebutuhanmu</Link>
          <Link className="closingTextLink" href="/portfolio">Lihat portfolio →</Link>
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
