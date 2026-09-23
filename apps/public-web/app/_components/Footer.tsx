"use client";

import Link from "next/link";
import styles from "./Footer.module.css";
import { ContextualWhatsAppCta } from "./ContextualWhatsAppCta";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "../../lib/i18n";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className="shell">
        <div className={styles.footerGrid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <Link className={styles.brandLink} href="/" aria-label="QIRA - Beranda">
              <img
                src="/qira-logo.svg"
                alt="QIRA"
                width={136}
                height={38}
                className={styles.brandLogo}
              />
            </Link>
            <p className={styles.brandTagline}>
              {t.footer.brandTagline}
            </p>
            <div className={styles.trustBadge}>
              <span>✓</span> {t.footer.trustBadge}
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <p className={styles.colTitle}>{t.footer.colSolutions}</p>
            <ul className={styles.linkList}>
              {t.footer.solutionsLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning Column */}
          <div>
            <p className={styles.colTitle}>{t.footer.colLearn}</p>
            <ul className={styles.linkList}>
              {t.footer.learnLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <p className={styles.colTitle}>{t.footer.colCompany}</p>
            <ul className={styles.linkList}>
              {t.footer.companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
              <li>
                <ContextualWhatsAppCta context="tanya langsung ke tim QIRA">
                  {t.footer.waText}
                </ContextualWhatsAppCta>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <span>{t.footer.bottomText}</span>
          <div className={styles.bottomLinks} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <LanguageSwitcher />
            <Link href="/privasi">{t.footer.privacy}</Link>
            <Link href="/about">{t.footer.about}</Link>
            <Link href="/coba-masalah">{t.footer.start}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}