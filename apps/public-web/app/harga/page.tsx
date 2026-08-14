import { CARE_PLANS, PROPOSAL_PACKAGES } from "@qira/domain";
import type { Metadata } from "next";
import Link from "next/link";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
export const metadata: Metadata = { title: "Harga & Paket", description: "Paket, cakupan, durasi, dan harga awal layanan QIRA." };

export default function PricingPage() {
  return <main>
    <nav className="nav shell"><Link className="brand" href="/">QIRA<span>.</span></Link><div className="navLinks"><Link href="/coba-masalah">Temukan Solusi</Link><Link href="/contoh-penerapan">Cara QIRA Membantu</Link><Link className="navCta" href="/discovery">Discovery</Link></div></nav>
    <header className="subpageIntro shell"><p className="kicker">Harga perkenalan QIRA</p><h1>Pilih tingkat solusi, bukan daftar fitur yang membingungkan.</h1><p>Harga final mengikuti prototype dan scope yang disepakati setelah Discovery.</p></header>
    <section className="packages shell"><div className="packageGrid">{PROPOSAL_PACKAGES.map((item) => <article className="packageCard" key={item.id}><p className="packageLabel">Proyek portofolio terbatas</p><h3>{item.name}</h3><p className="packageTagline">{item.tagline}</p><div className="packagePrice"><span>{item.priceLabel}</span><strong>{rupiah.format(item.introductoryPriceIdr)}</strong></div><ul>{item.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}</ul><div className="packageMeta"><span>{item.durationWeeks[0]}–{item.durationWeeks[1]} minggu</span><span>{item.revisions}x revisi</span><span>{item.supportDays} hari dukungan awal</span></div></article>)}</div><div className="packageCta"><Link className="primaryButton" href="/discovery">Tentukan paket melalui Discovery</Link></div><p className="pricingNote">Domain, hosting, layanan pihak ketiga, integrasi berbayar, dan perubahan di luar scope tidak termasuk kecuali tertulis dalam proposal final.</p></section>
    <section className="care shell"><div className="sectionHeading"><div><p className="kicker">Managed by QIRA</p><h2>Dukungan setelah Go Live bersifat opsional.</h2></div><p>Subscription hanya mencakup dukungan dalam scope paket. Fitur baru menggunakan quotation terpisah.</p></div><div className="careGrid">{CARE_PLANS.map((plan) => <article key={plan.name}><h3>{plan.name}</h3><strong>{plan.priceRange}</strong><p>{plan.outcome}</p></article>)}</div></section>
    <footer className="footer shell"><span>QIRA · PT Rays Solusi Informasi</span><Link href="/">Kembali ke beranda</Link></footer>
  </main>;
}
