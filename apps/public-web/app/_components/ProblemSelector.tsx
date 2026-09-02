"use client";

import Link from "next/link";
import { useState } from "react";

const PROBLEMS = [
  {
    icon: "↗",
    label: "Sulit ditemukan",
    before: "Pelanggan sulit menemukan atau memahami bisnis Anda.",
    solution: "Website / landing page",
    outcome: "Mudah ditemukan & dihubungi",
  },
  {
    icon: "▦",
    label: "Masih manual",
    before: "Data, pesanan, atau dokumen tersebar di banyak tempat.",
    solution: "Form + dashboard + dokumen",
    outcome: "Satu alur kerja",
  },
  {
    icon: "⚡",
    label: "Terlalu berulang",
    before: "Pengingat, follow-up, dan pemindahan data dikerjakan berulang.",
    solution: "Automation sederhana",
    outcome: "Lebih konsisten",
  },
  {
    icon: "◎",
    label: "Bingung mulai",
    before: "Belum jelas apa yang perlu dibuat lebih dulu.",
    solution: "Business discovery",
    outcome: "Prioritas & scope jelas",
  },
] as const;

export function ProblemSelector() {
  const [active, setActive] = useState(0);
  const selected = PROBLEMS[active];

  return (
    <div className="problemExplorer">
      <div className="problemOptions" role="tablist" aria-label="Pilih masalah bisnis">
        {PROBLEMS.map((problem, index) => (
          <button
            aria-controls="problem-result"
            aria-selected={active === index}
            className={active === index ? "active" : ""}
            id={`problem-${index}`}
            key={problem.label}
            onClick={() => setActive(index)}
            role="tab"
            type="button"
          >
            <span className="problemOptionIcon" aria-hidden="true">{problem.icon}</span>
            <strong>{problem.label}</strong>
          </button>
        ))}
      </div>

      <div aria-labelledby={`problem-${active}`} className="problemResult" id="problem-result" role="tabpanel">
        <div className="problemMiniFlow" aria-label="Masalah menuju solusi dan hasil">
          <div>
            <small>Sebelum</small>
            <strong>{selected.before}</strong>
          </div>
          <span aria-hidden="true">→</span>
          <div className="solution">
            <small>Dengan QIRA</small>
            <strong>{selected.solution}</strong>
          </div>
          <span aria-hidden="true">→</span>
          <div className="outcome">
            <small>Hasil</small>
            <strong>{selected.outcome}</strong>
          </div>
        </div>
        <Link href="/coba-masalah">Coba dengan masalah Anda →</Link>
      </div>
    </div>
  );
}
