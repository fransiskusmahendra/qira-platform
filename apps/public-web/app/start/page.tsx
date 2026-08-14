import Link from "next/link";
import { StartForm } from "./StartForm";
import styles from "./start.module.css";

const validPackages = new Set(["digital-foundation", "growth-engine", "connected-growth", "custom"]);
const businessNeeds: Record<string, string> = {
  properti: "Saya mengelola kontrakan atau kosan dan membutuhkan pencatatan unit, penyewa, tagihan bulanan, serta calon penyewa dalam satu dashboard.",
  ternak: "Saya menjalankan usaha peternakan dan membutuhkan pencatatan populasi, pakan, kesehatan ternak, biaya, dan jadwal panen.",
  kebun: "Saya menjalankan usaha perkebunan dan membutuhkan monitoring blok tanam, pemupukan, tenaga kerja, biaya, serta proyeksi panen.",
  tambak: "Saya mengelola usaha tambak dan membutuhkan monitoring kolam, kualitas air, pakan, pertumbuhan, biaya, serta estimasi panen.",
};

export default async function StartPage({ searchParams }: { searchParams: Promise<{ package?: string; business?: string; need?: string }> }) {
  const params = await searchParams;
  const selected = params.package && validPackages.has(params.package) ? params.package : "digital-foundation";
  const suppliedNeed = typeof params.need === "string" ? params.need.trim().slice(0, 500) : "";
  const defaultNeed = suppliedNeed || (params.business ? businessNeeds[params.business] ?? "" : "");
  return (
    <main className={styles.page}>
      <nav className={styles.nav}><Link href="/">QIRA<span>.</span></Link><small>Konsultasi awal gratis</small></nav>
      <section className={styles.layout}>
        <div className={styles.intro}>
          <p>Konsultasi awal</p>
          <h1>Ceritakan satu proses yang ingin Anda perbaiki.</h1>
          <span>QIRA akan membaca kebutuhan Anda terlebih dahulu, lalu menghubungi Anda untuk discovery singkat. Belum ada komitmen biaya pada tahap ini.</span>
          <div className={styles.steps}><div><b>01</b>Isi kebutuhan singkat</div><div><b>02</b>Discovery bersama QIRA</div><div><b>03</b>Demo dan proposal sesuai scope</div></div>
        </div>
        <StartForm defaultPackage={selected} defaultNeed={defaultNeed} />
      </section>
      <footer className={styles.footer}><span>QIRA · PT Rays Solusi Informasi</span><span>Jakarta, Indonesia</span></footer>
    </main>
  );
}
