import type { Metadata } from "next";
import Link from "next/link";

import { PersonalizedDemo } from "../PersonalizedDemo";

const title = "Ceritakan Masalah Usahamu";
const description = "Jawab beberapa pertanyaan sederhana agar QIRA memahami masalah usahamu dan membantu menentukan langkah berikutnya.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/coba-masalah" },
  openGraph: {
    title: `${title} | QIRA`,
    description,
    url: "/coba-masalah",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${title} | QIRA`,
    description,
  },
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
    <footer className="footer shell"><span>QIRA · Kami pahami, lalu kami bantu.</span><span>Satu langkah setiap kali.</span></footer>
  </main>;
}
