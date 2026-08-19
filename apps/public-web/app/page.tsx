import Link from "next/link";

export default function HomePage() {
  return <main>
    <nav className="nav shell" aria-label="Navigasi utama">
      <Link className="brand" href="/">QIRA<span>.</span></Link>
    </nav>

    <section className="simpleHero shell">
      <div className="eyebrow">QIRA · bantu usaha jadi lebih mudah</div>
      <h1>Ada bagian dari usaha yang terasa <em>ribet setiap hari?</em></h1>
      <p>Ceritakan satu hal yang paling merepotkan. Tidak perlu tahu harus dibuat aplikasi seperti apa. QIRA akan membantu memahami masalahnya dulu.</p>
      <Link className="primaryButton" href="/coba-masalah">Mulai dari ceritamu</Link>
    </section>

    <section className="animatedFlow shell" aria-labelledby="story-title">
      <div className="flowHeading">
        <p className="kicker">Mulai pelan-pelan</p>
        <h2 id="story-title">Satu cerita dulu. Langkah berikutnya kami bantu.</h2>
        <p>Kamu cukup menjawab pertanyaan sederhana. Kami tidak akan meminta kamu memahami istilah teknologi.</p>
      </div>
    </section>

    <footer className="footer shell"><span>QIRA · PT Rays Solusi Informasi</span><span>Jakarta, Indonesia</span></footer>
  </main>;
}
