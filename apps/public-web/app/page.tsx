import Link from "next/link";

const workFlow = [
  { number: "01", title: "Cerita dulu", text: "Kamu ceritakan proses yang masih ribet atau makan waktu." },
  { number: "02", title: "Kami pahami", text: "QIRA mencari bagian yang paling penting untuk dibenahi." },
  { number: "03", title: "Coba contohnya", text: "Kamu mendapat prototype yang bisa langsung dicoba." },
  { number: "04", title: "Kami bangun", text: "Setelah cocok, prototype dilanjutkan menjadi aplikasi." },
  { number: "05", title: "Siap dipakai", text: "Kami tes bersama sampai sistem benar-benar siap digunakan." },
];

export default function HomePage() {
  return <main>
    <nav className="nav shell" aria-label="Navigasi utama">
      <Link className="brand" href="/">QIRA<span>.</span></Link>
    </nav>

    <section className="simpleHero shell">
      <div className="eyebrow">Your Business, Understood.</div>
      <h1>Punya proses yang masih ribet? <em>Biar QIRA yang rapikan.</em></h1>
      <p>Ceritakan cara kerja bisnismu. Kami bikin contoh yang bisa dicoba, lalu lanjut jadi aplikasi yang siap dipakai.</p>
      <Link className="primaryButton" href="/coba-masalah">Coba ceritakan masalahmu</Link>
    </section>

    <section className="animatedFlow shell" aria-labelledby="flow-title">
      <div className="flowHeading">
        <p className="kicker">Caranya simpel</p>
        <h2 id="flow-title">Dari cerita sampai jadi aplikasi.</h2>
        <p>Kamu tidak perlu tahu istilah teknis. Ceritakan saja yang ingin dibuat lebih mudah—QIRA bantu langkah berikutnya.</p>
      </div>
      <div className="flowTrack">
        <div className="flowLine" aria-hidden="true"><span /></div>
        {workFlow.map((step, index) => (
          <article className="flowStep" style={{ "--step": index } as React.CSSProperties} key={step.number}>
            <span className="flowDot" aria-hidden="true">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>

    <footer className="footer shell"><span>QIRA · PT Rays Solusi Informasi</span><span>Jakarta, Indonesia</span></footer>
  </main>;
}
