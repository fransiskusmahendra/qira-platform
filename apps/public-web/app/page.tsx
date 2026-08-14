import { CARE_PLANS, PROPOSAL_PACKAGES, SERVICE_CATALOG } from "@qira/domain";
import Link from "next/link";
import { PersonalizedDemo } from "./PersonalizedDemo";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default function HomePage() {
  return (
    <main>
      <nav className="nav shell" aria-label="Navigasi utama">
        <a className="brand" href="#top" aria-label="QIRA beranda">QIRA<span>.</span></a>
        <div className="navLinks">
          <a href="#live-experience">Coba Masalah Anda</a>
          <a href="#packages">Harga & Paket</a>
          <a href="#contoh-penerapan">Cara Diterapkan</a>
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
          <a className="primaryButton" href="#live-experience">Coba pengalaman langsung</a>
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

      <PersonalizedDemo />

      <section className="caseStudyCallout shell" id="contoh-penerapan">
        <div className="caseStudyMark"><span>◇</span><small>Concept case studies</small></div>
        <div>
          <p className="kicker">Contoh penerapan yang transparan</p>
          <h2>Lihat perjalanan dari masalah manual menuju solusi QIRA.</h2>
          <p>Semua contoh menggunakan data simulasi—bukan klaim pelanggan—untuk menunjukkan bentuk solusi, dampak yang dituju, paket, dan estimasi waktu.</p>
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
            </article>
          ))}
        </div>
        <div className="packageCta"><Link className="primaryButton" href="/discovery">Pilih paket melalui Discovery</Link></div>
        <p className="pricingNote">Domain, hosting, layanan pihak ketiga, integrasi berbayar, dan perubahan di luar scope tidak termasuk kecuali tertulis dalam proposal.</p>
      </section>

      <section className="custom shell">
        <div>
          <p className="kicker">Custom Business Solution</p>
          <h2>Kebutuhan Anda tidak cocok dengan paket?</h2>
          <p>QIRA dapat merancang dashboard, aplikasi operasional, otomasi, dokumen otomatis, atau integrasi berdasarkan hasil discovery. Harga diberikan setelah kebutuhan dan batas proyek disepakati.</p>
        </div>
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
          <div><strong>01</strong><h3>Explore</h3><p>Coba live experience, bandingkan paket, demo, harga, dan contoh penerapan.</p></div>
          <div><strong>02</strong><h3>Discover</h3><p>Isi kebutuhan tanpa login dan dapatkan proposal, demo, serta harga awal.</p></div>
          <div><strong>03</strong><h3>Agree</h3><p>Setujui atau minta revisi, konfirmasi scope final, lalu bayar DP 50%.</p></div>
          <div><strong>04</strong><h3>Build & UAT</h3><p>Development, pengujian, perbaikan sesuai scope, dan persetujuan UAT.</p></div>
          <div><strong>05</strong><h3>Go Live</h3><p>Pelunasan, peluncuran, onboarding, dan opsi Managed by QIRA.</p></div>
        </div>
      </section>

      <section className="closing shell">
        <div><p className="kicker">Your Business, Understood.</p><h2>Mulai dari satu proses yang ingin Anda perbaiki.</h2></div>
        <Link className="primaryButton light" href="/discovery">Mulai Discovery tanpa login</Link>
      </section>

      <footer className="footer shell"><span>QIRA · PT Rays Solusi Informasi</span><span>Jakarta, Indonesia</span></footer>
    </main>
  );
}
