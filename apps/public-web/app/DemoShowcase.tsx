"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./DemoShowcase.module.css";

const demos = [
  {id:"digital-foundation",label:"Digital Foundation",title:"Website usaha yang langsung siap menerima pelanggan.",copy:"Calon pelanggan memahami usaha, melihat layanan unggulan, lalu menghubungi Anda melalui WhatsApp.",problem:"Usaha sulit ditemukan dan informasi berulang kali dijelaskan melalui chat.",solution:"Website responsif, profil usaha, layanan unggulan, galeri, dan CTA WhatsApp.",outcome:"Usaha tampil lebih profesional dan pelanggan dapat memahami penawaran kapan saja.",duration:"1–2 minggu",uses:["Kuliner & katering","Jasa profesional","Homestay & kos","Pelatihan"]},
  {id:"growth-engine",label:"Growth Engine",title:"Prospek masuk dan tertata tanpa rekap manual.",copy:"Form digital menangkap kebutuhan pelanggan dan dashboard membantu tim menentukan tindak lanjut.",problem:"Prospek masuk dari berbagai kanal, terlambat ditindaklanjuti, atau hilang di percakapan.",solution:"Landing page, form lead, dashboard pipeline, status follow-up, dan ringkasan peluang.",outcome:"Setiap prospek memiliki pemilik, status, dan langkah tindak lanjut yang jelas.",duration:"2–4 minggu",uses:["Event organizer","Konsultan","Properti sewa","Jasa B2B"]},
  {id:"connected-growth",label:"Connected Growth",title:"Operasional bergerak dalam satu alur yang terlihat.",copy:"Permintaan, status pekerjaan, dokumen, dan notifikasi saling terhubung dalam dashboard sederhana.",problem:"Pekerjaan, dokumen, dan persetujuan tersebar sehingga progres sulit dipantau.",solution:"Dashboard operasional, workflow, dokumen otomatis, notifikasi, dan hak akses.",outcome:"Tim bekerja dengan alur yang konsisten dan pemilik melihat risiko sebelum terlambat.",duration:"3–6 minggu",uses:["Peternakan","Perkebunan","Tambak","Operasional layanan"]},
] as const;
type DemoId=(typeof demos)[number]["id"];

const foundationExamples=[
  {label:"Kuliner",small:"Dapur rumahan pilihan",title:"Pesan sajian favorit tanpa antre.",text:"Lihat menu, jadwal pemesanan, dan hubungi usaha langsung.",url:"dapurasa.id"},
  {label:"Jasa",small:"Solusi untuk bisnis Anda",title:"Keahlian yang mudah dipahami pelanggan.",text:"Tampilkan layanan, hasil kerja, dan jadwalkan konsultasi.",url:"jasamaju.id"},
  {label:"Kosan",small:"Hunian nyaman & terawat",title:"Temukan kamar yang cocok untuk Anda.",text:"Cek fasilitas, lokasi, unit tersedia, dan hubungi pengelola.",url:"kosharmoni.id"},
];

function FoundationDemo(){
  const [example,setExample]=useState(0);const item=foundationExamples[example]!;
  return <div className={styles.foundation} aria-label="Simulasi landing page UMKM">
    <div className={styles.exampleTabs}>{foundationExamples.map((entry,index)=><button type="button" key={entry.label} aria-pressed={example===index} onClick={()=>setExample(index)}>{entry.label}</button>)}</div>
    <div className={styles.browserBar}><i/><i/><i/><span>{item.url}</span></div>
    <div className={styles.foundationHero}><div><small>{item.small}</small><h3>{item.title}</h3><p>{item.text}</p><button type="button">Hubungi via WhatsApp</button></div><div className={styles.productVisual}><span>{item.label} unggulan</span><strong>01</strong></div></div>
    <div className={styles.foundationStats}><span><b>5</b> bagian informatif</span><span><b>1</b> CTA utama</span><span><b>24/7</b> mudah ditemukan</span></div>
  </div>;
}

