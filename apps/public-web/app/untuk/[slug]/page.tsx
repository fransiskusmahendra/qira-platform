import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContextualWhatsAppCta } from "../../_components/ContextualWhatsAppCta";
import { ConversionTracker } from "../../_components/ConversionTracker";
import { Navbar } from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { ClosingCtaSection } from "../../_components/ClosingCtaSection";
import styles from "../../SubpageVisual.module.css";

const USE_CASES = {
  "usaha-jasa": {
    eyebrow: "Untuk usaha jasa",
    title: "Dari chat masuk sampai pekerjaan selesai.",
    lead: "Biar calon pelanggan paham jasamu dan setiap permintaan lebih mudah diikuti.",
    image: "/illustrations/premium/qira-service-business.webp",
    alt: "Alur digital usaha jasa dari pesan pelanggan hingga pekerjaan selesai",
    pains: ["Info jasa tersebar", "Tindak lanjut terlupa", "Status sulit dipantau"],
    flow: ["Website yang jelas", "Form permintaan", "Status pekerjaan"],
    outcomes: ["Mudah dihubungi", "Permintaan lebih rapi", "Tim tahu langkah berikutnya"],
    solutionHref: "/solusi/website-umkm",
  },
  "retail-umkm": {
    eyebrow: "Untuk retail & UMKM",
    title: "Produk terlihat. Pesanan lebih teratur.",
    lead: "Satukan informasi produk, permintaan pelanggan, dan pencatatan sederhana.",
    image: "/illustrations/premium/qira-retail-business.webp",
    alt: "Alur digital retail dari produk menuju pesanan dan pencatatan",
    pains: ["Katalog tersebar", "Pesanan dari banyak chat", "Nota dibuat berulang"],
    flow: ["Halaman produk", "Form pesanan", "Nota & pencatatan"],
    outcomes: ["Produk mudah dipahami", "Pesanan tidak tercecer", "Transaksi lebih cepat"],
    solutionHref: "/solusi/business-tools",
  },
  "administrasi-tim": {
    eyebrow: "Untuk administrasi tim",
    title: "Data masuk sekali. Pekerjaan lanjut tanpa mencari-cari.",
    lead: "Rapikan input, dokumen, dan status pekerjaan dalam satu alur sederhana.",
    image: "/illustrations/premium/qira-admin-business.webp",
    alt: "Alur administrasi digital dari data menuju dokumen dan laporan",
    pains: ["Data ditulis berulang", "File sulit ditemukan", "Status harus ditanyakan"],
    flow: ["Form terarah", "Data tersimpan", "Dokumen & dashboard"],
    outcomes: ["Lebih konsisten", "Mudah diperiksa", "Lebih hemat waktu"],
    solutionHref: "/solusi/digitalisasi-administrasi",
  },
} as const;

type UseCaseSlug = keyof typeof USE_CASES;

export function generateStaticParams() { return Object.keys(USE_CASES).map((slug) => ({ slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = USE_CASES[slug as UseCaseSlug];
  if (!item) return {};
  const title = item.eyebrow.replace("Untuk ", "Solusi untuk ");
  return {
    title,
    description: item.lead,
    alternates: { canonical: `/untuk/${slug}` },
    openGraph: { title: `${item.title} | QIRA`, description: item.lead, url: `/untuk/${slug}`, type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: item.title }] },
    twitter: { card: "summary_large_image", title: `${item.title} | QIRA`, description: item.lead, images: ["/opengraph-image"] },
  };
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = USE_CASES[slug as UseCaseSlug];
  if (!item) notFound();

  return (
    <>
      <Navbar />
      <main>
        <ConversionTracker event="service_view" />

        <section className={`${styles.hero} shell`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">{item.eyebrow}</p>
            <h1>{item.title}</h1>
            <p>{item.lead}</p>
            <div className={styles.heroActions}>
              <ContextualWhatsAppCta context={item.eyebrow}>Mulai konsultasi</ContextualWhatsAppCta>
            </div>
          </div>
          <figure className={styles.heroVisual}>
            <Image src={item.image} alt={item.alt} width={1672} height={941} quality={90} priority sizes="(max-width: 960px) 100vw, 48vw" />
          </figure>
        </section>

        <section className="useCaseJourney shell" aria-label="Perubahan yang dibantu QIRA">
          <div className="useCaseColumn problem">
            <p className="kicker">Yang bikin repot</p>
            {item.pains.map((text) => <span key={text}>{text}</span>)}
          </div>
          <div className="useCaseArrow" aria-hidden="true">→</div>
          <div className="useCaseColumn qira">
            <p className="kicker">Yang QIRA rapikan</p>
            {item.flow.map((text) => <span key={text}>{text}</span>)}
          </div>
          <div className="useCaseArrow" aria-hidden="true">→</div>
          <div className="useCaseColumn result">
            <p className="kicker">Yang terasa</p>
            {item.outcomes.map((text) => <span key={text}>{text}</span>)}
          </div>
        </section>

        <ClosingCtaSection
          kicker="Lihat bentuk solusinya"
          heading="Mulai dari alur yang paling penting."
          subtext="Setiap bisnis bisa memulai secara bertahap tanpa harus langsung membuat sistem besar."
          primaryText="Lihat contoh solusi"
          primaryHref={item.solutionHref}
          waContext={item.eyebrow}
        />
      </main>
      <Footer />
    </>
  );
}