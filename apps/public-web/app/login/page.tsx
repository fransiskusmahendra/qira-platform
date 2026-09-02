import type { Metadata } from "next";
import Link from "next/link";

import { signInWithMagicLink } from "./actions";
import styles from "./login.module.css";

export const metadata: Metadata = {
  title: "Masuk",
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: Promise<{ sent?: string; error?: string; next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;
  const errorMessage = query.error === "confirm"
    ? "Tautan sudah tidak berlaku. Kirim tautan baru."
    : "Belum berhasil. Periksa email lalu coba lagi.";

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Link className={styles.brand} href="/">QIRA<span>.</span></Link>
        <p className={styles.kicker}>Masuk</p>
        <h1>Masuk lewat email.</h1>
        <p className={styles.copy}>Kami kirim tautan aman. Tidak ada password.</p>
        {query.sent === "1" && <p className={styles.success}>Cek inbox email Anda.</p>}
        {query.error && <p className={styles.error}>{errorMessage}</p>}
        <form action={signInWithMagicLink}>
          <input name="next" type="hidden" value={query.next ?? "/workspace"} />
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required placeholder="nama@perusahaan.com" />
          <button type="submit">Kirim tautan</button>
        </form>
        <small>Hanya akun yang memiliki akses QIRA.</small>
      </section>
    </main>
  );
}
