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
        background: "rgba(8, 12, 24, 0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 -8px 28px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
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
          background: "#16a34a",
          color: "#ffffff",
          fontSize: "13.5px",
          fontWeight: "700",
          textDecoration: "none",
          boxShadow: "0 2px 10px rgba(22, 163, 74, 0.35)"
        }}
      >
        💬 <span>WhatsApp</span>
      </a>

      <Link
        href="/coba-masalah"
        onClick={() => void trackConversion("homepage_cta_click")}
        style={{
          flex: 1.25,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: "44px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #1769FF 0%, #00C2FF 100%)",
          color: "#ffffff",
          fontSize: "13px",
          fontWeight: "750",
          textDecoration: "none",
          boxShadow: "0 2px 14px rgba(0, 194, 255, 0.32)"
        }}
      >
        <span>{isEn ? "Start Discovery →" : "Mulai dari Masalah →"}</span>
      </Link>
    </div>
  );
}
