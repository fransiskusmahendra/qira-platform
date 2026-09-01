"use client";

import Link from "next/link";
import { useState } from "react";

const PROBLEMS = [
  {
    label: "Sulit ditemukan pelanggan",
    title: "Bangun kehadiran digital yang jelas.",
    result: "Website atau landing page yang mudah ditemukan, dipahami, dan dihubungi.",
    visual: "↗",
  },
  {
    label: "Pencatatan masih manual",
    title: "Rapikan pekerjaan dalam satu alur.",
    result: "Formulir, invoice, data operasional, dan dashboard sederhana dalam satu tempat.",
    visual: "▦",
  },
  {
    label: "Tugas rutin terlalu banyak",
    title: "Otomatiskan pekerjaan berulang.",
    result: "Notifikasi, pemindahan data, dan tindak lanjut berjalan lebih konsisten.",
    visual: "⚡",
  },
  {
    label: "Belum tahu harus mulai dari mana",
    title: "Temukan solusi yang paling masuk akal.",
    result: "Pemetaan masalah, prioritas, ruang lingkup, waktu, dan kisaran biaya awal.",
    visual: "◎",
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
            <span>{String(index + 1).padStart(2, "0")}</span>
            {problem.label}
          </button>
        ))}
      </div>

      <div aria-labelledby={`problem-${active}`} className="problemResult" id="problem-result" role="tabpanel">
        <span aria-hidden="true" className="problemVisual">{selected.visual}</span>
        <p className="panelLabel">Yang QIRA bantu</p>
        <h3>{selected.title}</h3>
        <p>{selected.result}</p>
        <Link href="/coba-masalah">Ceritakan masalah Anda →</Link>
      </div>
    </div>
  );
}
