"use client";

import Link from "next/link";
import { useState } from "react";

import { trackConversion } from "./ConversionTracker";

const PROBLEMS = [
  { icon: "↗", label: "Sulit ditemukan", before: "Sulit ditemukan", solution: "Website", outcome: "Mudah dihubungi" },
  { icon: "▦", label: "Masih manual", before: "Data tercecer", solution: "Form & dashboard", outcome: "Satu alur" },
  { icon: "⚡", label: "Terlalu berulang", before: "Kerja berulang", solution: "Otomatisasi", outcome: "Lebih cepat" },
  { icon: "◎", label: "Bingung mulai", before: "Belum jelas", solution: "Pemetaan", outcome: "Prioritas jelas" },
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
            onClick={() => {
              setActive(index);
              void trackConversion("problem_select");
            }}
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
          <div><small>Masalah</small><strong>{selected.before}</strong></div>
          <span aria-hidden="true">→</span>
          <div className="solution"><small>QIRA</small><strong>{selected.solution}</strong></div>
          <span aria-hidden="true">→</span>
          <div className="outcome"><small>Hasil</small><strong>{selected.outcome}</strong></div>
        </div>
        <Link href="/coba-masalah">Ceritakan masalah usaha →</Link>
      </div>
    </div>
  );
}
