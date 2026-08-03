import { SERVICE_CATALOG } from "@qira/domain";
import Link from "next/link";

const whatsappNumber = "628211076517";
const discoveryMessage = encodeURIComponent(
  "Halo QIRA, saya ingin mendiskusikan kebutuhan AI atau otomasi untuk bisnis saya.",
);
const discoveryUrl = `https://wa.me/${whatsappNumber}?text=${discoveryMessage}`;

export default function HomePage() {
  return (
    <main>
      <nav className="nav shell" aria-label="Navigasi utama">
        <a className="brand" href="#top" aria-label="QIRA beranda">
          QIRA<span>.</span>
        </a>
        <Link className="navCta" href="/discovery">
          Mulai Discovery
        </Link>
      </nav>

      <section className="hero shell" id="top">
        <div className="eyebrow">AI-first business transformation</div>
        <h1>
          Bisnis Anda punya cara kerja sendiri. <em>QIRA memahaminya.</em>
        </h1>
        <p className="heroCopy">
          Kami membantu organisasi menemukan hambatan operasional, memilih peluang AI
          yang tepat, lalu membangun solusi yang bisa dipakai dan dikembangkan.
        </p>
        <div className="heroActions">
          <Link className="primaryButton" href="/discovery">
            Ceritakan kebutuhan Anda
          </Link>
          <a className="textLink" href="#services">
            Lihat kapabilitas <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="trustRow" aria-label="Prinsip kerja QIRA">
          <span>Mulai dari masalah bisnis</span>
          <span>Human oversight</span>
          <span>Solusi yang dapat digunakan ulang</span>
        </div>
      </section>

      <section className="services shell" id="services">
        <div className="sectionHeading">
          <div>
            <p className="kicker">Kapabilitas QIRA</p>
            <h2>Dari pertanyaan yang tepat sampai solusi yang bekerja.</h2>
          </div>
          <p>
            Setiap kerja sama dimulai dengan memahami tujuan, proses, data, dan batasan
            organisasi Anda.
          </p>
        </div>

        <div className="serviceGrid">
          {SERVICE_CATALOG.map((service, index) => (
            <article className="serviceCard" key={service.id}>
              <span className="serviceNumber">0{index + 1}</span>
              <h3>{service.name}</h3>
              <p>{service.outcome}</p>
              <div className="prompt">“{service.discoveryPrompt}”</div>
            </article>
          ))}
        </div>
      </section>

      <section className="process shell">
        <p className="kicker">Cara kerja</p>
        <div className="processGrid">
          <div><strong>01</strong><h3>Understand</h3><p>Memahami hasil bisnis dan kondisi nyata.</p></div>
          <div><strong>02</strong><h3>Prioritize</h3><p>Memilih peluang dengan dampak paling masuk akal.</p></div>
          <div><strong>03</strong><h3>Build</h3><p>Membangun, menguji, dan mendampingi adopsi.</p></div>
        </div>
      </section>

      <section className="closing shell">
        <div>
          <p className="kicker">Your Business, Understood.</p>
          <h2>Mulai dari satu proses yang ingin Anda perbaiki.</h2>
        </div>
        <a className="primaryButton light" href={discoveryUrl} target="_blank" rel="noreferrer">
          Hubungi QIRA
        </a>
      </section>

      <footer className="footer shell">
        <span>QIRA · PT Rays Solusi Informasi</span>
        <span>Jakarta, Indonesia</span>
      </footer>
    </main>
  );
}
