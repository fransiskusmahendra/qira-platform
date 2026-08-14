import type { Metadata } from "next";
import Link from "next/link";

import { PersonalizedDemo } from "../PersonalizedDemo";

export const metadata: Metadata = { title: "Temukan Solusi Bisnis", description: "Ceritakan proses manual dan lihat arah solusi awal dari QIRA." };

export default function ProblemExperiencePage() {
  return <main>
    <nav className="nav shell"><Link className="brand" href="/">QIRA<span>.</span></Link></nav>
    <header className="subpageIntro shell"><p className="kicker">Langkah 1 · Kenali peluangnya</p><h1>Mulai dari satu masalah yang paling menghambat.</h1><p>Bagian ini hanya memberi rekomendasi singkat. Prototype yang lengkap dibuat setelah Discovery agar sesuai dengan data, role, workflow, dan aturan usaha Anda.</p></header>
    <PersonalizedDemo />
    <footer className="footer shell"><span>QIRA · Your Business, Understood.</span><span>Langkah berikutnya: cara QIRA membantu</span></footer>
  </main>;
}
