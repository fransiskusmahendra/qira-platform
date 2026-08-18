"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { findBusinessBlueprint } from "@qira/domain";
import styles from "./PersonalizedDemo.module.css";

type Profile = {
  businessTypeId: string;
  name: string;
  packageId: "digital-foundation" | "growth-engine" | "connected-growth";
  packageName: string;
  title: string;
  problem: string;
  modules: string[];
  metrics: { label: string; value: string }[];
  flow: string[];
};



function buildProfile(input: string): Profile {
  const blueprint = findBusinessBlueprint(input);
  if (blueprint) return {
    businessTypeId: blueprint.id,
    name: blueprint.name,
    packageId: blueprint.packageId,
    packageName: blueprint.packageName,
    title: blueprint.headline,
    problem: blueprint.problem,
    modules: [...blueprint.modules],
    metrics: blueprint.metrics.map(item => ({ ...item })),
    flow: [...blueprint.flow],
  };
  const operational=/stok|jadwal|karyawan|produksi|laporan|operasional|cabang|gudang/.test(input.toLowerCase());
  return operational
    ? {businessTypeId:"general-operations",name:"Usaha Anda",packageId:"connected-growth",packageName:"Connected Growth",title:"Operasional usaha Anda dibuat lebih mudah dipantau.",problem:"Deskripsi menunjukkan beberapa proses operasional perlu disatukan agar status, tugas, dan data tidak tersebar.",modules:["Dashboard operasional","Status pekerjaan","Pengingat otomatis","Laporan ringkas"],metrics:[{label:"Proses aktif",value:"12"},{label:"Perlu tindak lanjut",value:"3"},{label:"Tepat waktu",value:"92%"}],flow:["Permintaan","Diproses","Review","Selesai"]}
    : {businessTypeId:"general-business",name:"Usaha Anda",packageId:"digital-foundation",packageName:"Digital Foundation",title:"Pelanggan lebih mudah memahami dan menghubungi usaha Anda.",problem:"Prioritas awalnya adalah menyajikan informasi usaha dan jalur kontak yang jelas.",modules:["Profil usaha","Layanan unggulan","Galeri","CTA WhatsApp"],metrics:[{label:"Bagian informasi",value:"5"},{label:"CTA utama",value:"1"},{label:"Dapat diakses",value:"24/7"}],flow:["Temukan usaha","Lihat layanan","Hubungi","Pesan"]};
}

export function PersonalizedDemo() {
  const [businessName,setBusinessName]=useState("");
  const [teamSize,setTeamSize]=useState("1–3 orang");
  const [priority,setPriority]=useState("Merapikan operasional");
  const [description,setDescription]=useState("");
  const [profile,setProfile]=useState<Profile|null>(null);
  const submit=(event:FormEvent)=>{event.preventDefault();if(description.trim().length>=10){const nextProfile=buildProfile(description.trim());setProfile(nextProfile);window.localStorage.setItem("qira-problem-assessment",JSON.stringify({businessName,teamSize,priority,description:description.trim(),profile:nextProfile}));}};
  return <section className={styles.section} id="live-experience">
    <div className={styles.intro}><p>Live Problem Experience</p><h2>Rasakan bentuk solusi dari masalah usahamu.</h2><span>Tulis proses yang masih manual. QIRA akan memperlihatkan masalah, alur solusi, dashboard, dan paket yang paling mendekati kebutuhanmu.</span></div>
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.builderFields}><label>Nama usaha <input value={businessName} onChange={event=>setBusinessName(event.target.value)} maxLength={120} placeholder="Contoh: Nusantara Rent Car"/></label><label>Ukuran tim <select value={teamSize} onChange={event=>setTeamSize(event.target.value)}><option>1–3 orang</option><option>4–10 orang</option><option>11–25 orang</option><option>Lebih dari 25 orang</option></select></label><label>Prioritas utama <select value={priority} onChange={event=>setPriority(event.target.value)}><option>Mendapatkan pelanggan</option><option>Merapikan operasional</option><option>Mengurangi pencatatan manual</option><option>Membuat laporan lebih cepat</option></select></label></div>
      <label htmlFor="business-story">Tentang usaha dan kendala saat ini</label><div><textarea id="business-story" value={description} onChange={event=>setDescription(event.target.value)} minLength={10} maxLength={500} required rows={4} placeholder="Contoh: Kami menyewakan mobil. Jadwal booking, ketersediaan kendaraan, data penyewa, dan pembayaran masih dicatat terpisah sehingga sering sulit mengecek mobil yang tersedia..."/><button type="submit">Lihat rekomendasi <b>→</b></button></div>
    </form>
    {profile ? <div className={styles.result} aria-live="polite">
      <div className={styles.story}><span>Rekomendasi untuk</span><h3>{profile.name}</h3><p>{profile.problem}</p><div><small>Paket yang mungkin sesuai</small><strong>{profile.packageName}</strong></div></div>
      <div className={styles.dashboard}><div className={styles.dashTop}><div><small>Preview rekomendasi</small><h3>{profile.title}</h3></div><span>Detail setelah Discovery</span></div><p>Demo dashboard yang detail, modul, alur operasional, proposal, dan estimasi harga akan dibuat setelah Anda menyelesaikan Discovery.</p><div className={styles.metrics}>{profile.metrics.map(item=><div key={item.label}><small>{item.label}</small><b>{item.value}</b></div>)}</div><div className={styles.modules}>{profile.modules.slice(0,4).map((item,index)=><span key={item}><i>{index+1}</i>{item}</span>)}</div><div className={styles.flow}>{profile.flow.map((item,index)=><div key={item}><b>{index+1}</b><small>{item}</small></div>)}</div><Link className={styles.nextButton} href="/contoh-penerapan">Lanjut lihat cara QIRA membantu <b>→</b></Link></div>
    </div>:<div className={styles.emptyDashboard} aria-label="Contoh dashboard rental mobil"><div className={styles.previewHeader}><div><span>Contoh tampilan</span><strong>Dashboard Rental Mobil</strong></div></div><div className={styles.previewMetrics}><span><small>Mobil tersedia</small><b>8</b></span><span><small>Booking hari ini</small><b>3</b></span><span><small>Menunggu konfirmasi</small><b>2</b></span></div><div className={styles.previewBody}><div className={styles.previewChart}><small>Jumlah booking minggu ini</small><div><i/><i/><i/><i/><i/><i/></div></div><div className={styles.previewTasks}><small>Booking terbaru</small><span><i/>Avanza · Menunggu konfirmasi</span><span><i/>Innova · Kendaraan siap</span><span><i/>Brio · Sedang digunakan</span></div></div><p>Ceritakan usahamu melalui formulir di atas untuk melihat rekomendasi yang lebih sesuai.</p></div>}
    
  </section>;
}
