"use client";

import Link from "next/link";
import { useLanguage } from "../../lib/i18n";
import { trackConversion } from "./ConversionTracker";

export function StickyMobileDock() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const waMessage = isEn
    ? "Hello QIRA team, I would like to consult about digital solutions for my business."
    : "Halo tim QIRA, saya ingin konsultasi mengenai solusi digital untuk usaha saya.";

  const waUrl = `https://wa.me/6285183042571?text=${encodeURIComponent(waMessage)}`;

  return (
    <div
      className="mobileOnlyDock"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        padding: "10px 16px",
        paddingBottom: "max(10px, env(safe-area-inset-bottom))",
        background: "rgba(255, 255, 255, 0.94)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(15, 23, 42, 0.08)",
        boxShadow: "0 -4px 16px rgba(0, 0, 0, 0.04)"
      }}
    >
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        onClick={() => void trackConversion("whatsapp_request_click")}
        style={{
          flex: 1,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          height: "44px",
          borderRadius: "10px",
          background: "#22c55e",
          color: "#ffffff",
          fontSize: "13.5px",
          fontWeight: "700",
          textDecoration: "none",
          boxShadow: "0 2px 6px rgba(34, 197, 94, 0.28)"
        }}
      >
        💬 <span>WhatsApp</span>
      </a>

      <Link
        href="/coba-masalah"
        onClick={() => void trackConversion("homepage_cta_click")}
        style={{
          flex: 1.2,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: "44px",
          borderRadius: "10px",
          background: "var(--blue)",
          color: "#ffffff",
          fontSize: "13px",
          fontWeight: "700",
          textDecoration: "none",
          boxShadow: "0 2px 6px rgba(26, 115, 232, 0.28)"
        }}
      >
        <span>{isEn ? "Start Discovery →" : "Mulai dari Masalah →"}</span>
      </Link>
    </div>
  );
}
