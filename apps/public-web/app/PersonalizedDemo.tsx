"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import styles from "./PersonalizedDemo.module.css";

type Profile = {
  name: string;
  packageId: "digital-foundation" | "growth-engine" | "connected-growth";
  packageName: string;
  title: string;
  problem: string;
  modules: string[];
  metrics: { label: string; value: string }[];
  flow: string[];
};

const profiles = [
  { keys:["rental","mobil","motor","kendaraan","sewa mobil"], name:"Rental Kendaraan", packageId:"growth-engine", packageName:"Growth Engine", title:"Booking, armada, dan jatuh tempo dalam satu dashboard.", problem:"Ketersediaan kendaraan, jadwal sewa, pembayaran, dan perawatan mudah bertabrakan ketika dicatat lewat chat.", modules:["Kalender booking","Status armada","Data pelanggan","Pengingat kembali"], metrics:[["Armada siap","8"],["Disewa","5"],["Kembali hari ini","2"]], flow:["Permintaan","Cek armada","Pembayaran","Serah terima"]},
  { keys:["laundry","cuci","setrika"], name:"Laundry", packageId:"growth-engine", packageName:"Growth Engine", title:"Setiap cucian terlihat dari penerimaan sampai siap diambil.", problem:"Nota, berat cucian, status proses, pembayaran, dan kabar kepada pelanggan sering dicatat terpisah.", modules:["Order digital","Status pengerjaan","Nota otomatis","Notifikasi selesai"], metrics:[["Order aktif","24"],["Siap diambil","7"],["Selesai hari ini","13"]], flow:["Diterima","Dicuci","Disetrika","Siap diambil"]},
  { keys:["katering","catering","makanan","kuliner","kue","bakery","restoran"], name:"Kuliner & Katering", packageId:"growth-engine", packageName:"Growth Engine", title:"Pesanan, jadwal produksi, dan pelanggan tertata bersama.", problem:"Pesanan dari berbagai chat rawan terlewat dan kebutuhan produksi sulit dirangkum.", modules:["Katalog digital","Form pesanan","Jadwal produksi","Rekap pembayaran"], metrics:[["Pesanan aktif","18"],["Produksi besok","6"],["DP masuk","12"]], flow:["Pesanan","Konfirmasi","Produksi","Pengiriman"]},
  { keys:["salon","barbershop","barber","spa","kecantikan","makeup"], name:"Salon & Kecantikan", packageId:"growth-engine", packageName:"Growth Engine", title:"Jadwal layanan dan pelanggan tanpa antrean chat yang membingungkan.", problem:"Reservasi, pilihan layanan, staf, dan pengingat kunjungan sulit diselaraskan secara manual.", modules:["Reservasi online","Kalender staf","Riwayat pelanggan","Pengingat jadwal"], metrics:[["Booking hari ini","11"],["Slot tersedia","4"],["Pelanggan ulang","68%"]], flow:["Pilih layanan","Pilih jadwal","Konfirmasi","Selesai"]},
  { keys:["kos","kosan","kontrakan","properti","sewa kamar"], name:"Kontrakan & Kosan", packageId:"growth-engine", packageName:"Growth Engine", title:"Unit, penyewa, dan tagihan lebih mudah dipantau.", problem:"Status unit, jatuh tempo, dan calon penyewa tersebar di catatan serta WhatsApp.", modules:["Status unit","Data penyewa","Tagihan bulanan","Pengingat WhatsApp"], metrics:[["Unit terisi","5/8"],["Jatuh tempo","2"],["Calon penyewa","6"]], flow:["Inquiry","Survei","Pembayaran","Mulai sewa"]},
  { keys:["ternak","ayam","sapi","kambing","peternakan"], name:"Peternakan", packageId:"connected-growth", packageName:"Connected Growth", title:"Batch, pakan, kesehatan, dan panen selalu terlihat.", problem:"Perubahan populasi, pakan, kesehatan, biaya, serta target panen sulit dibandingkan.", modules:["Monitoring batch","Stok pakan","Catatan kesehatan","Proyeksi panen"], metrics:[["Populasi","1.240"],["Stok pakan","68%"],["Mortalitas","1,8%"]], flow:["Masuk batch","Perawatan","Sampling","Panen"]},
  { keys:["kebun","perkebunan","tani","pertanian","tanam"], name:"Perkebunan", packageId:"connected-growth", packageName:"Connected Growth", title:"Blok, aktivitas, biaya, dan panen dalam satu pandangan.", problem:"Jadwal lapangan dan biaya per blok sulit dievaluasi ketika pencatatan tersebar.", modules:["Dashboard blok","Kalender aktivitas","Tenaga kerja","Estimasi panen"], metrics:[["Blok aktif","3"],["Tugas hari ini","4"],["Siap panen","1"]], flow:["Tanam","Perawatan","Sampling","Panen"]},
  { keys:["tambak","ikan","lele","udang","kolam"], name:"Tambak & Budidaya Ikan", packageId:"connected-growth", packageName:"Connected Growth", title:"Kolam, kualitas air, pakan, dan pertumbuhan terpantau.", problem:"Parameter air dan penggunaan pakan tidak cepat menunjukkan kondisi yang memerlukan tindakan.", modules:["Monitoring kolam","Kualitas air","Pakan harian","Estimasi panen"], metrics:[["Kolam aktif","4"],["Air stabil","3/4"],["Panen terdekat","33 hari"]], flow:["Tebar","Perawatan","Sampling","Panen"]},
] as const;

