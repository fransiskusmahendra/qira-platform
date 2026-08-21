import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Lihat selected work QIRA: website, business tools, automation, discovery, document workflow, dan solusi operasional digital.",
};

const PROJECTS = [
  {
    number: "01",
    tag: "Public demo",
    title: "Business Solution Demo",
    challenge: "Membuat calon pengguna memahami manfaat solusi digital tanpa harus memahami istilah teknis atau sistem yang kompleks.",
    solution: "Pengalaman demo yang menyatukan problem, contoh solusi, paket, workflow, dan CTA discovery dalam satu halaman yang sederhana.",
    result: "Calon pengguna dapat melihat gambaran solusi dan menentukan langkah berikutnya dengan lebih cepat.",
    stack: ["Web experience", "Sales enablement", "Responsive UI"],
    href: "https://qira-umkm-sales-demo-fransiskusmahendra-7960s-projects.vercel.app",
    cta: "Buka live demo",
    external: true,
  },
  {
    number: "02",
    tag: "Public workflow",
    title: "Business Discovery & Scoping",
    challenge: "Kebutuhan digital sering sulit dijelaskan karena pengguna belum tahu bentuk aplikasi atau teknologi yang dibutuhkan.",
    solution: "Flow discovery yang memulai dari masalah bisnis, lalu mengumpulkan konteks, prioritas, anggaran, dan kesiapan implementasi.",
    result: "Percakapan awal menjadi lebih terstruktur dan scope awal lebih mudah disusun.",
    stack: ["Discovery flow", "Qualification", "Scoping"],
    href: "/discovery",
    cta: "Coba discovery",
    external: false,
  },
  {
    number: "03",
    tag: "Private solution",
    title: "Invoice & Document Generator",
    challenge: "Pembuatan invoice dan dokumen operasional berulang membutuhkan format yang konsisten dan proses yang lebih cepat.",
    solution: "Tool private untuk mengisi data transaksi, menyusun dokumen dengan format standar, dan menyiapkan output siap digunakan.",
    result: "Pekerjaan administratif lebih ringkas dan risiko format tidak konsisten berkurang.",
    stack: ["Document automation", "Private access", "Operational tool"],
    href: null,
    cta: null,
    external: false,
  },
  {
    number: "04",
    tag: "Custom operations",
    title: "Transaction & Thermal Receipt Tool",
    challenge: "Petugas lapangan membutuhkan alur transaksi yang cepat, sederhana, dan cocok digunakan dari perangkat mobile.",
    solution: "Aplikasi operasional ringan untuk mencatat transaksi, membentuk nota, dan menyiapkan proses cetak thermal dengan input seminimal mungkin.",
    result: "Alur penggunaan menjadi lebih cepat untuk petugas dan lebih konsisten pada proses transaksi harian.",
    stack: ["Mobile workflow", "Receipt generation", "Operational UX"],
    href: null,
    cta: null,
    external: false,
  },
] as const;

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

      <section className="portfolioHero shell">
        <p className="eyebrow">QIRA Portfolio</p>
        <h1>Solusi digital yang dibentuk dari masalah yang benar-benar perlu diselesaikan.</h1>
        <p>
          Kami menampilkan portfolio berdasarkan pola kebutuhan dan hasil. Untuk project private, detail sensitif, data, nama klien, dan akses aplikasi tidak dipublikasikan.
        </p>
      </section>

      <section className="portfolioList shell">
        {PROJECTS.map((project) => (
          <article className="portfolioCase" key={project.title}>
            <div className="portfolioCaseTop">
              <span className="portfolioNumber">{project.number}</span>
              <span className="portfolioTag">{project.tag}</span>
            </div>
            <div className="portfolioCaseBody">
              <div className="portfolioCaseTitle">
                <h2>{project.title}</h2>
                <div className="portfolioStack">
                  {project.stack.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
              <div className="portfolioCaseDetails">
                <div>
                  <small>Challenge</small>
                  <p>{project.challenge}</p>
                </div>
                <div>
                  <small>Solution</small>
                  <p>{project.solution}</p>
                </div>
                <div>
                  <small>Outcome</small>
                  <p>{project.result}</p>
                </div>
              </div>
            </div>
            {project.href && project.cta ? (
              project.external ? (
                <a className="portfolioCaseLink" href={project.href} target="_blank" rel="noreferrer">{project.cta} →</a>
              ) : (
                <Link className="portfolioCaseLink" href={project.href}>{project.cta} →</Link>
              )
            ) : (
              <span className="portfolioPrivateNote">Akses aplikasi tidak dipublikasikan</span>
            )}
          </article>
        ))}
      </section>

      <section className="portfolioNote shell">
        <p className="kicker">A practical portfolio</p>
        <div>
          <h2>Tidak semua project perlu menjadi sistem besar.</h2>
          <p>
            Sebagian project QIRA memang sengaja kecil dan fokus: satu workflow, satu dokumen, satu dashboard, atau satu proses yang sebelumnya memakan waktu. Ukurannya boleh sederhana selama manfaatnya nyata.
          </p>
        </div>
      </section>

      <section className="companyClosing shell">
        <div>
          <p className="kicker">Your project</p>
          <h2>Punya proses yang bisa dibuat lebih cepat atau lebih rapi?</h2>
        </div>
        <div className="closingActions">
          <Link className="primaryButton light" href="/coba-masalah">Ceritakan kebutuhan</Link>
          <Link className="closingTextLink" href="/harga">Lihat layanan →</Link>
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
