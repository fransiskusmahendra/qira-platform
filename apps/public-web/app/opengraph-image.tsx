import { ImageResponse } from "next/og";

export const alt = "QIRA — Sederhanakan Alur Kerja. Otomatiskan Operasional.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(145deg, #060913 0%, #0A1024 45%, #0B1636 100%)",
        color: "white",
        padding: "68px 76px",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Brand with Q-Prism Mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width={56} height={56} viewBox="0 0 128 128" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="ogRing" x1="16" y1="14" x2="99" y2="102" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="45%" stopColor="#1769FF" />
                <stop offset="100%" stopColor="#0A3AB5" />
              </linearGradient>
              <linearGradient id="ogBeam" x1="67" y1="64" x2="117" y2="114" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="70%" stopColor="#00D2FF" />
                <stop offset="100%" stopColor="#1769FF" />
              </linearGradient>
              <radialGradient id="ogAura" cx="64" cy="64" r="58" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#1769FF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#060913" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="64" cy="64" r="50" fill="url(#ogAura)" />
            <path
              d="M 55.3 14.12 C 30.92 14.12 11.22 33.82 11.22 58.2 C 11.22 82.58 30.92 102.28 55.3 102.28 C 68.52 102.28 80.36 96.6 88.48 87.43 L 73.63 72.58 C 69.45 76.99 62.96 80.01 55.3 80.01 C 43.26 80.01 33.49 70.24 33.49 58.2 C 33.49 46.16 43.26 36.39 55.3 36.39 C 67.34 36.39 77.11 46.16 77.11 58.2 C 77.11 62.84 75.6 67.02 73.16 70.38 L 88.01 85.23 C 95.55 78.04 99.38 68.06 99.38 58.2 C 99.38 33.82 79.68 14.12 55.3 14.12 Z"
              fill="url(#ogRing)"
            />
            <path
              d="M 66.9 72.12 L 108.66 113.88 L 116.78 105.76 L 75.02 64 L 66.9 72.12 Z"
              fill="url(#ogBeam)"
            />
          </svg>
          <span style={{ fontSize: 46, fontWeight: 900, letterSpacing: -1.5, color: "#FFFFFF" }}>
            QIRA
          </span>
        </div>

        {/* Category Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: "1px solid rgba(0, 240, 255, 0.35)",
            background: "rgba(0, 240, 255, 0.08)",
            borderRadius: 999,
            padding: "12px 24px",
            fontSize: 19,
            fontWeight: 700,
            color: "#00F0FF",
          }}
        >
          <span>●</span>
          <span>Digital Engineering & Automation</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 980, marginTop: 24 }}>
        <div
          style={{
            display: "flex",
            fontSize: 60,
            lineHeight: 1.1,
            fontWeight: 900,
            letterSpacing: -2.2,
            color: "#FFFFFF",
            marginBottom: 20,
          }}
        >
          Sederhanakan Alur Kerja. Otomatiskan Operasional.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            lineHeight: 1.45,
            color: "#94A3B8",
            maxWidth: 860,
          }}
        >
          Solusi sistem dan otomasi operasional mandiri untuk efisiensi bisnis modern tanpa biaya langganan berulang.
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          paddingTop: 28,
          fontSize: 22,
          color: "#64748B",
        }}
      >
        <div style={{ display: "flex", gap: 24 }}>
          <span style={{ color: "#94A3B8" }}>Sistem Operasional</span>
          <span>•</span>
          <span style={{ color: "#94A3B8" }}>Otomatisasi</span>
          <span>•</span>
          <span style={{ color: "#94A3B8" }}>Dashboard</span>
          <span>•</span>
          <span style={{ color: "#94A3B8" }}>Integrasi</span>
        </div>
        <div style={{ display: "flex", fontWeight: 800, color: "#38BDF8", letterSpacing: -0.5 }}>
          qirasolution.com
        </div>
      </div>
    </div>,
    size,
  );
}
