import Link from "next/link";

import { signInWithMagicLink } from "./actions";
import styles from "./login.module.css";

interface LoginPageProps {
  searchParams: Promise<{ sent?: string; error?: string; next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Link className={styles.brand} href="/">QIRA<span>.</span></Link>
        <p className={styles.kicker}>Masuk ke QIRA</p>
        <h1>Kami kirim tautan masuk ke email Anda.</h1>
        <p className={styles.copy}>Tidak perlu membuat atau mengingat password. Masukkan email yang terdaftar, lalu buka tautan yang kami kirim.</p>
        {query.sent === "1" && <p className={styles.success}>Tautan masuk sudah dikirim. Silakan periksa inbox email Anda.</p>}
        {query.error && <p className={styles.error}>Tautan belum dapat dikirim. Periksa alamat email lalu coba kembali.</p>}
        <form action={signInWithMagicLink}>
          <input name="next" type="hidden" value={query.next ?? "/workspace"} />
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required placeholder="nama@perusahaan.com" />
          <button type="submit">Kirim tautan masuk</button>
        </form>
        <small>Setelah masuk, Anda hanya akan melihat informasi yang memang ditujukan untuk akun Anda.</small>
      </section>
    </main>
  );
}
