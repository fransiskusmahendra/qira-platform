import type { Metadata } from "next";
import Link from "next/link";

import { SERVICE_CATALOG } from "@qira/domain";
import { DiscoveryForm } from "./_components/DiscoveryForm";
import styles from "./discovery.module.css";

export const metadata: Metadata = {
  title: "Discovery Workspace",
  description: "Mulai Discovery terstruktur untuk kebutuhan AI, otomasi, atau aplikasi bisnis Anda.",
};

export default function DiscoveryPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Kembali ke beranda QIRA">
          QIRA<span>.</span>
        </Link>
        <div className={styles.previewBadge}>Aman · tanpa login</div>
      </header>

      <section className={styles.intro}>
        <p className={styles.eyebrow}>AI & Digital Discovery</p>
        <h1>Mari pahami proses yang paling penting untuk bisnis Anda.</h1>
        <p>
          Pilih kebutuhan utama dan ceritakan kondisi saat ini. Setelah dikirim, Anda
          langsung memperoleh proposal, demo, dan estimasi harga awal. Estimasi pengisian 10–15 menit.
        </p>
      </section>

      <DiscoveryForm services={SERVICE_CATALOG.map(({ id, name, outcome }) => ({ id, name, outcome }))} />

      <footer className={styles.footer}>
        <span>QIRA · PT Rays Solusi Informasi</span>
        <span>Jawaban hanya dikirim setelah Anda menekan tombol Kirim Discovery.</span>
      </footer>
    </main>
  );
}
