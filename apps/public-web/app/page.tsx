import Link from "next/link";

export default function HomePage() {
  return <main>
    <nav className="nav shell" aria-label="Navigasi utama">
      <Link className="brand" href="/">QIRA<span>.</span></Link>
    </nav>

    <section className="simpleHero shell">
      <div className="eyebrow">Your Business, Understood.</div>
      <h1>Dari proses manual menjadi sistem yang <em>benar-benar digunakan.</em></h1>
      <p>QIRA memahami cara kerja bisnis Anda, menyiapkan prototype yang dapat dicoba, lalu mengubahnya menjadi aplikasi produksi tanpa merancang ulang dari awal.</p>
      <Link className="primaryButton" href="/coba-masalah">Temukan solusi untuk bisnis Anda</Link>
    </section>

    <section className="simpleProcess shell"><p className="kicker">Satu alur yang jelas</p><h2>Discovery → Prototype → Scope final → Development → UAT → Go Live.</h2><p>QIRA akan memandu Anda tahap demi tahap. Setelah Discovery, Anda menerima prototype personal, proposal awal, dan harga indikatif.</p></section>
    <footer className="footer shell"><span>QIRA · PT Rays Solusi Informasi</span><span>Jakarta, Indonesia</span></footer>
  </main>;
}
