"use client";

import Image from "next/image";
import Link from "next/link";
import { ConversionClickTracker, ConversionTracker } from "./ConversionTracker";
import { ApplicationShowcase, BeforeAfter, HeroExplainer, SolutionExplorer } from "./HomeExperience";
import { BenefitsArtwork, WhatArtwork } from "./CrispVisuals";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ClosingCtaSection } from "./ClosingCtaSection";
import { FaqSection } from "./FaqSection";
import { ContextualWhatsAppCta } from "./ContextualWhatsAppCta";
import { useLanguage } from "../../lib/i18n";
import { TimeSavingsCalculator } from "./TimeSavingsCalculator";

export function HomePageClient() {
  const { locale, t } = useLanguage();
  const isEn = locale === "en";

  return (
    <>
      <Navbar />
      <main className="visualHome">
        <ConversionTracker event="landing_view" />
        <ConversionClickTracker />

        {/* Hero Section */}
        <section className="visualHero shell">
          <div className="visualHeroCopy">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1 style={{ fontSize: "clamp(46px, 6.5vw, 82px)" }}>
              {t.hero.titleLine1}<br />
              <em>{t.hero.titleLine2}</em>
            </h1>
            <p className="visualHeroLead">
              {t.hero.lead}
            </p>
            <div className="companyHeroActions">
              <Link className="primaryButton" href="/coba-masalah" data-conversion="homepage_cta_click">
                {t.hero.ctaPrimary}
              </Link>
              <ContextualWhatsAppCta
                context="solusi digital bisnis dari beranda"
                className="secondaryHeroButton"
              >
                {t.hero.ctaSecondary} →
              </ContextualWhatsAppCta>
              <Link className="textLink" href="#contoh-solusi">
                {t.hero.ctaTextLink} →
              </Link>
            </div>
          </div>
          <div className="visualHeroArt">
            <HeroExplainer />
          </div>
        </section>

        {/* Story Section */}
        <section className="visualStory shell" id="qira-itu-apa">
          <header className="visualStoryHeading">
            <p className="kicker">{t.whatIsQira.kicker}</p>
            <h2>{t.whatIsQira.headingPart1} <em>{t.whatIsQira.headingHighlight}</em></h2>
          </header>
          <figure className="visualStoryCard">
            <WhatArtwork />
          </figure>
        </section>

        {/* Solution Explorer */}
        <section className="visualStory visualSolutionSection shell">
          <header className="visualStoryHeading">
            <p className="kicker">{t.solutions.kicker}</p>
            <h2>{t.solutions.heading} <em>{t.solutions.headingHighlight}</em></h2>
          </header>
          <SolutionExplorer />
        </section>

        {/* What You Get */}
        <section className="visualStory shell" id="contoh-solusi">
          <header className="visualStoryHeading">
            <p className="kicker">{t.benefits.kicker}</p>
            <h2>{t.benefits.heading}<br /><em>{t.benefits.headingHighlight}</em></h2>
          </header>
          <figure className="visualStoryCard">
            <BenefitsArtwork />
          </figure>
        </section>

        {/* Before / After */}
        <section className="visualStory shell">
          <header className="visualStoryHeading">
            <p className="kicker">{t.beforeAfter.kicker}</p>
            <h2>{t.beforeAfter.heading} <em>{t.beforeAfter.headingHighlight}</em></h2>
          </header>
          <BeforeAfter />
        </section>

        {/* Interactive ROI / Time Savings Estimator */}
        <TimeSavingsCalculator />

        {/* Application Showcase */}
        <section className="visualStory shell">
          <header className="visualStoryHeading">
            <p className="kicker">{t.applications.kicker}</p>
            <h2>{t.applications.heading}<br /><em>{t.applications.headingHighlight}</em></h2>
          </header>
          <ApplicationShowcase />
        </section>

        {/* Audience Paths */}
        <section className="visualStory shell">
          <header className="visualStoryHeading">
            <p className="kicker">{t.audience.kicker}</p>
            <h2>{t.audience.heading} <em>{t.audience.headingHighlight}</em></h2>
          </header>
          <div className="audiencePaths">
            <Link href={t.audience.paths[0].href}>
              <Image
                src="/illustrations/premium/qira-service-business.webp"
                alt="Alur digital usaha jasa dari pesan pelanggan hingga pekerjaan selesai"
                width={1672}
                height={941}
                quality={90}
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <span>{t.audience.paths[0].tag}</span>
              <strong>{t.audience.paths[0].title}</strong>
              <small>{t.audience.paths[0].cta}</small>
            </Link>
            <Link href={t.audience.paths[1].href}>
              <Image
                src="/illustrations/premium/qira-retail-business.webp"
                alt="Alur digital retail dan UMKM untuk katalog, pesanan, dan rekap"
                width={1672}
                height={941}
                quality={90}
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <span>{t.audience.paths[1].tag}</span>
              <strong>{t.audience.paths[1].title}</strong>
              <small>{t.audience.paths[1].cta}</small>
            </Link>
            <Link href={t.audience.paths[2].href}>
              <Image
                src="/illustrations/premium/qira-admin-business.webp"
                alt="Alur administrasi digital dari data menuju dokumen dan laporan"
                width={1672}
                height={941}
                quality={90}
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <span>{t.audience.paths[2].tag}</span>
              <strong>{t.audience.paths[2].title}</strong>
              <small>{t.audience.paths[2].cta}</small>
            </Link>
          </div>
        </section>

        {/* Proof Section */}
        <section className="visualStory shell">
          <header className="visualStoryHeading">
            <p className="kicker">{t.proof.kicker}</p>
            <h2>{t.proof.heading} <em>{t.proof.headingHighlight}</em></h2>
          </header>
          <div className="audiencePaths">
            <Link href={t.proof.items[0].href}>
              <Image
                src="/screenshots/qira-discovery.svg"
                alt="Tampilan QIRA Discovery dengan form kebutuhan usaha"
                width={1600}
                height={900}
                unoptimized
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <span>{t.proof.items[0].tag}</span>
              <strong>{t.proof.items[0].title}</strong>
              <small style={{ color: "var(--blue)", fontWeight: 700 }}>{t.proof.items[0].cta}</small>
            </Link>
            <Link href={t.proof.items[1].href}>
              <Image
                src="/screenshots/qira-invoice-maker.svg"
                alt="Tampilan QIRA Invoice Maker dan pratinjau invoice"
                width={1600}
                height={900}
                unoptimized
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <span>{t.proof.items[1].tag}</span>
              <strong>{t.proof.items[1].title}</strong>
              <small>{t.proof.items[1].cta}</small>
            </Link>
            <Link href={t.proof.items[2].href}>
              <Image
                src="/screenshots/travel-transaction-demo.svg"
                alt="Tampilan aplikasi transaksi dan pratinjau nota thermal"
                width={1600}
                height={900}
                unoptimized
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <span>{t.proof.items[2].tag}</span>
              <strong>{t.proof.items[2].title}</strong>
              <small>{t.proof.items[2].cta}</small>
            </Link>
          </div>
          <p style={{ marginTop: 18, color: "var(--muted)", fontSize: 13 }}>
            {t.proof.disclaimer}
          </p>
        </section>

        {/* Process Section */}
        <section className="visualStory shell">
          <header className="visualStoryHeading">
            <p className="kicker">{t.process.kicker}</p>
            <h2>{t.process.heading} <em>{t.process.headingHighlight}</em></h2>
          </header>
          <div className="trustGrid">
            {t.process.steps.map((step) => (
              <article key={step.step}>
                <span>{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Guarantees Section */}
        <section className="visualStory shell" id="jaminan-layanan">
          <header className="visualStoryHeading">
            <p className="kicker">{t.guarantees.kicker}</p>
            <h2>{t.guarantees.heading} <em>{t.guarantees.headingHighlight}</em></h2>
          </header>
          <div className="guaranteeGrid">
            {t.guarantees.cards.map((card) => (
              <article className="guaranteeCard" key={card.badge}>
                <div className="guaranteeIconWrapper">
                  <span className="guaranteeBadge">{card.badge}</span>
                  <span className="guaranteeIcon" aria-hidden="true">{card.icon}</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <ul className="guaranteePoints">
                  {card.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Learn Section */}
        <section className="visualStory shell">
          <header className="visualStoryHeading">
            <p className="kicker">{t.learning.kicker}</p>
            <h2>{t.learning.heading} <em>{t.learning.headingHighlight}</em></h2>
          </header>
          <div className="learningGrid">
            {t.learning.cards.map((card) => (
              <Link href={card.href} key={card.href}>
                <span>{card.tag}</span>
                <strong>{card.title}</strong>
                <small>{card.cta}</small>
              </Link>
            ))}
          </div>
        </section>

        {/* Pricing Teaser */}
        <section className="visualPricing shell">
          <div>
            <p className="kicker">{t.pricing.kicker}</p>
            <h2>{t.pricing.heading} <em>{t.pricing.headingHighlight}</em></h2>
            <p>{t.pricing.subtext}</p>
          </div>
          <Link className="primaryButton" href="/harga" data-conversion="homepage_cta_click">
            {t.pricing.cta}
          </Link>
        </section>

        {/* Interactive FAQ Section */}
        <FaqSection />

        {/* Closing CTA */}
        <ClosingCtaSection />
      </main>
      <Footer />
    </>
  );
}