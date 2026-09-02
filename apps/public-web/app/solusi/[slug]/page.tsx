import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    image: "/illustrations/qira-hero.webp",
  },
  "automation-bisnis": {
    title: "Automation Bisnis",
    description: "Kurangi pekerjaan berulang dengan automation yang mengikuti alur bisnis nyata, bukan sekadar menambah teknologi.",
    eyebrow: "Automation",
    lead: "Kurangi kerja berulang yang tidak perlu dilakukan manual setiap hari.",
    problem: "Follow-up, pemindahan data, pengingat, atau pekerjaan rutin terus diulang secara manual.",
    help: "QIRA menghubungkan langkah yang memang bisa diotomatisasi sambil mempertahankan kontrol pada keputusan penting.",
    outcome: "Tim menghabiskan lebih sedikit waktu pada pekerjaan repetitif dan lebih mudah memantau proses.",
    image: "/illustrations/qira-services.webp",
  },
  "digitalisasi-administrasi": {
    title: "Digitalisasi Administrasi",
    description: "Rapikan data dan dokumen bisnis agar administrasi tidak bergantung pada pencatatan yang tersebar.",
    eyebrow: "Administration",
    lead: "Dari data berulang menjadi dokumen dan pencatatan yang lebih konsisten.",
    problem: "Data yang sama ditulis berkali-kali, dokumen dibuat manual, atau status pekerjaan sulit dilacak.",
    help: "QIRA menyusun input, penyimpanan, dan pembuatan dokumen menjadi satu alur yang lebih sederhana.",
    outcome: "Administrasi lebih cepat, lebih konsisten, dan lebih mudah diperiksa kembali.",
    image: "/illustrations/qira-examples-visual.svg",
  },
  "business-tools": {
    title: "Business Tools Sederhana",
    description: "Aplikasi bisnis ringan untuk kebutuhan spesifik seperti transaksi, workflow, pencatatan, atau dashboard operasional.",
    eyebrow: "Business tools",
    lead: "Bangun alat yang dibutuhkan pekerjaan, bukan sistem besar yang tidak terpakai.",
    problem: "Spreadsheet, chat, dan catatan terpisah membuat pekerjaan inti sulit diikuti dari awal sampai selesai.",
    help: "QIRA membuat tool kecil yang fokus pada satu alur penting dan dapat ditambah saat kebutuhannya benar-benar muncul.",
    outcome: "Pekerjaan lebih rapi dalam satu alur tanpa membebani pengguna dengan fitur berlebihan.",
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
    <nav className="companyNav shell" aria-label="Navigasi utama">
      <Link className="brand" href="/">QIRA<span>.</span></Link>
      <div className="companyNavLinks"><Link href="/about">About</Link><Link href="/portfolio">Portfolio</Link><Link href="/harga">Pricing</Link></div>
      <Link className="smallButton" href="/coba-masalah">Mulai</Link>
    </nav>

    <section className={`${styles.hero} shell`}>
      <div className={styles.heroCopy}>
        <p className="eyebrow">{solution.eyebrow}</p>
        <h1>{solution.title}</h1>
        <p>{solution.lead}</p>
        <div className={styles.heroActions}><Link className="primaryButton" href="/coba-masalah">Ceritakan kebutuhan</Link></div>
      </div>
      <figure className={styles.heroVisual}>
        <Image src={solution.image} alt={`Ilustrasi ${solution.title} oleh QIRA`} width={1536} height={1024} priority sizes="(max-width: 960px) 100vw, 48vw" unoptimized={solution.image.endsWith(".svg")} />
      </figure>
    </section>

    <section className={`${styles.section} shell`}>
      <div className="simplePrinciples">
        <article><span>Masalah</span><h3>Apa yang dirapikan</h3><p>{solution.problem}</p></article>
        <article><span>QIRA</span><h3>Apa yang dibuat</h3><p>{solution.help}</p></article>
        <article><span>Hasil</span><h3>Apa yang terasa</h3><p>{solution.outcome}</p></article>
      </div>
    </section>

    <section className="companyClosing simpleCompactClosing shell"><div><p className="kicker">Start simple</p><h2>Mulai dari satu masalah.</h2></div><div className="closingActions"><Link className="primaryButton light" href="/coba-masalah">Mulai</Link></div></section>

    <footer className="companyFooter shell"><div><Link className="brand" href="/">QIRA<span>.</span></Link></div><div className="footerLinks"><Link href="/">Home</Link><Link href="/portfolio">Portfolio</Link><Link href="/harga">Pricing</Link><Link href="/privasi">Privacy</Link></div><span>QIRA · PT Rays Solusi Informasi</span></footer>
  </main>;
}
