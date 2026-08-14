import Link from "next/link";

export default function HomePage() {
  return <main>
    <nav className="nav shell" aria-label="Navigasi utama">
      <Link className="brand" href="/">QIRA<span>.</span></Link>
      <div className="navLinks"><Link href="/coba-masalah">Temukan Solusi</Link><Link href="/harga">Harga</Link><Link href="/contoh-penerapan">Cara QIRA Membantu</Link><Link className="navCta" href="/discovery">Discovery</Link></div>
    </nav>

    <section className="simpleHero shell">
      <div className="eyebrow">Your Business, Understood.</div>
      <h1>Dari proses manual menjadi sistem yang <em>benar-benar digunakan.</em></h1>
      <p>QIRA memahami cara kerja bisnis Anda, menyiapkan prototype yang dapat dicoba, lalu mengubahnya menjadi aplikasi produksi tanpa merancang ulang dari awal.</p>
      <Link className="primaryButton" href="/coba-masalah">Temukan solusi untuk bisnis Anda</Link>
    </section>

    <section className="entryGrid shell" aria-label="Jalur mengenal QIRA">
      <Link href="/coba-masalah"><span>01</span><h2>Temukan Solusi</h2><p>Ceritakan proses yang masih manual dan lihat arah solusi awal.</p></Link>
      <Link href="/harga"><span>02</span><h2>Harga & Paket</h2><p>Bandingkan hasil, durasi, cakupan, dan investasi awal.</p></Link>
      <Link href="/contoh-penerapan"><span>03</span><h2>Cara QIRA Membantu</h2><p>Lihat bagaimana QIRA membantu membuat proses bisnis lebih jelas dan teratur.</p></Link>
    </section>

    <section className="simpleProcess shell"><p className="kicker">Satu alur yang jelas</p><h2>Discovery → Prototype → Scope final → Development → UAT → Go Live.</h2><p>Setelah Discovery, Anda menerima prototype personal, proposal awal, dan harga indikatif. Prototype yang disetujui menjadi baseline hasil akhir.</p><Link className="primaryButton" href="/discovery">Mulai Discovery</Link></section>
    <footer className="footer shell"><span>QIRA · PT Rays Solusi Informasi</span><span>Jakarta, Indonesia</span></footer>
  </main>;
}
