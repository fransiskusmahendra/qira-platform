"use client";

import Link from "next/link";
import { useState } from "react";

const EXAMPLES = [
  ["Jasa profesional", "Profil digital", "Form kebutuhan", "Invoice & follow-up"],
  ["Kuliner & katering", "Katalog sederhana", "Pesanan terstruktur", "Rekap penjualan"],
  ["Pelatihan", "Landing program", "Pendaftaran peserta", "Sertifikat & pengingat"],
  ["Travel", "Form pemesanan", "Dokumen perjalanan", "Status pelanggan"],
  ["Event & komunitas", "Halaman acara", "Registrasi", "Daftar peserta"],
  ["Operasional perusahaan", "Form internal", "Dashboard", "Workflow persetujuan"],
] as const;

export function BusinessExamples() {
  const [active, setActive] = useState(0);
  const selected = EXAMPLES[active];

  return (
    <div className="businessExplorer">
      <div className="businessChips" aria-label="Jenis usaha">
        {EXAMPLES.map(([name], index) => (
          <button
            className={active === index ? "active" : ""}
            key={name}
            onClick={() => setActive(index)}
            type="button"
          >
            {name}
          </button>
        ))}
      </div>
      <div className="businessResult" aria-live="polite">
        <p className="panelLabel">Contoh untuk {selected[0]}</p>
        <div>
          {selected.slice(1).map((item) => <span key={item}>{item}</span>)}
        </div>
        <Link href="/contoh-penerapan">Lihat contoh solusi →</Link>
      </div>
    </div>
  );
}
