import type { Metadata } from "next";
import Link from "next/link";

import { SERVICE_CATALOG } from "@qira/domain";
import { DiscoveryForm } from "./_components/DiscoveryForm";
import styles from "./discovery.module.css";

export const metadata: Metadata = {
  title: "Ceritakan Kebutuhan Usahamu",
  description: "Jawab satu pertanyaan setiap kali agar QIRA memahami kebutuhan usahamu dengan mudah.",
};

export default function DiscoveryPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Kembali ke beranda QIRA">QIRA<span>.</span></Link>
        <div className={styles.previewBadge}>Satu pertanyaan setiap kali</div>
      </header>

      <section className={styles.intro}>
        <p className={styles.eyebrow}>Bagian 2 dari 2</p>
        <h1>Sekarang kami ingin memahami sedikit lebih dalam.</h1>
        <p>Jawab dengan bahasa sehari-hari. Tidak perlu tahu nama fitur, jenis aplikasi, atau istilah teknologi.</p>
      </section>

      <DiscoveryForm services={SERVICE_CATALOG.map(({ id, name, outcome }) => ({ id, name, outcome }))} />

      <footer className={styles.footer}>
        <span>QIRA · PT Rays Solusi Informasi</span>
        <span>Jawaban baru dikirim saat Anda menekan tombol kirim.</span>
      </footer>
    </main>
  );
}
