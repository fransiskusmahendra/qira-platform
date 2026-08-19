import type { Metadata } from "next";
import Link from "next/link";

import { PersonalizedDemo } from "../PersonalizedDemo";

export const metadata: Metadata = {
  title: "Ceritakan Masalah Usahamu",
  description: "Jawab beberapa pertanyaan sederhana agar QIRA memahami masalah usahamu.",
};

export default function ProblemExperiencePage() {
  return <main>
    <nav className="nav shell"><Link className="brand" href="/">QIRA<span>.</span></Link></nav>
    <header className="subpageIntro shell">
      <p className="kicker">Mulai dari ceritamu</p>
      <h1>Tidak perlu tahu solusinya. Ceritakan saja yang bikin repot.</h1>
      <p>QIRA akan bertanya sedikit demi sedikit supaya masalahnya lebih mudah dipahami.</p>
    </header>
    <PersonalizedDemo />
    <footer className="footer shell"><span>QIRA · Your Business, Understood.</span><span>Satu langkah setiap kali.</span></footer>
  </main>;
}