function buildProfile(input: string): Profile {
  const normalized=input.toLowerCase();
  const match=profiles.find(item=>item.keys.some(key=>normalized.includes(key)));
  if(match) return {name:match.name,packageId:match.packageId,packageName:match.packageName,title:match.title,problem:match.problem,modules:[...match.modules],metrics:match.metrics.map(([label,value])=>({label,value})),flow:[...match.flow]};
  const operational=/stok|jadwal|karyawan|produksi|laporan|operasional|cabang|gudang/.test(normalized);
  return operational
    ? {name:"Usaha Anda",packageId:"connected-growth",packageName:"Connected Growth",title:"Operasional usaha Anda dibuat lebih mudah dipantau.",problem:"Deskripsi menunjukkan beberapa proses operasional perlu disatukan agar status, tugas, dan data tidak tersebar.",modules:["Dashboard operasional","Status pekerjaan","Pengingat otomatis","Laporan ringkas"],metrics:[{label:"Proses aktif",value:"12"},{label:"Perlu tindak lanjut",value:"3"},{label:"Tepat waktu",value:"92%"}],flow:["Permintaan","Diproses","Review","Selesai"]}
    : {name:"Usaha Anda",packageId:"digital-foundation",packageName:"Digital Foundation",title:"Pelanggan lebih mudah memahami dan menghubungi usaha Anda.",problem:"Dari deskripsi Anda, prioritas awalnya adalah menyajikan informasi usaha dan jalur kontak yang jelas.",modules:["Profil usaha","Layanan unggulan","Galeri","CTA WhatsApp"],metrics:[{label:"Bagian informasi",value:"5"},{label:"CTA utama",value:"1"},{label:"Dapat diakses",value:"24/7"}],flow:["Temukan usaha","Lihat layanan","Hubungi","Pesan"]};
}

export function PersonalizedDemo() {
  const [description,setDescription]=useState("");
  const [profile,setProfile]=useState<Profile|null>(null);
  const submit=(event:FormEvent)=>{event.preventDefault();if(description.trim().length>=10)setProfile(buildProfile(description.trim()))};
  const consultation=profile ? `/start?package=${profile.packageId}&need=${encodeURIComponent(description.slice(0,500))}` : "/start";
  return <section className={styles.section} id="demo-personal">
    <div className={styles.intro}><p>Demo Builder QIRA</p><h2>Ceritakan sedikit usahamu untuk melihat demonya.</h2><span>Tulis jenis usaha dan proses yang masih manual. QIRA akan menyusun concept demo yang paling mendekati kebutuhanmu.</span></div>
    <form className={styles.form} onSubmit={submit}><label htmlFor="business-story">Tentang usaha dan kendala saat ini</label><div><textarea id="business-story" value={description} onChange={event=>setDescription(event.target.value)} minLength={10} maxLength={500} required rows={4} placeholder="Contoh: Saya punya rental mobil 12 unit. Booking masih lewat WhatsApp dan sering bentrok, jadwal servis juga belum tercatat..."/><button type="submit">Buat demo saya <b>→</b></button></div><small>Coba juga: laundry, katering, salon, kosan, peternakan, perkebunan, atau tambak.</small></form>
    {profile ? <div className={styles.result} aria-live="polite">
      <div className={styles.story}><span>Concept demo untuk</span><h3>{profile.name}</h3><p>{profile.problem}</p><div><small>Rekomendasi awal</small><strong>{profile.packageName}</strong></div><Link href={consultation}>Diskusikan demo ini <b>↗</b></Link></div>
      <div className={styles.dashboard}><div className={styles.dashTop}><div><small>Ringkasan usaha</small><h3>{profile.title}</h3></div><span>● Demo aktif</span></div><div className={styles.metrics}>{profile.metrics.map(item=><div key={item.label}><small>{item.label}</small><b>{item.value}</b></div>)}</div><div className={styles.modules}>{profile.modules.map((item,index)=><span key={item}><i>{index+1}</i>{item}</span>)}</div><div className={styles.flow}>{profile.flow.map((item,index)=><div key={item}><b>{index===0?"✓":index+1}</b><small>{item}</small></div>)}</div></div>
    </div>:<div className={styles.empty}><span>✦</span><p>Demo personalmu akan muncul di sini setelah kamu menceritakan usaha.</p></div>}
    <p className={styles.disclosure}>Demo dibuat dari pola kebutuhan umum dan data simulasi. Rancangan final ditentukan setelah discovery bersama QIRA.</p>
  </section>;
}
