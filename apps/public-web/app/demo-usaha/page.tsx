"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./business-demos.module.css";

const businesses = [
  {
    id: "properti",
    label: "Kontrakan & Kosan",
    eyebrow: "Hunian sewa",
    title: "Pantau unit, tagihan, dan calon penyewa dalam satu layar.",
    copy: "Cocok untuk pemilik kontrakan atau kos yang ingin mengurangi pencatatan manual dan mempercepat respons kepada calon penyewa.",
  },
  {
    id: "ternak",
    label: "Peternakan",
    eyebrow: "Produksi ternak",
    title: "Perkembangan ternak dan jadwal perawatan lebih mudah diawasi.",
    copy: "Catat populasi, pakan, kesehatan, serta target panen agar keputusan harian tidak hanya mengandalkan ingatan.",
  },
  {
    id: "kebun",
    label: "Perkebunan",
    eyebrow: "Budidaya tanaman",
    title: "Lihat kondisi lahan dan jadwal kerja tanpa membuka banyak catatan.",
    copy: "Monitoring blok tanam, pemupukan, tenaga kerja, dan proyeksi panen menjadi lebih rapi serta mudah dilaporkan.",
  },
  {
    id: "tambak",
    label: "Tambak",
    eyebrow: "Budidaya perairan",
    title: "Siklus tambak, kualitas air, dan penggunaan pakan selalu terlihat.",
    copy: "Pantau kolam, umur budidaya, sampling, pakan, dan kesiapan panen dari dashboard operasional sederhana.",
  },
] as const;

type BusinessId = (typeof businesses)[number]["id"];

function PropertyDemo() {
  const [occupied, setOccupied] = useState(5);
  const available = 8 - occupied;
  return (
    <div className={styles.panel}>
      <div className={styles.panelTop}><div><small>Kos Harmoni · 8 unit</small><strong>{occupied} terisi</strong></div><span className={styles.good}>{Math.round((occupied / 8) * 100)}% okupansi</span></div>
      <div className={styles.unitGrid} aria-label="Status unit kos">
        {Array.from({ length: 8 }, (_, index) => <button key={index} type="button" className={index < occupied ? styles.occupied : ""} onClick={() => setOccupied(index < occupied ? Math.max(1, occupied - 1) : Math.min(8, occupied + 1))}><b>A{index + 1}</b><small>{index < occupied ? "Terisi" : "Tersedia"}</small></button>)}
      </div>
      <div className={styles.metrics}><div><small>Tagihan masuk</small><b>Rp4,8 jt</b></div><div><small>Unit tersedia</small><b>{available}</b></div><div><small>Calon penyewa</small><b>6</b></div></div>
      <p className={styles.hint}>Klik unit untuk mencoba perubahan okupansi.</p>
    </div>
  );
}

function FarmDemo() {
  const [feed, setFeed] = useState(68);
  return (
    <div className={styles.panel}>
      <div className={styles.panelTop}><div><small>Batch BR-08 · Ayam broiler</small><strong>1.240 ekor aktif</strong></div><span className={styles.good}>Hari ke-21</span></div>
      <div className={styles.progressCard}><div><span>Pertumbuhan menuju panen</span><b>64%</b></div><i><em style={{ width: "64%" }} /></i><small>Estimasi panen 13 hari lagi</small></div>
      <div className={styles.metrics}><div><small>Mortalitas</small><b>1,8%</b></div><div><small>Bobot rata-rata</small><b>1,12 kg</b></div><div><small>Stok pakan</small><b>{feed}%</b></div></div>
      <label className={styles.range}>Simulasikan stok pakan <input type="range" min="10" max="100" value={feed} onChange={(event) => setFeed(Number(event.target.value))} /></label>
    </div>
  );
}

