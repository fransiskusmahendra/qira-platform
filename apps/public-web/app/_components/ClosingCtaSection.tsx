import Link from "next/link";
import styles from "./ClosingCtaSection.module.css";
import { ContextualWhatsAppCta } from "./ContextualWhatsAppCta";

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
  kicker = "Mulai sederhana",
  heading = "Mulai dari satu masalah usaha.",
  subtext = "Tanpa istilah teknis yang rumit. Ceritakan apa yang paling merepotkan saat ini, QIRA membantu memetakan solusi yang paling tepat.",
  primaryText = "Ceritakan masalah usaha",
  primaryHref = "/coba-masalah",
  waContext = "kebutuhan solusi digital bisnis",
  className = "",
}: ClosingCtaProps) {
  return (
    <section className={`shell ${className}`}>
      <div className={styles.section}>
        <div className={styles.copy}>
          <p className={styles.kicker}>{kicker}</p>
          <h2 className={styles.heading}>{heading}</h2>
          <p className={styles.subtext}>{subtext}</p>
        </div>
        <div className={styles.actions}>
          <Link
            className={styles.primaryButtonLight}
            href={primaryHref}
            data-conversion="homepage_cta_click"
          >
            {primaryText}
          </Link>
          <ContextualWhatsAppCta
            context={waContext}
            className={styles.textLinkLight}
          >
            Mulai konsultasi WhatsApp →
          </ContextualWhatsAppCta>
        </div>
      </div>
    </section>
  );
}
