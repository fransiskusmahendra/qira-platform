import { ImageResponse } from "next/og";

export const alt = "QIRA — bantu usaha jadi lebih mudah";
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
        background: "linear-gradient(135deg, #071a33 0%, #0d2f4f 58%, #0b6b68 100%)",
        color: "white",
        padding: "72px 78px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "baseline", fontSize: 58, fontWeight: 800, letterSpacing: -2 }}>
          QIRA<span style={{ color: "#67e8d5" }}>.</span>
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
          PT Rays Solusi Informasi
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 940 }}>
        <div style={{ display: "flex", fontSize: 24, color: "#8ff3e5", marginBottom: 18, fontWeight: 700 }}>
          Mulai dari masalah usahamu
        </div>
        <div style={{ display: "flex", fontSize: 66, lineHeight: 1.08, fontWeight: 800, letterSpacing: -2.5 }}>
          Ceritakan yang terasa ribet. QIRA bantu cari langkah yang lebih sederhana.
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, color: "rgba(255,255,255,.78)" }}>
        <div style={{ display: "flex" }}>Tidak perlu paham teknologi</div>
        <div style={{ display: "flex", fontWeight: 700, color: "white" }}>qirasolution.com</div>
      </div>
    </div>,
    size,
  );
}
