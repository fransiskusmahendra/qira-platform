import type { Metadata } from "next";
import Link from "next/link";

import { SERVICE_CATALOG } from "@qira/domain";
import { DiscoveryForm } from "./_components/DiscoveryForm";
import styles from "./discovery.module.css";

export const metadata: Metadata = {
  title: "Ceritakan Kebutuhan Usahamu",
  description: "Jawab satu pertanyaan setiap kali agar QIRA memahami kebutuhan usahamu dengan mudah.",
  robots: { index: false, follow: false },
};

export default async function DiscoveryPage({ searchParams }: { searchParams: Promise<{ context?: string }> }) {
  const { context } = await searchParams;
  const safeContext = typeof context === "string" ? context.slice(0, 80) : "";
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Kembali ke beranda QIRA">QIRA<span>.</span></Link>
        <div className={styles.previewBadge}>±2 menit</div>
      </header>

      <section className={styles.intro}>
        <p className={styles.eyebrow}>Sedikit lagi</p>
        <h1>Biar solusinya lebih pas.</h1>
        <p>{safeContext ? `Kebutuhan: ${safeContext}. ` : ""}Lengkapi kontak dan beberapa jawaban singkat. Setelah itu QIRA menindaklanjuti lewat WhatsApp.</p>
      </section>

      <DiscoveryForm services={SERVICE_CATALOG.map(({ id, name, outcome }) => ({ id, name, outcome }))} />

      <footer className={styles.footer}><span>QIRA · Solusi digital sederhana untuk bisnis</span></footer>
    </main>
  );
}
