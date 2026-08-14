"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./business-demos.module.css";

const businesses = [
  {
    id: "properti", label: "Kontrakan & Kosan", eyebrow: "Hunian sewa",
    title: "Pantau unit, tagihan, dan calon penyewa dalam satu layar.",
    copy: "Cocok untuk pemilik kontrakan atau kos yang ingin mengurangi pencatatan manual dan mempercepat respons kepada calon penyewa.",
    problem: "Status unit, jatuh tempo, dan percakapan calon penyewa tersebar di buku serta WhatsApp.",
    solution: "Dashboard unit, data penyewa, tagihan bulanan, tunggakan, pengingat, dan pipeline calon penyewa.",
    outcome: "Penagihan lebih teratur, unit kosong cepat ditawarkan, dan riwayat penyewa mudah dicari.",
    package: "Growth Engine", duration: "2–4 minggu", phoneTitle: "Kos Harmoni", phoneMetric: "5/8 unit terisi", phoneNote: "2 tagihan jatuh tempo",
  },
  {
    id: "ternak", label: "Peternakan", eyebrow: "Produksi ternak",
    title: "Perkembangan ternak dan jadwal perawatan lebih mudah diawasi.",
    copy: "Catat populasi, pakan, kesehatan, biaya, serta target panen agar keputusan harian tidak hanya mengandalkan ingatan.",
    problem: "Pakan, mortalitas, bobot, kesehatan, dan biaya per batch sulit dibandingkan secara konsisten.",
    solution: "Pencatatan batch, stok dan konsumsi pakan, kesehatan, biaya operasional, serta proyeksi panen.",
    outcome: "Masalah lebih cepat terlihat dan performa setiap batch dapat dibandingkan sebelum panen.",
    package: "Connected Growth", duration: "3–6 minggu", phoneTitle: "Batch BR-08", phoneMetric: "1.240 ekor aktif", phoneNote: "Panen ±13 hari",
  },
  {
    id: "kebun", label: "Perkebunan", eyebrow: "Budidaya tanaman",
    title: "Lihat kondisi lahan dan jadwal kerja tanpa membuka banyak catatan.",
    copy: "Monitoring blok tanam, pemupukan, tenaga kerja, biaya, dan proyeksi panen menjadi lebih rapi serta mudah dilaporkan.",
    problem: "Aktivitas per blok, bahan, tenaga kerja, dan biaya tercampur sehingga hasil tiap komoditas sulit dievaluasi.",
    solution: "Dashboard blok tanam, kalender aktivitas, penggunaan bahan, tenaga kerja, biaya, dan estimasi hasil.",
    outcome: "Jadwal lapangan lebih disiplin dan pemilik dapat melihat biaya serta kesiapan panen per blok.",
    package: "Connected Growth", duration: "3–6 minggu", phoneTitle: "Kebun Sejahtera", phoneMetric: "3 blok aktif", phoneNote: "4 tugas hari ini",
  },
  {
    id: "tambak", label: "Tambak", eyebrow: "Budidaya perairan",
    title: "Siklus tambak, kualitas air, dan penggunaan pakan selalu terlihat.",
    copy: "Pantau kolam, umur budidaya, sampling, pakan, kematian, biaya, dan kesiapan panen dari dashboard operasional.",
    problem: "Catatan kualitas air, pakan, pertumbuhan, dan biaya tidak cepat menunjukkan kondisi yang perlu ditangani.",
    solution: "Monitoring kolam, parameter air, sampling, pakan, survival rate, biaya siklus, dan estimasi panen.",
    outcome: "Peringatan muncul lebih awal dan keputusan pemberian pakan maupun penanganan air lebih terukur.",
    package: "Connected Growth", duration: "3–6 minggu", phoneTitle: "Kolam 03", phoneMetric: "pH 7,4 · stabil", phoneNote: "Sampling hari ini",
  },
] as const;

type BusinessId = (typeof businesses)[number]["id"];

