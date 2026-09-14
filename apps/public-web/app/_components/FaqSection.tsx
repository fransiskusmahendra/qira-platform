"use client";

import styles from "./FaqSection.module.css";
import { useLanguage } from "../../lib/i18n";

export function FaqSection() {
  const { t } = useLanguage();

  return (
    <section className={`shell ${styles.faqSection}`} id="faq" aria-label={t.faq.heading}>
      <div className={styles.faqHeader}>
        <p className={styles.kicker}>{t.faq.kicker}</p>
        <h2 className={styles.heading}>{t.faq.heading}</h2>
        <p className={styles.lead}>{t.faq.lead}</p>
      </div>

      <div className={styles.faqList}>
        {t.faq.items.map((faq, index) => (
          <details className={styles.faqItem} key={index} open={index === 0}>
            <summary className={styles.faqSummary}>
              <span>{faq.q}</span>
              <span className={styles.chevronIcon} aria-hidden="true">↓</span>
            </summary>
            <p className={styles.faqAnswer}>{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}