const leads=[
  {initial:"NA",name:"Nadia",need:"Paket acara",statuses:["Baru","Dihubungi","Discovery"]},
  {initial:"RS",name:"Rizky",need:"Konsultasi",statuses:["Follow-up","Proposal","Negosiasi"]},
  {initial:"DM",name:"Dewi",need:"Pemesanan",statuses:["Proposal","Negosiasi","Menang"]},
];

function GrowthDemo(){
  const [steps,setSteps]=useState([0,0,0]);
  const advance=(index:number)=>setSteps(current=>current.map((value,itemIndex)=>itemIndex===index?Math.min(value+1,2):value));
  return <div className={styles.dashboard} aria-label="Simulasi dashboard prospek">
    <div className={styles.dashTop}><div><small>Prospek bulan ini</small><strong>48</strong></div><span className={styles.live}>● Live</span></div>
    <div className={styles.chart} aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/></div>
    <div className={styles.leadList}>{leads.map((lead,index)=><button type="button" key={lead.name} onClick={()=>advance(index)}><span>{lead.initial}</span><p><b>{lead.name}</b><small>{lead.need} · klik untuk lanjut</small></p><em>{lead.statuses[steps[index]!]}</em></button>)}</div>
  </div>;
}

const flowLabels=[["Permintaan","Data diterima"],["Diproses","Tim mengerjakan"],["Review","Menunggu validasi"],["Selesai","Notifikasi otomatis"]];

function ConnectedDemo(){
  const [step,setStep]=useState(1);
  return <div className={styles.workflow} aria-label="Simulasi alur operasional">
    <div className={styles.workflowHeader}><div><small>Operasional hari ini</small><strong>12 pekerjaan aktif</strong></div><span>92% tepat waktu</span></div>
    <div className={styles.flowLine}>{flowLabels.map((item,index)=><div key={item[0]} className={index<step?styles.done:index===step?styles.active:""}><b>{index<step?"✓":index+1}</b><span>{item[0]}<small>{item[1]}</small></span></div>)}</div>
    <div className={styles.workflowAction}><span>{step===3?"Dokumen #Q-104 selesai dan notifikasi terkirim":`Pekerjaan #Q-104 berada pada tahap ${flowLabels[step]![0]}`}</span><button type="button" onClick={()=>setStep(current=>(current+1)%4)}>Lanjutkan tahap</button></div>
  </div>;
}

export function DemoShowcase(){
  const [activeId,setActiveId]=useState<DemoId>("digital-foundation");
  const active=demos.find(item=>item.id===activeId)??demos[0];
  return <section className={styles.section} id="demo">
    <div className={styles.heading}><div><p>Demo interaktif</p><h2>Lihat gambaran hasilnya sebelum memulai.</h2></div><p>Setiap simulasi dapat diterapkan ke berbagai jenis usaha, lalu disesuaikan dengan identitas, proses, dan data bisnis Anda.</p></div>
    <div className={styles.tabs} role="tablist" aria-label="Pilih demo paket">{demos.map(demo=><button key={demo.id} type="button" role="tab" aria-selected={activeId===demo.id} onClick={()=>setActiveId(demo.id)}>{demo.label}</button>)}</div>
    <div className={styles.stage} key={activeId}><div className={styles.story}><span>Simulasi langsung</span><h3>{active.title}</h3><p>{active.copy}</p><Link href={`/start?package=${active.id}`}>Minta demo sesuai usaha saya <b>↗</b></Link></div><div className={styles.preview}>{activeId==="digital-foundation"?<FoundationDemo/>:activeId==="growth-engine"?<GrowthDemo/>:<ConnectedDemo/>}</div></div>
    <div className={styles.salesGrid}><article><small>Masalah umum</small><p>{active.problem}</p></article><article><small>Solusi QIRA</small><p>{active.solution}</p></article><article><small>Hasil yang dituju</small><p>{active.outcome}</p></article><aside><div><small>Cocok diterapkan untuk</small><div>{active.uses.map(item=><span key={item}>{item}</span>)}</div></div><div><small>Estimasi implementasi</small><strong>{active.duration}</strong><Link href={`/start?package=${active.id}`}>Diskusikan paket ini</Link></div></aside></div>
    <p className={styles.note}>Demo menggunakan data contoh. Hasil akhir mengikuti scope yang disepakati setelah discovery.</p>
  </section>;
}