function PropertyDemo() {
  const [occupied, setOccupied] = useState(5);
  const [reminded, setReminded] = useState(false);
  const available = 8 - occupied;
  return <div className={styles.panel}>
    <div className={styles.panelTop}><div><small>Kos Harmoni · Agustus 2026</small><strong>{occupied} dari 8 unit terisi</strong></div><span className={styles.good}>{Math.round(occupied / 8 * 100)}% okupansi</span></div>
    <div className={styles.unitGrid} aria-label="Status unit kos">{Array.from({length:8},(_,index)=><button key={index} type="button" className={index<occupied?styles.occupied:""} onClick={()=>setOccupied(index<occupied?Math.max(1,occupied-1):Math.min(8,occupied+1))}><b>A{index+1}</b><small>{index<occupied?"Terisi":"Tersedia"}</small></button>)}</div>
    <div className={styles.metrics}><div><small>Pemasukan bulan ini</small><b>Rp4,8 jt</b></div><div><small>Unit tersedia</small><b>{available}</b></div><div><small>Calon penyewa</small><b>6</b></div><div><small>Jatuh tempo</small><b>2 tagihan</b></div></div>
    <div className={styles.actionRow}><span><b>{reminded?"✓ Pengingat terkirim":"A2 · Jatuh tempo hari ini"}</b><small>Rp850.000 · WhatsApp penyewa</small></span><button type="button" onClick={()=>setReminded(true)} disabled={reminded}>{reminded?"Terkirim":"Kirim pengingat"}</button></div>
    <p className={styles.hint}>Klik unit untuk mengubah okupansi, lalu coba pengingat tagihan.</p>
  </div>;
}

function FarmDemo() {
  const [feed, setFeed] = useState(68);
  const feedAlert = feed < 30;
  return <div className={styles.panel}>
    <div className={styles.panelTop}><div><small>Batch BR-08 · Ayam broiler</small><strong>1.240 ekor aktif</strong></div><span className={feedAlert?styles.warn:styles.good}>{feedAlert?"Stok pakan rendah":"Kondisi normal"}</span></div>
    <div className={styles.progressCard}><div><span>Pertumbuhan menuju panen</span><b>64%</b></div><i><em style={{width:"64%"}} /></i><small>Bobot 1,12 kg · target 1,75 kg · estimasi panen 13 hari</small></div>
    <div className={styles.metrics}><div><small>Mortalitas</small><b>1,8%</b></div><div><small>Pakan hari ini</small><b>82 kg</b></div><div><small>Stok pakan</small><b>{feed}%</b></div><div><small>Biaya berjalan</small><b>Rp18,4 jt</b></div></div>
    <label className={styles.range}>Simulasikan stok pakan <input aria-label="Persentase stok pakan" type="range" min="10" max="100" value={feed} onChange={event=>setFeed(Number(event.target.value))}/></label>
    <div className={styles.activity}><span>✓ Vaksinasi batch tercatat</span><time>07.15</time></div>
  </div>;
}

const plantationBlocks = [
  {name:"Blok A",crop:"Cabai",status:"Pemupukan",harvest:"24 hari",cost:"Rp6,2 jt",workers:4},
  {name:"Blok B",crop:"Jagung",status:"Perawatan",harvest:"41 hari",cost:"Rp4,8 jt",workers:3},
  {name:"Blok C",crop:"Melon",status:"Siap panen",harvest:"3 hari",cost:"Rp8,1 jt",workers:6},
];

function PlantationDemo() {
  const [block,setBlock]=useState(1);
  const [done,setDone]=useState(false);
  const selected=plantationBlocks[block]!;
  return <div className={styles.panel}>
    <div className={styles.panelTop}><div><small>Kebun Sejahtera · 3 blok</small><strong>{selected.name} · {selected.crop}</strong></div><span className={styles.good}>{selected.status}</span></div>
    <div className={styles.blockTabs}>{plantationBlocks.map((item,index)=><button type="button" key={item.name} aria-pressed={block===index} onClick={()=>{setBlock(index);setDone(false)}}>{item.name}<small>{item.crop}</small></button>)}</div>
    <div className={styles.metrics}><div><small>Estimasi panen</small><b>{selected.harvest}</b></div><div><small>Biaya blok</small><b>{selected.cost}</b></div><div><small>Tenaga kerja</small><b>{selected.workers} orang</b></div><div><small>Kelembapan</small><b>71%</b></div></div>
    <div className={styles.actionRow}><span><b>{done?"✓ Tugas selesai":"Pemeriksaan irigasi"}</b><small>{selected.name} · dijadwalkan hari ini</small></span><button type="button" onClick={()=>setDone(true)} disabled={done}>{done?"Tercatat":"Tandai selesai"}</button></div>
  </div>;
}

