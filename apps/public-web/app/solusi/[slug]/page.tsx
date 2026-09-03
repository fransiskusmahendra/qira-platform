import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContextualWhatsAppCta } from "../../_components/ContextualWhatsAppCta";
import { ConversionTracker } from "../../_components/ConversionTracker";
import styles from "../../SubpageVisual.module.css";

const SOLUTIONS = {
  "website-umkm": {
    title: "Website untuk UMKM",
    description: "Website sederhana untuk membantu usaha lebih mudah ditemukan, dipahami, dan dihubungi pelanggan.",
    eyebrow: "Website",
    lead: "Informasi usaha yang jelas tanpa membuat operasional lebih rumit.",
    problem: "Informasi usaha tersebar di chat atau media sosial dan pelanggan sulit menemukan satu sumber yang jelas.",
    help: "QIRA merapikan profil usaha, penawaran utama, kontak, dan alur tindakan dalam website yang ringan.",
    outcome: "Pelanggan lebih cepat memahami usaha dan tahu harus menghubungi ke mana.",
    fit: "Usaha yang masih mengandalkan media sosial atau chat sebagai satu-satunya tempat informasi.",
    deliverables: ["Struktur pesan usaha", "Landing page responsif", "Kontak & ajakan bertindak", "Bantuan publikasi awal"],
    image: "/illustrations/qira-hero.webp",
  },
  "automation-bisnis": {
    title: "Otomatisasi Bisnis",
    description: "Kurangi pekerjaan berulang dengan otomatisasi yang mengikuti alur bisnis nyata, bukan sekadar menambah teknologi.",
    eyebrow: "Otomatisasi",
    lead: "Kurangi kerja berulang yang tidak perlu dilakukan manual setiap hari.",
    problem: "Tindak lanjut, pemindahan data, pengingat, atau pekerjaan rutin terus diulang secara manual.",
    help: "QIRA menghubungkan langkah yang memang bisa diotomatisasi sambil mempertahankan kontrol pada keputusan penting.",
    outcome: "Tim menghabiskan lebih sedikit waktu pada pekerjaan berulang dan lebih mudah memantau proses.",
    fit: "Tim yang rutin menyalin data, mengirim pengingat, atau melakukan tindak lanjut yang sama.",
    deliverables: ["Peta alur kerja", "Otomatisasi prioritas", "Status & pengecualian", "Panduan penggunaan"],
    image: "/illustrations/qira-services.webp",
  },
  "digitalisasi-administrasi": {
    title: "Digitalisasi Administrasi",
    description: "Rapikan data dan dokumen bisnis agar administrasi tidak bergantung pada pencatatan yang tersebar.",
    eyebrow: "Administrasi",
    lead: "Dari data berulang menjadi dokumen dan pencatatan yang lebih konsisten.",
    problem: "Data yang sama ditulis berkali-kali, dokumen dibuat manual, atau status pekerjaan sulit dilacak.",
    help: "QIRA menyusun input, penyimpanan, dan pembuatan dokumen menjadi satu alur yang lebih sederhana.",
    outcome: "Administrasi lebih cepat, lebih konsisten, dan lebih mudah diperiksa kembali.",
    fit: "Usaha dengan data, dokumen, atau status pekerjaan yang tersebar di banyak tempat.",
    deliverables: ["Form input terarah", "Penyimpanan terstruktur", "Dokumen otomatis dasar", "Tampilan status"],
    image: "/illustrations/premium/qira-examples-premium.webp",
  },
  "business-tools": {
    title: "Alat Kerja Digital Sederhana",
    description: "Aplikasi bisnis ringan untuk kebutuhan khusus seperti transaksi, alur kerja, pencatatan, atau dashboard operasional.",
    eyebrow: "Alat kerja digital",
    lead: "Bangun alat yang dibutuhkan pekerjaan, bukan sistem besar yang tidak terpakai.",
    problem: "Spreadsheet, chat, dan catatan terpisah membuat pekerjaan inti sulit diikuti dari awal sampai selesai.",
    help: "QIRA membuat alat digital yang fokus pada satu alur penting dan dapat ditambah saat kebutuhannya benar-benar muncul.",
    outcome: "Pekerjaan lebih rapi dalam satu alur tanpa membebani pengguna dengan fitur berlebihan.",
    fit: "Tim yang membutuhkan alat khusus untuk satu proses penting, tetapi belum perlu sistem besar.",
    deliverables: ["Alur pengguna", "Alat responsif", "Database sederhana", "Dashboard operasional"],
    image: "/illustrations/qira-process.webp",
  },
} as const;

