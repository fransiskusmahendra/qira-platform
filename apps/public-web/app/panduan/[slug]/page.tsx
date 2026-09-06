import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConversionTracker } from "../../_components/ConversionTracker";
import { GUIDES, type GuideSlug } from "../guides";
import styles from "../../SubpageVisual.module.css";
import { Navbar } from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { ClosingCtaSection } from "../../_components/ClosingCtaSection";

export function generateStaticParams() {
  return Object.keys(GUIDES).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES[slug as GuideSlug];
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/panduan/${slug}` },
    openGraph: {
      title: `${guide.title} | QIRA`,
      description: guide.description,
      url: `/panduan/${slug}`,
      type: "article",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: guide.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${guide.title} | QIRA`,
      description: guide.description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = GUIDES[slug as GuideSlug];
  if (!guide) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <Navbar />
      <main>
        <ConversionTracker event="guide_view" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <section className={`${styles.hero} shell`}>
          <div className={styles.heroCopy}>
            <div className="contentBreadcrumb">
              <Link href="/panduan">Panduan</Link>
              <span>/</span>
              <span>{guide.eyebrow}</span>
            </div>
            <p className="eyebrow">{guide.eyebrow}</p>
            <h1>{guide.title}</h1>
            <p>{guide.intro}</p>
          </div>
        </section>

        <article className="guideArticle shell">
          <section>
            <h2>Kapan ini relevan?</h2>
            <p>{guide.fit}</p>
          </section>

          <section>
            <h2>Tanda yang sering muncul</h2>
            <ul>
              {guide.signs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Langkah yang lebih aman</h2>
            <ol>
              {guide.steps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>

          <section>
            <p className="qualityNote">
              Mulai dari proses yang kecil dan dapat diperiksa. Sistem yang lebih besar baru masuk akal ketika kebutuhan berikutnya sudah terbukti.
            </p>
          </section>

          <section>
            <h2>Pertanyaan yang sering muncul</h2>
            <div className="guideFaq">
              {guide.faq.map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </section>
        </article>

        <ClosingCtaSection
          kicker="Kondisi Anda berbeda?"
          heading="QIRA bantu petakan kebutuhan spesifiknya."
          subtext="Setiap usaha punya prioritas unik. Diskusikan alur yang paling cocok untuk bisnis Anda."
          primaryText="Mulai pemetaan"
        />
      </main>
      <Footer />
    </>
  );
}