function PlantationDemo() {
  const [block, setBlock] = useState(1);
  const blocks = [
    { name: "Blok A", crop: "Cabai", status: "Pemupukan", harvest: "24 hari" },
    { name: "Blok B", crop: "Jagung", status: "Perawatan", harvest: "41 hari" },
    { name: "Blok C", crop: "Melon", status: "Siap panen", harvest: "3 hari" },
  ];
  const selected = blocks[block]!;
  return (
    <div className={styles.panel}>
      <div className={styles.panelTop}><div><small>Kebun Sejahtera · 3 blok</small><strong>{selected.name} · {selected.crop}</strong></div><span className={styles.good}>{selected.status}</span></div>
      <div className={styles.blockTabs}>{blocks.map((item, index) => <button type="button" key={item.name} aria-pressed={block === index} onClick={() => setBlock(index)}>{item.name}<small>{item.crop}</small></button>)}</div>
      <div className={styles.metrics}><div><small>Estimasi panen</small><b>{selected.harvest}</b></div><div><small>Kelembapan</small><b>71%</b></div><div><small>Tugas hari ini</small><b>4</b></div></div>
      <div className={styles.activity}><span>✓ Pemeriksaan irigasi tercatat</span><time>08.40</time></div>
    </div>
  );
}

function PondDemo() {
  const [ph, setPh] = useState(7.4);
  const safe = ph >= 6.8 && ph <= 8.2;
  return (
    <div className={styles.panel}>
      <div className={styles.panelTop}><div><small>Tambak Mina · Kolam 03</small><strong>Udang vaname</strong></div><span className={safe ? styles.good : styles.warn}>{safe ? "Air stabil" : "Perlu tindakan"}</span></div>
      <div className={styles.water}><div className={styles.bubbleOne} /><div className={styles.bubbleTwo} /><span>DOC 47</span><strong>{ph.toFixed(1)} pH</strong><small>Sampling terakhir hari ini</small></div>
      <div className={styles.metrics}><div><small>Biomassa</small><b>1,8 ton</b></div><div><small>Pakan/hari</small><b>94 kg</b></div><div><small>Estimasi panen</small><b>33 hari</b></div></div>
      <label className={styles.range}>Ubah simulasi pH <input type="range" min="60" max="90" value={ph * 10} onChange={(event) => setPh(Number(event.target.value) / 10)} /></label>
    </div>
  );
}

export default function BusinessDemosPage() {
  const [activeId, setActiveId] = useState<BusinessId>("properti");
  const active = businesses.find((item) => item.id === activeId) ?? businesses[0];

  return (
    <main className={styles.page}>
      <nav className={styles.nav}><Link href="/">QIRA<span>.</span></Link><div><Link href="/#packages">Paket</Link><Link className={styles.navCta} href="/start?package=custom">Konsultasi</Link></div></nav>
      <header className={styles.hero}>
        <p>Galeri demo usaha</p><h1>Lihat solusi digital dalam konteks <em>usaha Anda.</em></h1>
        <span>Gunakan kontrol di setiap demo untuk merasakan bagaimana data operasional dapat dibuat lebih mudah dibaca dan ditindaklanjuti.</span>
      </header>
      <section className={styles.showcase}>
        <div className={styles.tabs} role="tablist" aria-label="Pilih jenis usaha">{businesses.map((item) => <button key={item.id} type="button" role="tab" aria-selected={activeId === item.id} onClick={() => setActiveId(item.id)}>{item.label}</button>)}</div>
        <div className={styles.stage} key={activeId}>
          <div className={styles.story}><p>{active.eyebrow}</p><h2>{active.title}</h2><span>{active.copy}</span><Link href={`/start?package=custom&business=${active.id}`}>Buat solusi untuk usaha saya <b>↗</b></Link></div>
          <div className={styles.preview}>{activeId === "properti" ? <PropertyDemo /> : activeId === "ternak" ? <FarmDemo /> : activeId === "kebun" ? <PlantationDemo /> : <PondDemo />}</div>
        </div>
      </section>
      <section className={styles.explain}><p>Yang dapat disesuaikan</p><div><article><b>01</b><h3>Data usaha</h3><span>Jenis unit, komoditas, kolam, siklus, atau indikator mengikuti proses nyata Anda.</span></article><article><b>02</b><h3>Alur kerja</h3><span>Status, pengingat, bukti kegiatan, dan persetujuan disusun sesuai cara tim bekerja.</span></article><article><b>03</b><h3>Tampilan & akses</h3><span>Brand, laporan, hak akses, serta pengalaman desktop dan ponsel dapat disesuaikan.</span></article></div></section>
      <footer className={styles.footer}><span>QIRA · Your Business, Understood.</span><Link href="/">Kembali ke beranda</Link></footer>
    </main>
  );
}
