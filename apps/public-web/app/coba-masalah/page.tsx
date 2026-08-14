import type { Metadata } from "next";
import Link from "next/link";

import { PersonalizedDemo } from "../PersonalizedDemo";

export const metadata: Metadata = { title: "Coba Masalah Bisnis", description: "Ceritakan proses manual dan lihat rekomendasi awal QIRA." };

export default function ProblemExperiencePage() {
  return <main>
    <nav className="nav shell"><Link className="brand" href="/">QIRA<span>.</span></Link><div className="navLinks"><Link href="/harga">Harga</Link><Link href="/contoh-penerapan">Cara Diterapkan</Link><Link className="navCta" href="/discovery">Discovery</Link></div></nav>
    <header className="subpageIntro shell"><p className="kicker">Langkah 1 · Kenali peluangnya</p><h1>Mulai dari satu masalah yang paling menghambat.</h1><p>Bagian ini hanya memberi rekomendasi singkat. Prototype yang lengkap dibuat setelah Discovery agar sesuai dengan data, role, workflow, dan aturan usaha Anda.</p></header>
    <PersonalizedDemo />
    <footer className="footer shell"><span>QIRA · Your Business, Understood.</span><Link href="/">Kembali ke beranda</Link></footer>
  </main>;
}
