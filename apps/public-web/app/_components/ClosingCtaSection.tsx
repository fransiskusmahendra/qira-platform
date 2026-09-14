"use client";

import Link from "next/link";
import styles from "./ClosingCtaSection.module.css";
import { ContextualWhatsAppCta } from "./ContextualWhatsAppCta";
import { useLanguage } from "../../lib/i18n";

interface ClosingCtaProps {
  kicker?: string;
  heading?: string;
  subtext?: string;
  primaryText?: string;
  primaryHref?: string;
  waContext?: string;
  className?: string;
}

export function ClosingCtaSection({
  kicker,
  heading,
  subtext,
  primaryText,
  primaryHref = "/coba-masalah",
  waContext = "kebutuhan solusi digital bisnis",
  className = "",
}: ClosingCtaProps) {
  const { t } = useLanguage();

  const finalKicker = kicker || t.closingCta.kicker;
  const finalHeading = heading || t.closingCta.heading;
  const finalSubtext = subtext || t.closingCta.subtext;
  const finalPrimaryText = primaryText || t.closingCta.primaryText;

  return (
    <section className={`shell ${className}`}>
      <div className={styles.section}>
        <div className={styles.copy}>
          <p className={styles.kicker}>{finalKicker}</p>
          <h2 className={styles.heading}>{finalHeading}</h2>
          <p className={styles.subtext}>{finalSubtext}</p>
        </div>
        <div className={styles.actions}>
          <Link
            className={styles.primaryButtonLight}
            href={primaryHref}
            data-conversion="homepage_cta_click"
          >
            {finalPrimaryText}
          </Link>
          <ContextualWhatsAppCta
            context={waContext}
            className={styles.textLinkLight}
          >
            {t.closingCta.waText}
          </ContextualWhatsAppCta>
        </div>
      </div>
    </section>
  );
}