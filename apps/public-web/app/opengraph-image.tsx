import { ImageResponse } from "next/og";

export const alt = "QIRA — Simple Digital Solutions";
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
        background: "linear-gradient(135deg, #071a33 0%, #0d2f4f 58%, #1769ff 100%)",
        color: "white",
        padding: "72px 78px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "baseline", fontSize: 58, fontWeight: 800, letterSpacing: -2 }}>
          QIRA<span style={{ color: "#8eb9ff" }}>.</span>
        </div>
        <div
          style={{
            display: "flex",
            border: "1px solid rgba(255,255,255,.28)",
            borderRadius: 999,
            padding: "13px 22px",
            fontSize: 22,
            color: "rgba(255,255,255,.86)",
          }}
        >
          Solusi digital sederhana untuk bisnis
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 940 }}>
        <div style={{ display: "flex", fontSize: 24, color: "#a9c8ff", marginBottom: 18, fontWeight: 700 }}>
          Simple Digital Solutions
        </div>
        <div style={{ display: "flex", fontSize: 66, lineHeight: 1.08, fontWeight: 800, letterSpacing: -2.5 }}>
          Solusi digital yang membuat bisnis lebih sederhana.
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, color: "rgba(255,255,255,.78)" }}>
        <div style={{ display: "flex" }}>Website · Form · Dashboard · Otomatisasi</div>
        <div style={{ display: "flex", fontWeight: 700, color: "white" }}>qirasolution.com</div>
      </div>
    </div>,
    size,
  );
}