function PondDemo() {
  const [ph,setPh]=useState(7.4);
  const [feed,setFeed]=useState(94);
  const safe=ph>=6.8&&ph<=8.2;
  const projected=Math.round((1800*72000-feed*33*14000)/100000)/10;
  return <div className={styles.panel}>
    <div className={styles.panelTop}><div><small>Tambak Mina · Kolam 03 · DOC 47</small><strong>Udang vaname</strong></div><span className={safe?styles.good:styles.warn}>{safe?"Air stabil":"Perlu tindakan"}</span></div>
    <div className={styles.water}><div className={styles.bubbleOne}/><div className={styles.bubbleTwo}/><span>Sampling terakhir hari ini</span><strong>{ph.toFixed(1)} pH</strong><small>DO 5,4 mg/L · suhu 29°C</small></div>
    <div className={styles.metrics}><div><small>Biomassa</small><b>1,8 ton</b></div><div><small>Pakan/hari</small><b>{feed} kg</b></div><div><small>Survival rate</small><b>86%</b></div><div><small>Proyeksi margin</small><b>Rp{projected} jt</b></div></div>
    <div className={styles.dualRange}><label>Simulasi pH <input aria-label="Nilai pH air" type="range" min="60" max="90" value={ph*10} onChange={event=>setPh(Number(event.target.value)/10)}/></label><label>Pakan per hari <input aria-label="Pakan kilogram per hari" type="range" min="60" max="130" value={feed} onChange={event=>setFeed(Number(event.target.value))}/></label></div>
  </div>;
}

function PhonePreview({business}:{business:(typeof businesses)[number]}) {
  return <div className={styles.phoneWrap}><div className={styles.phone}><div className={styles.phoneTop}><i/><span>09:41</span></div><small>Ringkasan hari ini</small><h3>{business.phoneTitle}</h3><div className={styles.phoneMetric}><span>Status utama</span><b>{business.phoneMetric}</b></div><div className={styles.phoneAlert}><i>✓</i><span><b>{business.phoneNote}</b><small>Data tersinkron otomatis</small></span></div><nav><b>⌂</b><span>▦</span><span>◎</span></nav></div><p>Simulasi tampilan ponsel</p></div>;
}

export default function BusinessDemosPage(){
  const [activeId,setActiveId]=useState<BusinessId>("properti");
  const active=businesses.find(item=>item.id===activeId)??businesses[0];
  return <main className={styles.page}>
    <nav className={styles.nav}><Link href="/">QIRA<span>.</span></Link><div><Link href="/#packages">Paket</Link><Link className={styles.navCta} href="/discovery">Mulai Discovery</Link></div></nav>
    <header className={styles.hero}><div className={styles.conceptBadge}><b>Concept demo</b><span>Data simulasi · bukan sistem pelanggan aktif</span></div><p>Galeri demo usaha</p><h1>Lihat solusi digital dalam konteks <em>usaha Anda.</em></h1><span>Gunakan kontrol di setiap demo untuk merasakan bagaimana data operasional dapat dibuat lebih mudah dibaca dan ditindaklanjuti.</span></header>
    <section className={styles.showcase}>
      <div className={styles.tabs} role="tablist" aria-label="Pilih jenis usaha">{businesses.map(item=><button key={item.id} type="button" role="tab" aria-selected={activeId===item.id} onClick={()=>setActiveId(item.id)}>{item.label}</button>)}</div>
      <div className={styles.stage} key={activeId}><div className={styles.story}><p>{active.eyebrow}</p><h2>{active.title}</h2><span>{active.copy}</span><Link href="/discovery">Discovery untuk usaha saya <b>↗</b></Link></div><div className={styles.preview}>{activeId==="properti"?<PropertyDemo/>:activeId==="ternak"?<FarmDemo/>:activeId==="kebun"?<PlantationDemo/>:<PondDemo/>}</div></div>
      <div className={styles.caseGrid}>
        <article><small>Masalah umum</small><p>{active.problem}</p></article><article><small>Solusi QIRA</small><p>{active.solution}</p></article><article><small>Hasil yang dituju</small><p>{active.outcome}</p></article>
        <aside><PhonePreview business={active}/><div><small>Rekomendasi awal</small><h3>{active.package}</h3><p>Estimasi implementasi {active.duration}. Scope dan paket final ditentukan setelah discovery.</p><Link href="/discovery">Lanjutkan ke Discovery</Link></div></aside>
      </div>
    </section>
    <section className={styles.explain}><p>Yang dapat disesuaikan</p><div><article><b>01</b><h3>Data usaha</h3><span>Jenis unit, komoditas, kolam, siklus, atau indikator mengikuti proses nyata Anda.</span></article><article><b>02</b><h3>Alur kerja</h3><span>Status, pengingat, bukti kegiatan, dan persetujuan disusun sesuai cara tim bekerja.</span></article><article><b>03</b><h3>Tampilan & akses</h3><span>Brand, laporan, hak akses, serta pengalaman desktop dan ponsel dapat disesuaikan.</span></article></div></section>
    <footer className={styles.footer}><span>QIRA · Your Business, Understood.</span><Link href="/">Kembali ke beranda</Link></footer>
  </main>;
}
