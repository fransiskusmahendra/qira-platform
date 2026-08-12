import { CARE_PLANS, PROPOSAL_PACKAGES, SERVICE_CATALOG } from "@qira/domain";
import Link from "next/link";

const whatsappNumber = "628211076517";
const discoveryMessage = encodeURIComponent(
  "Halo QIRA, saya ingin mendiskusikan kebutuhan digital atau otomasi untuk bisnis saya.",
);
const discoveryUrl = `https://wa.me/${whatsappNumber}?text=${discoveryMessage}`;
const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default function HomePage() {
  return (
    <main>
      <nav className="nav shell" aria-label="Navigasi utama">
        <a className="brand" href="#top" aria-label="QIRA beranda">QIRA<span>.</span></a>
        <div className="navLinks">
          <a href="#packages">Paket</a>
          <Link className="navCta" href="/discovery">Mulai Discovery</Link>
        </div>
      </nav>

      <section className="hero shell" id="top">
        <div className="eyebrow">Solusi digital yang mengikuti cara kerja bisnis Anda</div>
        <h1>Masih ada proses bisnis yang manual? <em>QIRA membantu merapikannya.</em></h1>
        <p className="heroCopy">
          Mulai dengan paket yang mudah diterapkan atau solusi custom. QIRA memahami
          kebutuhan Anda, membuat demo, lalu membangun solusi yang benar-benar dapat digunakan.
        </p>
        <div className="heroActions">
          <Link className="primaryButton" href="/discovery">Ceritakan kebutuhan Anda</Link>
          <a className="textLink" href="#packages">Lihat paket <span aria-hidden="true">↓</span></a>
        </div>
        <div className="trustRow" aria-label="Prinsip kerja QIRA">
          <span>Konsultasi awal gratis</span><span>Harga dan scope transparan</span><span>Solusi dapat disesuaikan</span>
        </div>
      </section>

      <section className="services shell" id="services">
        <div className="sectionHeading">
          <div><p className="kicker">Kapabilitas QIRA</p><h2>Dari masalah bisnis sampai solusi yang bekerja.</h2></div>
          <p>Setiap kerja sama dimulai dengan memahami tujuan, proses, data, anggaran, dan batasan bisnis Anda.</p>
        </div>
        <div className="serviceGrid">
          {SERVICE_CATALOG.map((service, index) => (
            <article className="serviceCard" key={service.id}>
              <span className="serviceNumber">0{index + 1}</span><h3>{service.name}</h3>
              <p>{service.outcome}</p><div className="prompt">“{service.discoveryPrompt}”</div>
            </article>
          ))}
        </div>
      </section>

      <section className="packages shell" id="packages">
        <div className="sectionHeading">
          <div><p className="kicker">Harga perkenalan QIRA</p><h2>Tiga cara sederhana untuk mulai.</h2></div>
          <p>Pilih paket yang paling mendekati kebutuhan Anda. Harga final dan ruang lingkup dikonfirmasi setelah discovery.</p>
        </div>
        <div className="packageGrid">
          {PROPOSAL_PACKAGES.map((item) => (
            <article className="packageCard" key={item.id}>
              <p className="packageLabel">Proyek portofolio terbatas</p>
              <h3>{item.name}</h3><p className="packageTagline">{item.tagline}</p>
              <div className="packagePrice"><span>{item.priceLabel}</span><strong>{rupiah.format(item.introductoryPriceIdr)}</strong></div>
              <ul>{item.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}</ul>
              <div className="packageMeta"><span>{item.durationWeeks[0]}–{item.durationWeeks[1]} minggu</span><span>{item.revisions}x revisi</span><span>{item.supportDays} hari dukungan awal</span></div>
              <Link className="packageButton" href="/discovery">Pilih sebagai titik awal</Link>
            </article>
          ))}
        </div>
        <p className="pricingNote">Domain, hosting, layanan pihak ketiga, integrasi berbayar, dan perubahan di luar scope tidak termasuk kecuali tertulis dalam proposal.</p>
      </section>

      <section className="custom shell">
        <div>
          <p className="kicker">Custom Business Solution</p>
          <h2>Kebutuhan Anda tidak cocok dengan paket?</h2>
          <p>QIRA dapat merancang dashboard, aplikasi operasional, otomasi, dokumen otomatis, atau integrasi berdasarkan hasil discovery. Harga diberikan setelah kebutuhan dan batas proyek disepakati.</p>
        </div>
        <Link className="primaryButton" href="/discovery">Minta solusi custom</Link>
      </section>

      <section className="care shell">
        <div className="sectionHeading">
          <div><p className="kicker">Dukungan setelah peluncuran</p><h2>Maintenance tetap terukur.</h2></div>
          <p>Dukungan berkelanjutan bersifat opsional agar biaya awal tetap ramah bagi UMKM.</p>
        </div>
        <div className="careGrid">
          {CARE_PLANS.map((plan) => <article key={plan.name}><h3>{plan.name}</h3><strong>{plan.priceRange}</strong><p>{plan.outcome}</p></article>)}
          <article><h3>Perubahan besar</h3><strong>Quotation terpisah</strong><p>Fitur baru, integrasi, atau perubahan alur dinilai kembali melalui discovery singkat.</p></article>
        </div>
      </section>

      <section className="process shell">
        <p className="kicker">Cara kerja</p>
        <div className="processGrid">
          <div><strong>01</strong><h3>Understand</h3><p>Memahami hasil bisnis, anggaran, dan kondisi nyata.</p></div>
          <div><strong>02</strong><h3>Propose</h3><p>Menentukan paket atau solusi custom beserta scope dan harga.</p></div>
          <div><strong>03</strong><h3>Build</h3><p>DP 50%, pembangunan dan validasi, lalu pelunasan sebelum serah terima.</p></div>
        </div>
      </section>

      <section className="closing shell">
        <div><p className="kicker">Your Business, Understood.</p><h2>Mulai dari satu proses yang ingin Anda perbaiki.</h2></div>
        <a className="primaryButton light" href={discoveryUrl} target="_blank" rel="noreferrer">Konsultasi awal gratis</a>
      </section>

      <footer className="footer shell"><span>QIRA · PT Rays Solusi Informasi</span><span>Jakarta, Indonesia</span></footer>
    </main>
  );
}