type SolutionSlug = keyof typeof SOLUTIONS;

export function generateStaticParams() {
  return Object.keys(SOLUTIONS).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const solution = SOLUTIONS[slug as SolutionSlug];
  if (!solution) return {};
  return {
    title: solution.title,
    description: solution.description,
    alternates: { canonical: `/solusi/${slug}` },
    openGraph: { title: `${solution.title} | QIRA`, description: solution.description, url: `/solusi/${slug}`, type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: solution.title }] },
    twitter: { card: "summary_large_image", title: `${solution.title} | QIRA`, description: solution.description, images: ["/opengraph-image"] },
  };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = SOLUTIONS[slug as SolutionSlug];
  if (!solution) notFound();

  return <main>
    <ConversionTracker event="service_view" />
    <nav className="companyNav shell" aria-label="Navigasi utama">
      <Link className="brand" href="/">QIRA<span>.</span></Link>
      <div className="companyNavLinks"><Link href="/about">Tentang</Link><Link href="/layanan" aria-current="page">Layanan</Link><Link href="/portfolio">Portofolio</Link><Link href="/harga">Harga</Link></div>
      <Link className="smallButton" href="/coba-masalah">Ceritakan masalah</Link>
    </nav>

    <section className={`${styles.hero} shell`}>
      <div className={styles.heroCopy}>
        <p className="eyebrow">{solution.eyebrow}</p>
        <h1>{solution.title}</h1>
        <p>{solution.lead}</p>
        <div className={styles.heroActions}><ContextualWhatsAppCta context={solution.title}>Mulai konsultasi</ContextualWhatsAppCta><Link className="textLink" href="#cara-kerja">Lihat proses ↓</Link></div>
      </div>
      <figure className={styles.heroVisual}>
        <Image src={solution.image} alt={`Ilustrasi ${solution.title} oleh QIRA`} width={1536} height={1024} quality={90} priority sizes="(max-width: 960px) 100vw, 48vw" />
      </figure>
    </section>

    <section className={`${styles.section} shell`} id="cara-kerja">
      <div className="simplePrinciples">
        <article><span>Masalah</span><h3>Apa yang dirapikan</h3><p>{solution.problem}</p></article>
        <article><span>QIRA</span><h3>Apa yang dibuat</h3><p>{solution.help}</p></article>
        <article><span>Hasil</span><h3>Apa yang terasa</h3><p>{solution.outcome}</p></article>
      </div>
    </section>

    <section className="solutionDetails shell">
      <article className="solutionFit">
        <p className="kicker">Cocok jika</p>
        <h2>{solution.fit}</h2>
      </article>
      <article className="solutionDeliverables">
        <p className="kicker">Yang disiapkan</p>
        <ul>{solution.deliverables.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
      </article>
    </section>

    <section className="solutionProcess shell">
      <div><span>01</span><strong>Ceritakan</strong><small>Satu masalah utama.</small></div>
      <div><span>02</span><strong>Petakan</strong><small>Prioritas dan ruang lingkup.</small></div>
      <div><span>03</span><strong>Bangun</strong><small>Versi sederhana dulu.</small></div>
      <div><span>04</span><strong>Rapikan</strong><small>Uji, revisi, jalankan.</small></div>
    </section>

    <section className="companyClosing simpleCompactClosing shell"><div><p className="kicker">Mulai sederhana</p><h2>Belum yakin bentuk solusinya?</h2><p>QIRA bantu memetakan dulu. Tidak perlu penjelasan teknis.</p></div><div className="closingActions"><ContextualWhatsAppCta context={solution.title} className="primaryButton light">Mulai konsultasi</ContextualWhatsAppCta></div></section>

    <footer className="companyFooter shell"><div><Link className="brand" href="/">QIRA<span>.</span></Link></div><div className="footerLinks"><Link href="/">Beranda</Link><Link href="/layanan">Layanan</Link><Link href="/portfolio">Portofolio</Link><Link href="/harga">Harga</Link><Link href="/privasi">Privasi</Link></div><span>QIRA · Solusi digital sederhana untuk bisnis</span></footer>
  </main>;
}
