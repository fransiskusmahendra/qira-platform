import type { CSSProperties } from "react";
import Link from "next/link";

const FLOW_STEPS = [
  { title: "Ceritakan satu masalah", copy: "Mulai dari bagian usaha yang paling terasa ribet atau memakan waktu." },
  { title: "QIRA menangkap polanya", copy: "Kami bantu merangkum apa yang sebenarnya membuat pekerjaan terasa berat." },
  { title: "Lengkapi sedikit konteks", copy: "Beberapa pertanyaan sederhana membantu kami memahami kondisi usaha Anda." },
  { title: "Lihat arah yang disarankan", copy: "Anda mendapat gambaran awal tentang hal yang paling masuk akal untuk dirapikan." },
  { title: "Baru tentukan langkah berikutnya", copy: "Kalau terasa relevan, barulah kita bahas apa yang perlu dibuat dan berapa biayanya." },
] as const;

export default function HomePage() {
  return <main>
    <nav className="nav shell" aria-label="Navigasi utama">
      <Link className="brand" href="/">QIRA<span>.</span></Link>
      <Link className="navCta" href="/harga">Lihat harga awal</Link>
    </nav>

    <section className="simpleHero shell">
      <div className="eyebrow">QIRA · bantu usaha jadi lebih mudah</div>
      <h1>Ada bagian dari usaha yang terasa <em>ribet setiap hari?</em></h1>
      <p>Ceritakan satu hal yang paling merepotkan. Tidak perlu tahu harus dibuat aplikasi seperti apa. QIRA akan membantu memahami masalahnya dulu.</p>
      <Link className="primaryButton" href="/coba-masalah">Mulai dari ceritamu</Link>
      <div className="trustRow" aria-label="Yang perlu diketahui sebelum mulai">
        <span>Tidak perlu paham teknologi</span>
        <span>Tidak ada pembayaran saat bercerita</span>
        <span>Jawaban Anda tidak ditampilkan ke publik</span>
      </div>
    </section>

    <section className="animatedFlow shell" aria-labelledby="story-title">
      <div className="flowHeading">
        <p className="kicker">Mulai pelan-pelan</p>
        <h2 id="story-title">Satu cerita dulu. Langkah berikutnya kami bantu.</h2>
        <p>Kamu cukup menjawab pertanyaan sederhana. Kami tidak akan meminta kamu memahami istilah teknologi.</p>
      </div>
      <div className="flowTrack">
        <div className="flowLine" aria-hidden="true"><span /></div>
        {FLOW_STEPS.map((step, index) => <article className="flowStep" key={step.title} style={{ "--step": index } as CSSProperties}>
          <div className="flowDot">{String(index + 1).padStart(2, "0")}</div>
          <h3>{step.title}</h3>
          <p>{step.copy}</p>
        </article>)}
      </div>
    </section>

    <footer className="footer shell"><span>QIRA · PT Rays Solusi Informasi</span><Link href="/harga">Harga awal & dukungan</Link></footer>
  </main>;
}
