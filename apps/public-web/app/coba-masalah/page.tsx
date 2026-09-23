import type { Metadata } from "next";
import Image from "next/image";

import { PersonalizedDemo } from "../PersonalizedDemo";
import { ConversionTracker } from "../_components/ConversionTracker";
import { SubpageBackground } from "../_components/SubpageBackground";
import styles from "../SubpageVisual.module.css";
import { Navbar } from "../_components/Navbar";
import { Footer } from "../_components/Footer";

const title = "Ceritakan Masalah Usahamu";
const description = "Ceritakan satu masalah yang paling merepotkan. QIRA membantu memetakan kebutuhan tanpa istilah teknis atau penjelasan yang rumit.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/coba-masalah" },
  openGraph: { title: `${title} | QIRA`, description, url: "/coba-masalah", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "QIRA — mulai dari masalah bisnis" }] },
  twitter: { card: "summary_large_image", title: `${title} | QIRA`, description, images: ["/opengraph-image"] },
};

export default function ProblemExperiencePage() {
  return (
    <>
      <Navbar />
      <main style={{ position: "relative" }}>
        <SubpageBackground />
        <ConversionTracker event="story_start" />

        <section className={`${styles.hero} shell`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">Mulai dari Masalah</p>
            <h1>Ceritakan hal yang paling merepotkan.</h1>
            <p>Jawab empat pertanyaan sederhana dalam sekitar 2 menit. Kami bantu petakan arah solusi digital yang paling masuk akal.</p>
          </div>
          <figure className={styles.heroVisual}>
            <Image
              src="/illustrations/premium/qira-problem-premium.webp"
              alt="Masalah bisnis yang disusun menjadi prioritas dan arah solusi"
              width={1672}
              height={941}
              quality={90}
              priority
              sizes="(max-width: 960px) 100vw, 48vw"
            />
          </figure>
        </section>

        <PersonalizedDemo />
      </main>
      <Footer />
    </>
  );
}
