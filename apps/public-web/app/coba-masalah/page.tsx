import type { Metadata } from "next";
import Link from "next/link";

import { PersonalizedDemo } from "../PersonalizedDemo";
import { ConversionTracker } from "../_components/ConversionTracker";

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
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "QIRA — bantu usaha jadi lebih mudah" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | QIRA`,
    description,
    images: ["/opengraph-image"],
  },
};

export default function ProblemExperiencePage() {
  return <main>
    <ConversionTracker event="story_start" />
    <nav className="nav shell"><Link className="brand" href="/">QIRA<span>.</span></Link></nav>
    <header className="subpageIntro shell">
      <p className="kicker">Mulai dari ceritamu</p>
      <h1>Tidak perlu tahu solusinya. Ceritakan saja yang bikin repot.</h1>
      <p>QIRA akan bertanya sedikit demi sedikit supaya masalahnya lebih mudah dipahami.</p>
    </header>
    <PersonalizedDemo />
    <footer className="footer shell"><span>QIRA · Kami pahami, lalu kami bantu.</span><span>Satu langkah setiap kali · <Link href="/privasi">Privasi</Link></span></footer>
  </main>;
}
