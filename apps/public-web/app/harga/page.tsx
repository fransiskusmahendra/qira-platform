import { CARE_PLANS, PROPOSAL_PACKAGES } from "@qira/domain";
import type { Metadata } from "next";
import Link from "next/link";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const title = "Harga & Paket";
const description = "Lihat harga awal, cakupan bantuan, dan pendampingan QIRA.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/harga" },
  openGraph: {
    title: `${title} | QIRA`,
    description,
    url: "/harga",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "QIRA — bantu usaha jadi lebih mudah" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | QIRA`,
    description,
    images: ["/opengraph-image"],
  },
};

export default function PricingPage() {
  return <main>
    <nav className="nav shell"><Link className="brand" href="/">QIRA<span>.</span></Link></nav>
    <header className="subpageIntro shell">
      <p className="kicker">Harga awal QIRA</p>
      <h1>Pilih tingkat bantuan yang paling mendekati kebutuhan.</h1>
      <p>Harga akhir ditentukan setelah kami memahami kebutuhan dan batas pekerjaan yang disepakati bersama.</p>
    </header>

    <section className="packages shell">
      <div className="packageGrid">{PROPOSAL_PACKAGES.map((item) => <article className="packageCard" key={item.id}>
        <p className="packageLabel">Harga perkenalan</p>
        <h3>{item.name}</h3>
        <p className="packageTagline">{item.tagline}</p>
        <div className="packagePrice"><span>{item.priceLabel}</span><strong>{rupiah.format(item.introductoryPriceIdr)}</strong></div>
        <ul>{item.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}</ul>
        <div className="packageMeta"><span>{item.durationWeeks[0]}–{item.durationWeeks[1]} minggu</span><span>{item.revisions}x revisi</span><span>{item.supportDays} hari dukungan awal</span></div>
      </article>)}</div>
      <div className="packageCta"><Link className="primaryButton" href="/coba-masalah">Ceritakan kebutuhanmu</Link></div>
      <p className="pricingNote">Biaya domain, hosting, layanan pihak ketiga, dan kebutuhan tambahan di luar kesepakatan awal belum termasuk kecuali disebutkan secara tertulis.</p>
    </section>

    <section className="care shell">
      <div className="sectionHeading">
        <div><p className="kicker">Pendampingan QIRA</p><h2>Dukungan setelah hasil mulai digunakan bersifat opsional.</h2></div>
        <p>Paket pendampingan hanya mencakup bantuan yang sudah disepakati. Kebutuhan baru akan dibicarakan terpisah terlebih dahulu.</p>
      </div>
      <div className="careGrid">{CARE_PLANS.map((plan) => <article key={plan.name}><h3>{plan.name}</h3><strong>{plan.priceRange}</strong><p>{plan.outcome}</p></article>)}</div>
    </section>

    <footer className="footer shell"><span>QIRA · PT Rays Solusi Informasi</span><span>Mulai dari cerita · <Link href="/privasi">Privasi</Link></span></footer>
  </main>;
}
