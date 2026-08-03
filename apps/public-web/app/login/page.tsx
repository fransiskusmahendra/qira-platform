import Link from "next/link";

import { signInWithMagicLink } from "./actions";
import styles from "./login.module.css";

interface LoginPageProps {
  searchParams: Promise<{ sent?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Link className={styles.brand} href="/">QIRA<span>.</span></Link>
        <p className={styles.kicker}>Workspace aman</p>
        <h1>Masuk tanpa password.</h1>
        <p className={styles.copy}>Kami akan mengirim magic link ke email Anda. Akses data tetap dibatasi berdasarkan organisasi dan peran.</p>
        {query.sent === "1" && <p className={styles.success}>Magic link sudah dikirim. Silakan periksa inbox Anda.</p>}
        {query.error && <p className={styles.error}>Link belum dapat dikirim. Periksa email dan coba kembali.</p>}
        <form action={signInWithMagicLink}>
          <label htmlFor="email">Email kerja</label>
          <input id="email" name="email" type="email" autoComplete="email" required placeholder="nama@perusahaan.com" />
          <button type="submit">Kirim magic link</button>
        </form>
        <small>Dengan masuk, Anda hanya dapat melihat workspace yang terhubung dengan akun Anda.</small>
      </section>
    </main>
  );
}
