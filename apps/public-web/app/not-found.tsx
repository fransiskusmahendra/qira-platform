import Link from "next/link";

export default function NotFound() {
  return (
    <main className="notFound shell">
      <p className="kicker">404</p>
      <h1>Halaman ini belum tersedia.</h1>
      <Link className="primaryButton" href="/">Kembali ke beranda</Link>
    </main>
  );
}

