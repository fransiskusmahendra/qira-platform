"use client";

import { useLanguage } from "../../lib/i18n";
import styles from "./LanguageSwitcher.module.css";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();

  return (
    <div className={`${styles.switcher} ${className || ""}`} role="group" aria-label="Pilih Bahasa / Select Language">
      <button
        type="button"
        className={`${styles.btn} ${locale === "id" ? styles.active : ""}`}
        onClick={() => setLocale("id")}
        aria-pressed={locale === "id"}
      >
        ID
      </button>
      <span className={styles.divider} aria-hidden="true">/</span>
      <button
        type="button"
        className={`${styles.btn} ${locale === "en" ? styles.active : ""}`}
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}