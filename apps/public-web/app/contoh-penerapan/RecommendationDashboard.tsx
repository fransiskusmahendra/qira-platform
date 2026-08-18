"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./case-studies.module.css";

type Assessment = {
  businessName: string;
  teamSize: string;
  priority: string;
  description: string;
  profile: {
    name: string;
    packageId: string;
    packageName: string;
    title: string;
    problem: string;
    modules: string[];
    metrics: { label: string; value: string }[];
    flow: string[];
  };
};

const impactByPriority: Record<string, string[]> = {
  "Mendapatkan pelanggan": ["Jalur calon pelanggan menjadi lebih jelas", "Pertanyaan masuk tercatat dalam satu tempat", "Tindak lanjut lebih konsisten"],
  "Merapikan operasional": ["Status pekerjaan mudah dipantau", "Tanggung jawab tim lebih jelas", "Risiko proses terlewat berkurang"],
  "Mengurangi pencatatan manual": ["Input berulang dapat dipangkas", "Data lebih seragam dan mudah dicari", "Kesalahan salin data dapat dikurangi"],
  "Membuat laporan lebih cepat": ["Ringkasan tersedia dari data operasional", "Kondisi usaha lebih cepat terlihat", "Keputusan tidak menunggu rekap manual"],
};

export default function RecommendationDashboard() {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("qira-problem-assessment");
      if (saved) setAssessment(JSON.parse(saved));
    } catch {}
  }, []);

  const impacts = useMemo(() => assessment ? (impactByPriority[assessment.priority] || impactByPriority["Merapikan operasional"]) : [], [assessment]);

  if (!assessment) return <main className={styles.page}><nav className={styles.nav}><Link className={styles.brand} href="/">QIRA<span>.</span></Link></nav><section className={styles.empty}><span>Rekomendasi personal belum tersedia</span><h1>Ceritakan masalah usahamu terlebih dahulu.</h1><p>Dashboard ini disusun dari jawaban pada tahap Coba Masalah agar yang ditampilkan benar-benar relevan.</p><Link href="/coba-masalah">Mulai Coba Masalah <b>→</b></Link></section></main>;

  const { profile } = assessment;
  const displayName = assessment.businessName.trim() || profile.name;
  return <main className={styles.page}>
    <nav className={styles.nav}><Link className={styles.brand} href="/">QIRA<span>.</span></Link><Link className={styles.editLink} href="/coba-masalah">Ubah jawaban</Link></nav>
    <header className={styles.hero}>
      <div><p>Dashboard rekomendasi QIRA</p><h1>Inilah cara QIRA dapat membantu <em>{displayName}.</em></h1><span>Disusun dari masalah, ukuran tim, dan prioritas yang kamu masukkan.</span></div>
      <aside><small>Rekomendasi awal</small><strong>{profile.packageName}</strong><span>Estimasi implementasi {profile.packageId === "connected-growth" ? "3–6 minggu" : profile.packageId === "growth-engine" ? "2–4 minggu" : "1–2 minggu"}</span></aside>
    </header>

    <section className={styles.summary}>
      <article className={styles.problem}><small>Masalah yang QIRA pahami</small><h2>{profile.problem}</h2><blockquote>“{assessment.description}”</blockquote></article>
      <div className={styles.context}><div><small>Ukuran tim</small><strong>{assessment.teamSize}</strong></div><div><small>Prioritas utama</small><strong>{assessment.priority}</strong></div><div><small>Arah solusi</small><strong>{profile.title}</strong></div></div>
    </section>

    <section className={styles.dashboard}>
      <div className={styles.sectionHead}><div><p>Gambaran solusi</p><h2>Satu dashboard untuk proses yang paling penting.</h2></div><span>Data simulasi</span></div>
      <div className={styles.metrics}>{profile.metrics.map(item=><article key={item.label}><small>{item.label}</small><strong>{item.value}</strong><i>↗</i></article>)}</div>
      <div className={styles.workspace}>
        <article><small>Modul yang disarankan</small><div className={styles.modules}>{profile.modules.map((item,index)=><span key={item}><b>0{index+1}</b>{item}</span>)}</div></article>
        <article><small>Alur kerja yang dirapikan</small><ol>{profile.flow.map((item,index)=><li key={item}><b>{index+1}</b><span>{item}</span></li>)}</ol></article>
      </div>
    </section>

    <section className={styles.impact}><div><p>Dampak yang dituju</p><h2>Bukan sekadar aplikasi, tetapi proses kerja yang lebih jelas.</h2></div><ul>{impacts.map(item=><li key={item}><i>✓</i><span>{item}</span></li>)}</ul></section>

    <section className={styles.roadmap}><div className={styles.sectionHead}><div><p>Rencana penerapan</p><h2>Dari masalah menuju solusi yang siap digunakan.</h2></div></div><ol><li><b>01</b><span><strong>Discovery</strong>Validasi proses, pengguna, data, dan target.</span></li><li><b>02</b><span><strong>Prototype</strong>Dashboard dan alur utama dibuat untuk diuji.</span></li><li><b>03</b><span><strong>Implementasi</strong>Solusi dibangun, diuji, lalu disiapkan untuk tim.</span></li><li><b>04</b><span><strong>Pendampingan</strong>Penggunaan dipantau dan diperbaiki berdasarkan kondisi nyata.</span></li></ol></section>

    <section className={styles.cta}><div><small>Langkah berikutnya</small><h2>Lengkapi Discovery agar QIRA dapat menyusun scope dan harga yang tepat.</h2></div><Link href="/discovery">Lanjutkan ke Discovery <b>→</b></Link></section>
    <p className={styles.disclosure}>Rekomendasi dan angka pada dashboard ini adalah simulasi awal. Solusi final, integrasi, waktu, dan dampak ditentukan setelah Discovery.</p>
  </main>;
}
