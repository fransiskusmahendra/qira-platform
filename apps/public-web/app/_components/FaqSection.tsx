import styles from "./FaqSection.module.css";

const FAQS = [
  {
    q: "Berapa lama proses pembuatan website atau sistem di QIRA?",
    a: "Rata-rata pengerjaan berkisar antara 1 hingga 3 minggu tergantung skala kebutuhan bisnis Anda. Untuk website UMKM dan profil usaha (Paket Sederhana), waktu penyelesaian sekitar 1–2 minggu. Jadwal dan ruang lingkup disepakati secara transparan sebelum pekerjaan dimulai.",
  },
  {
    q: "Apakah ada biaya langganan bulanan yang mahal?",
    a: "Tidak ada biaya wajib bulanan yang membengkak. QIRA membangun solusi dengan arsitektur yang efisien dan mandiri, sehingga Anda tidak dibebani biaya lisensi software mahal yang sering tidak terpakai.",
  },
  {
    q: "Bagaimana jika saya atau tim saya tidak paham teknis (gaptek)?",
    a: "QIRA dirancang khusus untuk pemilik usaha nyata. Semua antarmuka form, website, atau dashboard dibuat sangat mudah dipahami, semudah Anda mengetik pesan di WhatsApp. Kami juga menyertakan panduan pemakaian yang jelas tanpa istilah rumit.",
  },
  {
    q: "Apakah data pelanggan dan transaksi usaha saya aman?",
    a: "Sangat aman. Kami menerapkan enkripsi data dan standar pelindungan privasi sesuai peraturan perundang-undangan (UU PDP). Informasi sensitif klien tidak akan pernah kami jadikan materi publik atau promosi tanpa izin tertulis dari Anda.",
  },
  {
    q: "Bagaimana jika setelah sistem jadi ada kendala atau ingin ada perubahan?",
    a: "Setiap paket yang kami sediakan sudah termasuk garansi revisi dan masa pendampingan langsung (hingga 30 hari). Jika di kemudian hari bisnis Anda berkembang dan ingin menambah fitur baru, sistem dapat di-upgrade secara bertahap.",
  },
] as const;

export function FaqSection() {
  return (
    <section className={`shell ${styles.faqSection}`} id="faq" aria-label="Pertanyaan yang sering diajukan">
      <div className={styles.faqHeader}>
        <p className={styles.kicker}>Pertanyaan Umum</p>
        <h2 className={styles.heading}>Hal yang sering ditanyakan sebelum memulai.</h2>
        <p className={styles.lead}>
          Kami mengutamakan transparansi agar Anda yakin bahwa langkah digital yang diambil benar-benar masuk akal untuk bisnis Anda.
        </p>
      </div>

      <div className={styles.faqList}>
        {FAQS.map((faq, index) => (
          <details className={styles.faqItem} key={index} open={index === 0}>
            <summary className={styles.faqSummary}>
              <span>{faq.q}</span>
              <span className={styles.chevronIcon} aria-hidden="true">↓</span>
            </summary>
            <p className={styles.faqAnswer}>{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
