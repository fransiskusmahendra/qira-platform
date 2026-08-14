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
    id: "rental", sector: "Rental kendaraan", packageName: "Growth Engine", duration: "2–4 minggu",
    before: "Booking masuk melalui chat, ketersediaan armada mudah bentrok, dan jadwal servis belum terpusat.",
    solution: "Katalog armada, kalender booking, status kendaraan, pembayaran, dan pengingat pengembalian.",
    outcome: "Armada lebih mudah dialokasikan dan setiap transaksi memiliki status yang jelas.",
    metric: "12 armada", metricLabel: "booking dan status terpantau", business: "rental",
  },
  {
    id: "laundry", sector: "Laundry", packageName: "Growth Engine", duration: "2–4 minggu",
    before: "Nota, berat cucian, status proses, pembayaran, dan pemberitahuan pelanggan dicatat terpisah.",
    solution: "Order digital, status cucian, nota otomatis, rekap pembayaran, dan notifikasi selesai.",
    outcome: "Order tidak tertukar dan pelanggan mengetahui kapan cucian siap diambil.",
    metric: "4 tahap", metricLabel: "dari terima sampai selesai", business: "laundry",
  },
  {
    id: "catering", sector: "Kuliner & katering", packageName: "Growth Engine", duration: "2–4 minggu",
    before: "Pesanan dari banyak percakapan rawan terlewat dan jadwal produksi sulit dirangkum.",
    solution: "Katalog digital, form pesanan, jadwal produksi, pembayaran, dan status pengiriman.",
    outcome: "Pesanan lebih rapi dan kebutuhan produksi dapat dipersiapkan lebih awal.",
    metric: "1 kalender", metricLabel: "pesanan dan produksi", business: "katering",
  },
  {
    id: "salon", sector: "Salon & kecantikan", packageName: "Growth Engine", duration: "2–4 minggu",
    before: "Reservasi, pilihan layanan, staf, dan pengingat kunjungan dikelola melalui chat manual.",
    solution: "Daftar layanan, reservasi online, kalender staf, data pelanggan, dan pengingat jadwal.",
    outcome: "Jadwal lebih tertata dan slot kosong lebih mudah ditawarkan.",
    metric: "24/7", metricLabel: "reservasi dapat masuk", business: "salon",
  },
] as const;

export default function CaseStudiesPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link className={styles.brand} href="/">QIRA<span>.</span></Link>
        <div><Link href="/coba-masalah">Temukan Solusi</Link><Link href="/harga">Harga</Link><Link className={styles.navCta} href="/discovery">Discovery</Link></div>
      </nav>

      <header className={styles.hero}>
        <div className={styles.badge}><i>◇</i><span><b>Concept case studies</b>Data dan dampak di bawah merupakan simulasi, bukan klaim pelanggan.</span></div>
        <p>Cara QIRA membantu</p>
        <h1>QIRA memahami masalah bisnis, lalu membantu membuat prosesnya <em>lebih jelas.</em></h1>
        <span>Lihat bagaimana QIRA dapat membantu berbagai jenis usaha. Setiap solusi tetap dimulai dengan Discovery agar demo, fitur, waktu, dan hasilnya sesuai kebutuhan bisnis sebenarnya.</span>
      </header>

      <section className={styles.grid} aria-label="Contoh cara QIRA membantu bisnis">
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
            <div className={styles.cardBottom}><span>Estimasi {item.duration}</span></div>
          </article>
        ))}
      </section>

      <section className={styles.method}>
        <div><p>Bagaimana contoh menjadi proyek nyata?</p><h2>Simulasi memberi gambaran. Discovery menentukan solusi.</h2></div>
        <ol><li><b>01</b><span><strong>Pahami kondisi</strong>Proses, pengguna, data, masalah, dan anggaran.</span></li><li><b>02</b><span><strong>Validasi demo</strong>Fitur prioritas diuji melalui gambaran solusi.</span></li><li><b>03</b><span><strong>Sepakati scope</strong>Hasil, waktu, harga, dan batas proyek ditulis jelas.</span></li></ol>
        <Link href="/discovery">Ceritakan proses usaha Anda</Link>
      </section>

      <footer className={styles.footer}><span>QIRA · PT Rays Solusi Informasi</span><Link href="/">Kembali ke beranda</Link></footer>
    </main>
  );
}
