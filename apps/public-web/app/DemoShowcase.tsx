"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./DemoShowcase.module.css";

const demos = [
  {
    id: "digital-foundation",
    label: "Digital Foundation",
    title: "Website usaha yang langsung siap menerima pelanggan.",
    copy: "Calon pelanggan memahami usaha, melihat layanan unggulan, lalu menghubungi Anda melalui WhatsApp.",
  },
  {
    id: "growth-engine",
    label: "Growth Engine",
    title: "Prospek masuk dan tertata tanpa rekap manual.",
    copy: "Form digital menangkap kebutuhan pelanggan dan dashboard membantu tim menentukan tindak lanjut.",
  },
  {
    id: "connected-growth",
    label: "Connected Growth",
    title: "Operasional bergerak dalam satu alur yang terlihat.",
    copy: "Permintaan, status pekerjaan, dokumen, dan notifikasi saling terhubung dalam dashboard sederhana.",
  },
] as const;

type DemoId = (typeof demos)[number]["id"];

function FoundationDemo() {
  return (
    <div className={styles.foundation} aria-label="Simulasi landing page UMKM">
      <div className={styles.browserBar}><i /><i /><i /><span>usahamaju.id</span></div>
      <div className={styles.foundationHero}>
        <div><small>Produk lokal pilihan</small><h3>Rasa yang dibuat dengan sepenuh hati.</h3><p>Pesan mudah, respons cepat, dan informasi usaha yang jelas.</p><button type="button">Hubungi via WhatsApp</button></div>
        <div className={styles.productVisual}><span>Produk unggulan</span><strong>01</strong></div>
      </div>
      <div className={styles.foundationStats}><span><b>5</b> bagian informatif</span><span><b>1</b> tombol pemesanan</span><span><b>24/7</b> mudah ditemukan</span></div>
    </div>
  );
}

function GrowthDemo() {
  return (
    <div className={styles.dashboard} aria-label="Simulasi dashboard prospek">
      <div className={styles.dashTop}><div><small>Prospek bulan ini</small><strong>48</strong></div><span className={styles.live}>● Live</span></div>
      <div className={styles.chart} aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
      <div className={styles.leadList}>
        <div><span>NA</span><p><b>Nadia</b><small>Paket acara · Baru masuk</small></p><em>Baru</em></div>
        <div><span>RS</span><p><b>Rizky</b><small>Konsultasi · Perlu follow-up</small></p><em>Hari ini</em></div>
        <div><span>DM</span><p><b>Dewi</b><small>Pemesanan · Penawaran dikirim</small></p><em>Aktif</em></div>
      </div>
    </div>
  );
}

function ConnectedDemo() {
  return (
    <div className={styles.workflow} aria-label="Simulasi alur operasional">
      <div className={styles.workflowHeader}><div><small>Operasional hari ini</small><strong>12 pekerjaan aktif</strong></div><span>92% tepat waktu</span></div>
      <div className={styles.flowLine}>
        <div className={styles.done}><b>✓</b><span>Permintaan<small>Data diterima</small></span></div>
        <div className={styles.active}><b>2</b><span>Diproses<small>Tim mengerjakan</small></span></div>
        <div><b>3</b><span>Review<small>Menunggu validasi</small></span></div>
        <div><b>4</b><span>Selesai<small>Notifikasi otomatis</small></span></div>
      </div>
      <div className={styles.activity}><span>Dokumen #Q-104 dibuat otomatis</span><time>Baru saja</time></div>
    </div>
  );
}

export function DemoShowcase() {
  const [activeId, setActiveId] = useState<DemoId>("digital-foundation");
  const active = demos.find((item) => item.id === activeId) ?? demos[0];

  return (
    <section className={styles.section} id="demo">
      <div className={styles.heading}>
        <div><p>Demo interaktif</p><h2>Lihat gambaran hasilnya sebelum memulai.</h2></div>
        <p>Ini adalah simulasi pengalaman yang dapat disesuaikan dengan identitas, proses, dan kebutuhan usaha Anda.</p>
      </div>
      <div className={styles.tabs} role="tablist" aria-label="Pilih demo paket">
        {demos.map((demo) => <button key={demo.id} type="button" role="tab" aria-selected={activeId === demo.id} onClick={() => setActiveId(demo.id)}>{demo.label}</button>)}
      </div>
      <div className={styles.stage} key={activeId}>
        <div className={styles.story}><span>Simulasi langsung</span><h3>{active.title}</h3><p>{active.copy}</p><Link href={`/start?package=${active.id}`}>Diskusikan solusi ini <b>↗</b></Link></div>
        <div className={styles.preview}>
          {activeId === "digital-foundation" ? <FoundationDemo /> : activeId === "growth-engine" ? <GrowthDemo /> : <ConnectedDemo />}
        </div>
      </div>
      <p className={styles.note}>Demo menggunakan data contoh. Hasil akhir mengikuti scope yang disepakati setelah discovery.</p>
    </section>
  );
}
