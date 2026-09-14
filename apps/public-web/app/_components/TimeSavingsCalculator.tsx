"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/i18n";

export function TimeSavingsCalculator() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [staffCount, setStaffCount] = useState(2);

  const { hoursSaved, costSavedIdr, costSavedUsd } = useMemo(() => {
    const workDays = 22;
    const totalManualHours = hoursPerDay * staffCount * workDays;
    const saved = Math.round(totalManualHours * 0.75);
    const costIdr = saved * 25000; // estimated Rp 25k/hour admin cost
    const costUsd = Math.round(costIdr / 16000);
    return {
      hoursSaved: saved,
      costSavedIdr: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(costIdr),
      costSavedUsd: `$${costUsd}`,
    };
  }, [hoursPerDay, staffCount]);

  const waMessage = isEn
    ? `Hello QIRA team, based on the calculator, my business could save around ${hoursSaved} work hours/month. I'd like to consult on the best digital solution.`
    : `Halo tim QIRA, setelah menghitung di website, usaha saya berpotensi menghemat sekitar ${hoursSaved} jam kerja/bulan. Saya ingin konsultasi solusinya.`;

  const waUrl = `https://wa.me/6285183042571?text=${encodeURIComponent(waMessage)}`;

  return (
    <section className="visualStory shell" style={{ marginTop: "24px" }}>
      <div style={{
        padding: "36px 28px",
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(12px)",
        borderRadius: "24px",
        border: "1px solid var(--line)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)"
      }}>
        <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 28px" }}>
          <p className="kicker">
            {isEn ? "Time & Cost Estimator" : "Kalkulator Penghematan"}
          </p>
          <h2 style={{ fontSize: "24px", fontWeight: "750", color: "var(--ink)", marginBottom: "8px" }}>
            {isEn ? "See how many hours your team can save." : "Hitung berapa jam kerja yang bisa dihemat."}
          </h2>
          <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0, lineHeight: "1.5" }}>
            {isEn
              ? "Manual data entry, scattered messages, and lost notes consume valuable hours. Move the sliders to see your potential efficiency."
              : "Menyalin nota manual, mencari data di chat, dan tugas berulang menghabiskan jam kerja berharga. Geser slider untuk melihat estimasinya."}
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "28px",
          alignItems: "center"
        }}>
          {/* Sliders Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "white", padding: "16px 20px", borderRadius: "14px", border: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <label style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--ink)" }}>
                  {isEn ? "Manual work per day:" : "Jam kerja manual per hari:"}
                </label>
                <span style={{ fontSize: "14px", fontWeight: "750", color: "var(--blue)" }}>
                  {hoursPerDay} {isEn ? "hours" : "jam"}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                step={1}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                style={{ width: "100%", cursor: "pointer", accentColor: "var(--blue)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>
                <span>1 {isEn ? "hr" : "jam"}</span>
                <span>8 {isEn ? "hrs" : "jam"}</span>
              </div>
            </div>

            <div style={{ background: "white", padding: "16px 20px", borderRadius: "14px", border: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <label style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--ink)" }}>
                  {isEn ? "Staff handling repetitive tasks:" : "Jumlah staf yang terlibat:"}
                </label>
                <span style={{ fontSize: "14px", fontWeight: "750", color: "var(--blue)" }}>
                  {staffCount} {isEn ? "people" : "orang"}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={staffCount}
                onChange={(e) => setStaffCount(Number(e.target.value))}
                style={{ width: "100%", cursor: "pointer", accentColor: "var(--blue)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>
                <span>1 {isEn ? "person" : "orang"}</span>
                <span>10 {isEn ? "people" : "orang"}</span>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            padding: "24px 28px",
            borderRadius: "18px",
            color: "white",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.2)"
          }}>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {isEn ? "Potential Time Saved" : "Potensi Jam Kerja Dihemat"}
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <strong style={{ fontSize: "36px", fontWeight: "800", color: "#38bdf8", lineHeight: 1 }}>
                  ~{hoursSaved}
                </strong>
                <span style={{ fontSize: "14px", color: "#cbd5e1" }}>
                  {isEn ? "hours / month" : "jam / bulan"}
                </span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: "14px" }}>
              <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {isEn ? "Estimated Operational Value" : "Estimasi Nilai Efisiensi"}
              </p>
              <strong style={{ fontSize: "20px", fontWeight: "700", color: "#4ade80" }}>
                {isEn ? `${costSavedUsd} (~${costSavedIdr})` : costSavedIdr}
              </strong>
              <span style={{ fontSize: "12px", color: "#94a3b8", marginLeft: "6px" }}>
                {isEn ? "/ month" : "/ bulan"}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  background: "#16a34a",
                  color: "white",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  fontSize: "13.5px",
                  fontWeight: "600",
                  textDecoration: "none"
                }}
              >
                💬 {isEn ? "Consult on WhatsApp →" : "Konsultasi Solusi Ini →"}
              </a>
              <Link
                href="/coba-masalah"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  fontSize: "12.5px",
                  textDecoration: "none",
                  padding: "4px"
                }}
              >
                {isEn ? "Or answer 4 quick questions (2 mins) →" : "Atau isi pemetaan kebutuhan (~2 menit) →"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
