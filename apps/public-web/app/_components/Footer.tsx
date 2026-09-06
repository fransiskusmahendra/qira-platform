import Link from "next/link";
import styles from "./Footer.module.css";
import { ContextualWhatsAppCta } from "./ContextualWhatsAppCta";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="shell">
        <div className={styles.footerGrid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <Link className={styles.brand} href="/" aria-label="QIRA — Beranda">
              QIRA<span>.</span>
            </Link>
            <p className={styles.brandTagline}>
              Solusi digital sederhana untuk bisnis. Membantu usaha lebih mudah ditemukan, kerja lebih rapi, dan tugas berjalan otomatis.
            </p>
            <div className={styles.trustBadge}>
              <span>✓</span> Tanpa istilah rumit · Mulai dari masalah nyata
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <p className={styles.colTitle}>Solusi & Produk</p>
            <ul className={styles.linkList}>
              <li><Link href="/layanan">Semua Layanan</Link></li>
              <li><Link href="/harga">Harga & Paket</Link></li>
              <li><Link href="/portfolio">Portofolio Aplikasi</Link></li>
              <li><Link href="/contoh-penerapan">Contoh Penerapan</Link></li>
              <li><Link href="/solusi/website-umkm">Website Usaha</Link></li>
              <li><Link href="/solusi/automation-bisnis">Otomatisasi Bisnis</Link></li>
            </ul>
          </div>

          {/* Learning Column */}
          <div>
            <p className={styles.colTitle}>Pelajari Dulu</p>
            <ul className={styles.linkList}>
              <li><Link href="/cara-kerja">Cara Kerja Kami</Link></li>
              <li><Link href="/studi-kasus">Studi Kasus Nyata</Link></li>
              <li><Link href="/panduan">Panduan Bisnis</Link></li>
              <li><Link href="/untuk/usaha-jasa">Untuk Usaha Jasa</Link></li>
              <li><Link href="/untuk/retail-umkm">Untuk Retail & UMKM</Link></li>
              <li><Link href="/untuk/administrasi-tim">Untuk Administrasi Tim</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <p className={styles.colTitle}>Konsultasi & Kontak</p>
            <ul className={styles.linkList}>
              <li><Link href="/about">Tentang QIRA</Link></li>
              <li><Link href="/coba-masalah">Pemetaan Kebutuhan (Form)</Link></li>
              <li><ContextualWhatsAppCta context="tanya langsung ke tim QIRA">Tanya via WhatsApp</ContextualWhatsAppCta></li>
              <li><Link href="/privasi">Kebijakan Privasi</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <span>© 2026 QIRA · Solusi digital sederhana untuk bisnis.</span>
          <div className={styles.bottomLinks}>
            <Link href="/privasi">Privasi</Link>
            <Link href="/about">Tentang</Link>
            <Link href="/coba-masalah">Mulai</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
