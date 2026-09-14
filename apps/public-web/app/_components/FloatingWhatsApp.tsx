"use client";

import { useState } from "react";
import { trackConversion } from "./ConversionTracker";
import styles from "./FloatingWhatsApp.module.css";
import { useLanguage } from "../../lib/i18n";

export function FloatingWhatsApp() {
  const { locale, t } = useLanguage();
  const isEn = locale === "en";
  const [isOpen, setIsOpen] = useState(false);

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285183042571";
  const cleanNumber = waNumber.replace(/\D/g, "");

  const options = isEn ? [
    { label: "Business Website", text: "Hello QIRA team, I'd like to consult about building a website for my business." },
    { label: "Forms & Automation", text: "Hello QIRA team, I want to streamline manual repetitive tasks (invoices, forms, notifications) for my business." },
    { label: "General Consultation", text: "Hello QIRA team, I have an operational bottleneck and would like to consult on the best solution." },
  ] : [
    { label: "Website Profil Usaha", text: "Halo tim QIRA, saya ingin konsultasi pembuatan website untuk usaha saya." },
    { label: "Otomatisasi Form / Nota", text: "Halo tim QIRA, saya ingin merapikan alur kerja manual (nota, form order, rekap) untuk bisnis saya." },
    { label: "Konsultasi Kebutuhan Usaha", text: "Halo tim QIRA, ada pekerjaan usaha yang ingin saya rapikan. Boleh konsultasi solusinya?" },
  ];

  function openWhatsApp(message: string) {
    void trackConversion("whatsapp_request_click");
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  }

  return (
    <aside className={styles.floatingContainer} aria-label={t.whatsapp.floatingAria}>
      {isOpen && (
        <div
          style={{
            width: "290px",
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid rgba(15, 23, 42, 0.12)",
            boxShadow: "0 12px 36px rgba(0, 0, 0, 0.14)",
            padding: "16px",
            marginBottom: "8px",
            textAlign: "left"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
            <div>
              <p style={{ margin: 0, fontWeight: "750", fontSize: "13.5px", color: "var(--ink)" }}>
                {isEn ? "QIRA Quick Consultation" : "Konsultasi Tim QIRA"}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "11.5px", color: "#16a34a", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
                {isEn ? "Online • < 15 mins reply" : "Online • Balas < 15 menit"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "15px",
                cursor: "pointer",
                color: "var(--muted)",
                padding: "2px 6px"
              }}
              aria-label="Close">
              ×
            </button>
          </div>

          <p style={{ margin: "0 0 10px", fontSize: "12px", color: "var(--muted)" }}>
            {isEn ? "Select a topic to start chat:" : "Pilih topik kebutuhan Anda:"}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            {options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => openWhatsApp(opt.text)}
                style={{
                  textAlign: "left",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--ink)",
                  cursor: "pointer"
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        className={styles.floatingButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t.whatsapp.floatingTooltip}
        aria-expanded={isOpen}
      >
        <span className={styles.onlineBadge} aria-hidden="true" />
        <svg className={styles.floatingIcon} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.18 8.18 0 0 1-5.82 2.42c-1.48 0-2.93-.39-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.25-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.61c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29" />
        </svg>
        <span className={styles.buttonText}>{t.whatsapp.floatingText}</span>
      </button>
    </aside>
  );
}