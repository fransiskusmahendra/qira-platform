import Link from "next/link";
import styles from "./case-studies.module.css";

const cases = [
  {
    id: "kos", sector: "Kontrakan & kosan", packageName: "Growth Engine", duration: "2–4 minggu",
    before: "Pemilik mencatat unit, penyewa, dan tagihan di buku serta chat yang terpisah.",
    solution: "Dashboard okupansi, data penyewa, jatuh tempo, pengingat, dan daftar calon penyewa.",
    outcome: "Tagihan lebih mudah dipantau dan unit kosong dapat segera ditawarkan.",
    metric: "8 unit", metricLabel: "simulasi pengelolaan", business: "properti",
  },
  {
    id: "lead", sector: "Jasa & konsultasi", packageName: "Growth Engine", duration: "2–4 minggu",
    before: "Pertanyaan pelanggan masuk melalui WhatsApp, tetapi status follow-up tidak tercatat.",
    solution: "Landing page, form kebutuhan, pipeline prospek, penanggung jawab, dan status penawaran.",
    outcome: "Tidak ada prospek yang terlewat dan prioritas tindak lanjut terlihat jelas.",
    metric: "1 pipeline", metricLabel: "dari lead sampai deal", business: "jasa",
  },
  {
    id: "ternak", sector: "Peternakan", packageName: "Connected Growth", duration: "3–6 minggu",
    before: "Pakan, populasi, mortalitas, bobot, dan biaya per batch dicatat tidak konsisten.",
    solution: "Dashboard batch, stok pakan, kesehatan, biaya berjalan, alarm, dan proyeksi panen.",
    outcome: "Perubahan kondisi lebih cepat terdeteksi dan performa batch dapat dibandingkan.",
    metric: "5 indikator", metricLabel: "operasional utama", business: "ternak",
  },
  {
    id: "kebun", sector: "Perkebunan", packageName: "Connected Growth", duration: "3–6 minggu",
    before: "Jadwal per blok, penggunaan bahan, tenaga kerja, dan biaya sulit direkap.",
    solution: "Monitoring blok, kalender aktivitas, penyelesaian tugas, biaya, dan estimasi panen.",
    outcome: "Pekerjaan lapangan lebih teratur dan kesiapan panen dapat dipantau per blok.",
    metric: "3 blok", metricLabel: "dalam satu dashboard", business: "kebun",
  },
  {
    id: "tambak", sector: "Tambak", packageName: "Connected Growth", duration: "3–6 minggu",
    before: "Kualitas air, pakan, pertumbuhan, dan biaya tidak memberikan peringatan yang cepat.",
    solution: "Monitoring kolam, pH, DO, pakan, survival rate, biaya, dan estimasi hasil.",
    outcome: "Risiko operasional lebih cepat terlihat dan keputusan harian lebih terukur.",
    metric: "1 siklus", metricLabel: "terpantau menyeluruh", business: "tambak",
  },
  {
    id: "website", sector: "UMKM umum", packageName: "Digital Foundation", duration: "1–2 minggu",
    before: "Informasi usaha harus dijelaskan berulang kali dan sulit ditemukan calon pelanggan.",
    solution: "Website responsif, profil usaha, layanan, galeri, lokasi, dan CTA WhatsApp.",
    outcome: "Usaha terlihat profesional dan informasi dapat diakses pelanggan selama 24 jam.",
    metric: "24/7", metricLabel: "informasi tersedia", business: "umkm",
  },
] as const;

export default function CaseStudiesPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link className={styles.brand} href="/">QIRA<span>.</span></Link>
        <div><Link href="/demo-usaha">Demo Usaha</Link><Link className={styles.navCta} href="/start">Konsultasi</Link></div>
      </nav>

      <header className={styles.hero}>
        <div className={styles.badge}><i>◇</i><span><b>Concept case studies</b>Data dan dampak di bawah merupakan simulasi, bukan klaim pelanggan.</span></div>
        <p>Contoh penerapan QIRA</p>
        <h1>Dari proses manual menuju alur kerja yang <em>lebih jelas.</em></h1>
        <span>Gunakan contoh ini untuk memahami bentuk solusi yang mungkin diterapkan. Setiap proyek tetap dimulai dengan discovery agar fitur, waktu, dan hasil sesuai kondisi usaha sebenarnya.</span>
      </header>

      <section className={styles.grid} aria-label="Contoh penerapan solusi QIRA">
        {cases.map((item, index) => (
          <article key={item.id} className={styles.card}>
            <div className={styles.cardTop}><span>0{index + 1}</span><small>{item.packageName}</small></div>
            <h2>{item.sector}</h2>
            <div className={styles.metric}><strong>{item.metric}</strong><span>{item.metricLabel}</span></div>
            <dl>
              <div><dt>Sebelum</dt><dd>{item.before}</dd></div>
              <div><dt>Solusi QIRA</dt><dd>{item.solution}</dd></div>
              <div><dt>Dampak yang dituju</dt><dd>{item.outcome}</dd></div>
            </dl>
            <div className={styles.cardBottom}><span>Estimasi {item.duration}</span><Link href={item.business === "umkm" || item.business === "jasa" ? "/#demo" : "/demo-usaha"}>Lihat demo <b>↗</b></Link></div>
          </article>
        ))}
      </section>

      <section className={styles.method}>
        <div><p>Bagaimana contoh menjadi proyek nyata?</p><h2>Simulasi memberi gambaran. Discovery menentukan solusi.</h2></div>
        <ol><li><b>01</b><span><strong>Pahami kondisi</strong>Proses, pengguna, data, masalah, dan anggaran.</span></li><li><b>02</b><span><strong>Validasi demo</strong>Fitur prioritas diuji melalui gambaran solusi.</span></li><li><b>03</b><span><strong>Sepakati scope</strong>Hasil, waktu, harga, dan batas proyek ditulis jelas.</span></li></ol>
        <Link href="/start">Ceritakan proses usaha Anda</Link>
      </section>

      <footer className={styles.footer}><span>QIRA · PT Rays Solusi Informasi</span><Link href="/">Kembali ke beranda</Link></footer>
    </main>
  );
}
