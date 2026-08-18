"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";

import { calculateCommercialTerms, classifyDiscoveryTriage, createProposalPreview, findService, getBusinessBlueprint, findBusinessBlueprint, PROPOSAL_PACKAGES, type ProposalPackageId } from "@qira/domain";
import { readDiscoveryDraft, type DiscoveryPreviewDraft } from "../_lib/draft";
import styles from "./proposal.module.css";
import { submitProposalDecision, type DecisionResult } from "./actions";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

function recommendPackage(draft: DiscoveryPreviewDraft): ProposalPackageId {
  if (draft.serviceId === "ai-employees") return "connected-growth";
  if (draft.serviceId === "automation") return draft.assessment.complexity >= 4 ? "connected-growth" : "growth-engine";
  if (draft.serviceId === "business-apps") return draft.assessment.complexity <= 2 ? "digital-foundation" : "growth-engine";
  return "digital-foundation";
}

type BusinessDemoCore = { name: string; headline: string; modules: string[]; metrics: { label: string; value: string }[]; flow: string[] };
type BusinessDemo = BusinessDemoCore & { entities: string[]; roles: string[]; rules: string[]; outputs: string[]; integrations: string[] };
type PrototypeView = "dashboard" | "data" | "workflow" | "governance";

const BLUEPRINTS: Record<string, Pick<BusinessDemo, "entities" | "roles" | "rules" | "outputs" | "integrations">> = {
  "Operasional rental": { entities: ["Armada", "Customer", "Booking", "Pembayaran", "Perawatan"], roles: ["Owner", "Admin booking", "Petugas serah terima"], rules: ["Armada terisi tidak dapat dipesan", "Booking aktif membutuhkan konfirmasi pembayaran", "Jadwal servis memblokir ketersediaan"], outputs: ["Invoice", "Surat serah terima", "Laporan utilisasi"], integrations: ["WhatsApp", "Payment confirmation", "Calendar"] },
  "Operasional laundry": { entities: ["Customer", "Order", "Layanan", "Berat", "Pembayaran"], roles: ["Owner", "Kasir", "Operator produksi"], rules: ["Order memiliki nomor unik", "Status bergerak sesuai urutan proses", "Order selesai menunggu pembayaran"], outputs: ["Nota", "Label order", "Laporan harian"], integrations: ["WhatsApp", "Printer nota", "Payment confirmation"] },
  "Pesanan kuliner": { entities: ["Customer", "Pesanan", "Menu", "Jadwal produksi", "Pengiriman"], roles: ["Owner", "Admin order", "Tim produksi"], rules: ["Produksi dimulai setelah DP", "Kapasitas dibatasi per tanggal", "Pengiriman mengikuti status produksi"], outputs: ["Invoice", "Daftar produksi", "Surat jalan"], integrations: ["WhatsApp", "Calendar", "Payment confirmation"] },
  "Reservasi layanan": { entities: ["Customer", "Layanan", "Staf", "Jadwal", "Pembayaran"], roles: ["Owner", "Resepsionis", "Staf layanan"], rules: ["Satu staf tidak boleh memiliki jadwal bentrok", "Slot terkunci setelah konfirmasi", "Pengingat dikirim sebelum kunjungan"], outputs: ["Konfirmasi booking", "Jadwal staf", "Laporan layanan"], integrations: ["WhatsApp", "Calendar", "Payment confirmation"] },
  "Pengelolaan properti": { entities: ["Unit", "Penyewa", "Tagihan", "Pembayaran", "Keluhan"], roles: ["Owner", "Admin properti", "Petugas lapangan"], rules: ["Unit terisi tidak dapat ditawarkan", "Tagihan terbentuk sesuai jatuh tempo", "Tunggakan memicu pengingat"], outputs: ["Invoice sewa", "Kwitansi", "Laporan okupansi"], integrations: ["WhatsApp", "Payment confirmation", "Document storage"] },
  "Monitoring produksi": { entities: ["Batch", "Lokasi", "Aktivitas", "Stok", "Sampling"], roles: ["Owner", "Supervisor", "Petugas lapangan"], rules: ["Aktivitas mengikuti fase produksi", "Nilai di luar batas memicu alarm", "Pemakaian mengurangi stok"], outputs: ["Log harian", "Laporan biaya", "Proyeksi hasil"], integrations: ["WhatsApp", "Sensor/data import", "Spreadsheet export"] },
  "Monitoring peternakan": { entities:["Batch","Populasi","Pakan","Kesehatan","Bobot","Biaya"], roles:["Owner","Kepala kandang","Petugas lapangan"], rules:["Mortalitas di atas batas memicu alarm","Pemakaian pakan mengurangi stok","Sampling memperbarui proyeksi panen"], outputs:["Log kandang","Laporan performa batch","Proyeksi panen"], integrations:["WhatsApp","Spreadsheet import","Export laporan"] },
  "Monitoring perkebunan": { entities:["Blok","Tanaman","Aktivitas","Tenaga kerja","Bahan","Panen"], roles:["Owner","Koordinator lapangan","Mandor"], rules:["Aktivitas mengikuti jadwal per blok","Tugas terlambat memicu pengingat","Pemakaian bahan tercatat per lokasi"], outputs:["Jadwal kerja","Laporan biaya blok","Estimasi panen"], integrations:["WhatsApp","Foto lapangan","Spreadsheet export"] },
  "Monitoring tambak": { entities:["Kolam","Kualitas air","Pakan","Sampling","Kesehatan","Panen"], roles:["Owner","Koordinator kolam","Petugas lapangan"], rules:["Parameter di luar batas memicu alarm","Pakan tercatat per kolam","Sampling memperbarui proyeksi panen"], outputs:["Log kolam","Laporan pertumbuhan","Proyeksi panen"], integrations:["WhatsApp","Sensor/data import","Spreadsheet export"] },
  "Operasional bengkel": { entities:["Pelanggan","Kendaraan","Work order","Mekanik","Sparepart","Pembayaran"], roles:["Owner","Admin servis","Mekanik"], rules:["Setiap kendaraan memiliki work order","Sparepart terpakai mengurangi stok","Servis selesai setelah pemeriksaan akhir"], outputs:["Estimasi servis","Invoice","Riwayat kendaraan"], integrations:["WhatsApp","Printer nota","Payment confirmation"] },
  "Operasional warung": { entities:["Produk prioritas","Penjualan","Pembelian","Pemasok","Utang","Piutang"], roles:["Owner","Kasir","Petugas pembelian"], rules:["Penjualan mengurangi stok prioritas","Stok minimum memicu daftar belanja","Bon memiliki pelanggan dan jatuh tempo"], outputs:["Rekap harian","Daftar belanja","Laporan utang-piutang"], integrations:["Printer nota","Spreadsheet import","Payment confirmation"] },
  "Produksi fashion": { entities:["Pelanggan","Pesanan","Ukuran","Desain","Bahan","Produksi"], roles:["Owner","Admin pesanan","Penjahit"], rules:["Pesanan memiliki ukuran dan tenggat","Produksi mengikuti tahapan","Pengambilan memerlukan status pembayaran"], outputs:["Nota pesanan","Kartu ukuran","Jadwal produksi"], integrations:["WhatsApp","Upload desain","Printer nota"] },
  "Operasional toko online": { entities:["Produk","Pesanan","Pembayaran","Packing","Resi","Pelanggan"], roles:["Owner","Admin order","Tim packing"], rules:["Order lunas masuk antrean packing","Resi terhubung ke satu order","Penjualan mengurangi stok"], outputs:["Daftar packing","Label pengiriman","Laporan penjualan"], integrations:["Marketplace import","WhatsApp","Ekspedisi/resi"] },
  "Operasional servis teknisi": { entities:["Tiket","Pelanggan","Perangkat","Teknisi","Sparepart","Garansi"], roles:["Owner","Admin","Teknisi lapangan"], rules:["Tiket memiliki teknisi dan jadwal","Biaya memerlukan persetujuan","Kunjungan ulang memeriksa garansi"], outputs:["Work order","Invoice servis","Kartu garansi"], integrations:["WhatsApp","Maps/location","Payment confirmation"] },
  "Produksi percetakan": { entities:["Order","File","Spesifikasi","Mesin","Produksi","Pembayaran"], roles:["Owner","Admin order","Operator"], rules:["Produksi menunggu file terkonfirmasi","Antrean mengikuti tenggat","Order selesai menunggu pembayaran"], outputs:["Nota order","Job sheet","Daftar pengambilan"], integrations:["Upload file","WhatsApp","Printer nota"] },
  "Operasional penginapan": { entities:["Kamar","Reservasi","Tamu","Pembayaran","Check-in","Housekeeping"], roles:["Owner","Resepsionis","Housekeeping"], rules:["Kamar terisi tidak dapat dipesan","Check-out membuat tugas housekeeping","Check-in memerlukan data tamu"], outputs:["Konfirmasi reservasi","Kwitansi","Laporan okupansi"], integrations:["WhatsApp","Calendar","Payment confirmation"] },
  "Operasional bimbingan belajar": { entities:["Siswa","Pengajar","Kelas","Jadwal","Absensi","Tagihan"], roles:["Owner","Admin akademik","Pengajar"], rules:["Pengajar tidak boleh bentrok jadwal","Absensi tercatat per pertemuan","Tagihan mengikuti program siswa"], outputs:["Jadwal kelas","Laporan absensi","Invoice belajar"], integrations:["WhatsApp","Calendar","Spreadsheet export"] },
  "Operasional depot air": { entities:["Pesanan","Pelanggan","Alamat","Kurir","Galon","Pembayaran"], roles:["Owner","Admin pesanan","Kurir"], rules:["Pesanan memiliki area pengantaran","Galon keluar-kembali tercatat","Pesanan selesai setelah konfirmasi"], outputs:["Daftar antar","Nota","Rekap galon"], integrations:["WhatsApp","Maps/location","Printer nota"] },
  "Produksi kerajinan": { entities:["Pesanan","Desain","Bahan","Tahap produksi","Biaya","Pengiriman"], roles:["Owner","Admin proyek","Tim produksi"], rules:["Produksi dimulai setelah desain disetujui","Pemakaian bahan masuk biaya pesanan","Pengiriman menunggu pemeriksaan akhir"], outputs:["Penawaran","Job sheet","Laporan biaya pesanan"], integrations:["Upload desain","WhatsApp","Spreadsheet export"] },
  "Manajemen event": { entities:["Klien","Acara","Tugas","Vendor","Perlengkapan","Pembayaran"], roles:["Owner","Project manager","Tim acara"], rules:["Tugas memiliki PIC dan tenggat","Vendor memerlukan konfirmasi","Checklist wajib selesai sebelum acara"], outputs:["Timeline acara","Checklist","Laporan anggaran"], integrations:["WhatsApp","Calendar","Document storage"] },
  "Manajemen proyek konstruksi": { entities:["Proyek","Pekerjaan","Progres","Material","Tenaga kerja","Termin"], roles:["Owner","Site manager","Admin proyek"], rules:["Progres memerlukan bukti lapangan","Material tercatat per proyek","Termin mengikuti progres disetujui"], outputs:["Laporan progres","Rekap material","Invoice termin"], integrations:["Foto lapangan","WhatsApp","Spreadsheet export"] },
};

const BUSINESS_DEMOS: { terms: string[]; demo: BusinessDemoCore }[] = [
  { terms: ["rental", "mobil", "motor", "kendaraan"], demo: { name: "Operasional rental", headline: "Booking, armada, pembayaran, dan perawatan dalam satu dashboard.", modules: ["Kalender booking", "Status armada", "Data penyewa", "Pengingat kembali"], metrics: [{ label: "Armada siap", value: "8" }, { label: "Sedang disewa", value: "5" }, { label: "Kembali hari ini", value: "2" }], flow: ["Permintaan", "Cek armada", "Pembayaran", "Serah terima"] } },
  { terms: ["laundry", "cuci", "setrika"], demo: { name: "Operasional laundry", headline: "Setiap cucian terlihat dari penerimaan sampai siap diambil.", modules: ["Order digital", "Status pengerjaan", "Nota otomatis", "Notifikasi selesai"], metrics: [{ label: "Order aktif", value: "24" }, { label: "Siap diambil", value: "7" }, { label: "Selesai hari ini", value: "13" }], flow: ["Diterima", "Dicuci", "Disetrika", "Siap diambil"] } },
  { terms: ["katering", "catering", "kuliner", "restoran", "bakery"], demo: { name: "Pesanan kuliner", headline: "Pesanan, jadwal produksi, pembayaran, dan pengiriman tertata bersama.", modules: ["Katalog & pesanan", "Jadwal produksi", "Rekap DP", "Status pengiriman"], metrics: [{ label: "Pesanan aktif", value: "18" }, { label: "Produksi besok", value: "6" }, { label: "DP diterima", value: "12" }], flow: ["Pesanan", "Konfirmasi", "Produksi", "Pengiriman"] } },
  { terms: ["salon", "barber", "spa", "kecantikan"], demo: { name: "Reservasi layanan", headline: "Jadwal layanan dan pelanggan tanpa antrean chat yang membingungkan.", modules: ["Reservasi online", "Kalender staf", "Riwayat pelanggan", "Pengingat jadwal"], metrics: [{ label: "Booking hari ini", value: "11" }, { label: "Slot tersedia", value: "4" }, { label: "Pelanggan ulang", value: "68%" }], flow: ["Pilih layanan", "Pilih jadwal", "Konfirmasi", "Selesai"] } },
  { terms: ["kos", "kontrakan", "properti", "sewa kamar"], demo: { name: "Pengelolaan properti", headline: "Unit, penyewa, tagihan, dan tindak lanjut lebih mudah dipantau.", modules: ["Status unit", "Data penyewa", "Tagihan bulanan", "Pengingat WhatsApp"], metrics: [{ label: "Unit terisi", value: "5/8" }, { label: "Jatuh tempo", value: "2" }, { label: "Calon penyewa", value: "6" }], flow: ["Inquiry", "Survei", "Pembayaran", "Mulai sewa"] } },
  { terms:["ternak","ayam","sapi","kambing","peternakan"], demo:{ name:"Monitoring peternakan", headline:"Populasi, pakan, kesehatan, biaya, dan target panen terlihat per batch.", modules:["Dashboard batch","Stok pakan","Catatan kesehatan","Proyeksi panen"], metrics:[{label:"Populasi",value:"1.240"},{label:"Stok pakan",value:"68%"},{label:"Mortalitas",value:"1,8%"}], flow:["Masuk batch","Perawatan","Sampling","Panen"] } },
  { terms:["kebun","perkebunan","tani","pertanian","tanam"], demo:{ name:"Monitoring perkebunan", headline:"Blok, jadwal lapangan, bahan, biaya, dan panen dalam satu pandangan.", modules:["Dashboard blok","Kalender aktivitas","Tenaga kerja","Estimasi panen"], metrics:[{label:"Blok aktif",value:"3"},{label:"Tugas hari ini",value:"4"},{label:"Siap panen",value:"1"}], flow:["Tanam","Perawatan","Sampling","Panen"] } },
  { terms:["tambak","ikan","lele","udang","kolam"], demo:{ name:"Monitoring tambak", headline:"Kolam, kualitas air, pakan, pertumbuhan, dan panen terpantau.", modules:["Monitoring kolam","Kualitas air","Pakan harian","Estimasi panen"], metrics:[{label:"Kolam aktif",value:"4"},{label:"Air stabil",value:"3/4"},{label:"Panen terdekat",value:"33 hari"}], flow:["Tebar","Perawatan","Sampling","Panen"] } },
  { terms:["bengkel","servis motor","servis mobil","sparepart","oli"], demo:{ name:"Operasional bengkel", headline:"Antrean servis, pekerjaan mekanik, sparepart, dan riwayat kendaraan tertata.", modules:["Antrean servis","Work order","Stok sparepart","Riwayat kendaraan"], metrics:[{label:"Servis aktif",value:"9"},{label:"Menunggu sparepart",value:"2"},{label:"Selesai hari ini",value:"7"}], flow:["Daftar","Pemeriksaan","Pengerjaan","Serah terima"] } },
  { terms:["warung","kelontong","sembako","minimarket","ritel"], demo:{ name:"Operasional warung", headline:"Penjualan, stok prioritas, pemasok, dan utang-piutang mudah dipantau.", modules:["Penjualan sederhana","Stok prioritas","Pemasok","Utang-piutang"], metrics:[{label:"Transaksi hari ini",value:"46"},{label:"Stok menipis",value:"8"},{label:"Piutang aktif",value:"5"}], flow:["Barang masuk","Penjualan","Stok berubah","Rekap"] } },
  { terms:["penjahit","jahit","konveksi","fashion","butik","pakaian"], demo:{ name:"Produksi fashion", headline:"Pesanan, ukuran, bahan, produksi, dan tenggat tersusun per pelanggan.", modules:["Pesanan pelanggan","Ukuran & desain","Status produksi","Jadwal selesai"], metrics:[{label:"Pesanan aktif",value:"21"},{label:"Selesai minggu ini",value:"8"},{label:"Menunggu fitting",value:"4"}], flow:["Pesan","Ukur","Produksi","Fitting"] } },
  { terms:["toko online","reseller","dropship","marketplace","seller"], demo:{ name:"Operasional toko online", headline:"Order, pembayaran, packing, resi, dan stok dirangkum dalam satu proses.", modules:["Daftar pesanan","Status pembayaran","Packing & resi","Stok produk"], metrics:[{label:"Pesanan baru",value:"17"},{label:"Siap dikirim",value:"11"},{label:"Perlu tindak lanjut",value:"3"}], flow:["Order","Bayar","Packing","Kirim"] } },
  { terms:["servis ac","service ac","elektronik","teknisi","reparasi alat"], demo:{ name:"Operasional servis teknisi", headline:"Permintaan servis, teknisi, jadwal, biaya, dan garansi terlihat jelas.", modules:["Tiket servis","Jadwal teknisi","Estimasi biaya","Garansi pekerjaan"], metrics:[{label:"Tiket aktif",value:"14"},{label:"Kunjungan hari ini",value:"6"},{label:"Garansi aktif",value:"9"}], flow:["Laporan","Jadwal","Perbaikan","Konfirmasi"] } },
  { terms:["percetakan","fotocopy","fotokopi","sablon","printing"], demo:{ name:"Produksi percetakan", headline:"File, spesifikasi, antrean produksi, dan pembayaran terhubung per order.", modules:["Order cetak","File & spesifikasi","Antrean produksi","Pengambilan"], metrics:[{label:"Antrean order",value:"16"},{label:"Diproduksi",value:"7"},{label:"Siap diambil",value:"5"}], flow:["Kirim file","Konfirmasi","Produksi","Ambil"] } },
  { terms:["homestay","penginapan","guest house","hotel kecil","villa"], demo:{ name:"Operasional penginapan", headline:"Kamar, reservasi, tamu, pembayaran, dan housekeeping terhubung.", modules:["Kalender kamar","Data tamu","Check-in/out","Housekeeping"], metrics:[{label:"Terisi",value:"8/12"},{label:"Check-in hari ini",value:"3"},{label:"Perlu dibersihkan",value:"2"}], flow:["Reservasi","Check-in","Menginap","Check-out"] } },
  { terms:["bimbel","les privat","kursus","pelatihan","training","sertifikasi","sertifikat","lpk","kelas"], demo:{ name:"Kursus, Pelatihan & Sertifikasi", headline:"Program, batch, peserta, trainer, asesmen, dan sertifikat terkelola dalam satu dashboard.", modules:["Katalog & batch","Data peserta","Kehadiran","Asesmen","Sertifikat digital"], metrics:[{label:"Peserta aktif",value:"84"},{label:"Batch berjalan",value:"7"},{label:"Sertifikat terbit",value:"62"}], flow:["Pendaftaran","Penjadwalan","Pelatihan","Asesmen","Sertifikasi"] } },
  { terms:["depot air","air isi ulang","galon","depot minum"], demo:{ name:"Operasional depot air", headline:"Pesanan galon, pelanggan, rute antar, dan pembayaran terpantau.", modules:["Pesanan galon","Rute pengantaran","Data pelanggan","Galon & pembayaran"], metrics:[{label:"Pesanan hari ini",value:"38"},{label:"Dalam pengantaran",value:"12"},{label:"Galon dipinjam",value:"21"}], flow:["Pesan","Siapkan","Antar","Konfirmasi"] } },
  { terms:["kerajinan","mebel","furniture","furnitur","pengrajin","souvenir"], demo:{ name:"Produksi kerajinan", headline:"Pesanan khusus, bahan, produksi, biaya, dan tenggat dapat dipantau.", modules:["Pesanan custom","Bahan baku","Tahap produksi","Biaya pesanan"], metrics:[{label:"Pesanan aktif",value:"13"},{label:"Dalam produksi",value:"8"},{label:"Jatuh tempo",value:"4"}], flow:["Desain","Persetujuan","Produksi","Pengiriman"] } },
  { terms:["event organizer","wedding organizer","dekorasi","wedding","acara"," eo "], demo:{ name:"Manajemen event", headline:"Klien, jadwal acara, vendor, tugas, dan pembayaran terkoordinasi.", modules:["Proyek acara","Timeline tugas","Vendor & perlengkapan","Pembayaran klien"], metrics:[{label:"Acara aktif",value:"6"},{label:"Tugas minggu ini",value:"19"},{label:"Menunggu approval",value:"4"}], flow:["Brief","Persiapan","Pelaksanaan","Penutupan"] } },
  { terms:["kontraktor","renovasi","tukang bangunan","proyek bangunan","interior"], demo:{ name:"Manajemen proyek konstruksi", headline:"Proyek, progres, material, tenaga kerja, dan pembayaran terlihat per lokasi.", modules:["Dashboard proyek","Progres lapangan","Material & biaya","Termin pembayaran"], metrics:[{label:"Proyek aktif",value:"5"},{label:"Tugas terlambat",value:"3"},{label:"Termin minggu ini",value:"2"}], flow:["Survei","Penawaran","Pelaksanaan","Serah terima"] } },
    { terms: ["ternak", "ayam", "sapi", "kambing", "tambak", "ikan", "lele", "udang", "kebun", "pertanian"], demo: { name: "Monitoring produksi", headline: "Aktivitas, stok, kondisi, biaya, dan target panen selalu terlihat.", modules: ["Monitoring batch", "Stok & pemakaian", "Catatan kondisi", "Proyeksi panen"], metrics: [{ label: "Batch aktif", value: "4" }, { label: "Kondisi stabil", value: "92%" }, { label: "Target terdekat", value: "33 hari" }], flow: ["Mulai batch", "Perawatan", "Sampling", "Panen"] } },
];

function createBusinessDemo(draft: DiscoveryPreviewDraft): BusinessDemo {
  const context = [draft.answers.business_profile, draft.answers.current_process, draft.answers.pain_point].join(" ");
  const blueprint = getBusinessBlueprint(draft.businessTypeId) ?? findBusinessBlueprint(context);
  if (blueprint) return {
    name: blueprint.name,
    headline: blueprint.headline,
    modules: [...blueprint.modules],
    metrics: blueprint.metrics.map(item => ({ ...item })),
    flow: [...blueprint.flow],
    entities: [...blueprint.entities],
    roles: [...blueprint.roles],
    rules: [...blueprint.rules],
    outputs: [...blueprint.outputs],
    integrations: [...blueprint.integrations],
  };
  return {
    name: "Operasional usaha Anda",
    headline: "Permintaan, pekerjaan, status, dan laporan dirangkum dalam satu alur.",
    modules: ["Dashboard utama", "Status pekerjaan", "Pengingat otomatis", "Laporan ringkas"],
    metrics: [{ label: "Proses aktif", value: "12" }, { label: "Perlu tindak lanjut", value: "3" }, { label: "Tepat waktu", value: "92%" }],
    flow: ["Permintaan", "Diproses", "Review", "Selesai"],
    entities: ["Pelanggan", "Permintaan", "Pekerjaan", "Dokumen", "Pembayaran"],
    roles: ["Owner", "Admin", "Operator"],
    rules: ["Setiap pekerjaan memiliki pemilik dan status", "Perubahan penting tercatat", "Penyelesaian membutuhkan validasi"],
    outputs: ["Ringkasan pekerjaan", "Dokumen transaksi", "Laporan periodik"],
    integrations: ["WhatsApp", "Email", "Spreadsheet export"],
  };
}

export function ProposalPreview() {
  const [draft, setDraft] = useState<DiscoveryPreviewDraft>();
  const [reference, setReference] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [prototypeView, setPrototypeView] = useState<PrototypeView>("dashboard");
  const [decision, setDecision] = useState<"approved"|"revision_requested">("approved");
  const [signer, setSigner] = useState({name:"",email:"",whatsapp:"",consented:false});
  const [decisionResult, setDecisionResult] = useState<DecisionResult>();
  const [isDeciding, startDecision] = useTransition();

  useEffect(() => {
    setDraft(readDiscoveryDraft());
    setReference(sessionStorage.getItem("qira.discovery.reference") ?? "QIRA-DISC-PREVIEW");
    setLoaded(true);
  }, []);

  const result = useMemo(() => {
    if (!draft) return undefined;
    const packageId = recommendPackage(draft);
    const selectedPackage = PROPOSAL_PACKAGES.find((item) => item.id === packageId);
    if (!selectedPackage) return undefined;
    const proposal = createProposalPreview({ serviceId: draft.serviceId, packageId, objective: String(draft.answers.business_goal ?? "Merapikan proses bisnis melalui solusi digital yang terukur.") });
    const commercial = calculateCommercialTerms({ basePriceIdr: selectedPackage.introductoryPriceIdr, discountPercent: 0, taxPercent: 0, downPaymentPercent: 50 });
    const triage = classifyDiscoveryTriage({ serviceId: draft.serviceId, answers: draft.answers, assessment: draft.assessment });
    return { proposal, commercial, service: findService(draft.serviceId), demo: createBusinessDemo(draft), triage };
  }, [draft]);

  if (!loaded) return <main className={styles.empty}>Menyiapkan proposal awal Anda…</main>;
  if (!draft || !result) return <main className={styles.empty}><h1>Discovery belum tersedia.</h1><p>Isi dan kirim Discovery agar QIRA dapat membuat proposal awal yang relevan.</p><Link href="/discovery">Mulai Discovery</Link></main>;

  const { proposal, commercial, service, demo, triage } = result;
  const issuedOn = new Date();
  const validUntil = new Date(issuedOn);
  validUntil.setDate(validUntil.getDate() + 14);
  function submitDecision(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const businessTypeId=draft?.businessTypeId;
    startDecision(async()=>{
      const response=await submitProposalDecision({reference,businessTypeId,decision,signerName:signer.name,signerEmail:signer.email,signerWhatsapp:signer.whatsapp,consented:signer.consented});
      setDecisionResult(response);
      if(response.status==="success"&&response.implementationUrl) window.location.href=response.implementationUrl;
    });
  }

  return <main className={styles.page}>
    <header className={styles.customerToolbar}><Link href="/">QIRA.</Link><span>Proposal awal · {reference}</span><button type="button" onClick={() => window.print()}>Simpan / cetak</button></header>
    <section className={styles.indicativeNotice}><strong>Level {triage.level} · {triage.label}</strong><span>{triage.level === 1 ? "Konsep dibuat langsung dari Discovery Anda." : triage.level === 2 ? "Draft konsep tetap tersedia, dan tim QIRA akan mereview detailnya." : "Blueprint awal tetap tersedia, lalu tim QIRA akan menjadwalkan Discovery manual."} Scope, demo, dan harga final selalu divalidasi sebelum pembayaran.</span></section>
    <article className={styles.document}>
      <section className={styles.cover}>
        <div className={styles.logo}>QIRA<span>.</span></div><p>{reference} · {issuedOn.toLocaleDateString("id-ID")}</p><h1>{proposal.package.name}</h1><h2>{service?.name}</h2>
        <div className={styles.clientMeta}><span>Tujuan utama</span><strong>{proposal.objective}</strong><small>Disusun otomatis berdasarkan jawaban Discovery</small></div>
        <div className={styles.coverMeta}><span>Estimasi investasi awal</span><strong>{rupiah.format(commercial.totalIdr)}</strong><small>Berlaku 14 hari · sampai {validUntil.toLocaleDateString("id-ID")}</small></div>
      </section>
      <section className={styles.section}><p className={styles.kicker}>01 · Rekomendasi</p><h2>Solusi awal untuk kebutuhan Anda</h2><p className={styles.lead}>{service?.outcome}</p><ul className={styles.cards}>{proposal.scope.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section className={styles.section}><p className={styles.kicker}>02 · {triage.level === 3 ? "Blueprint awal" : "Prototype konsep"} berdasarkan usaha</p><h2>{demo.name}</h2><p className={styles.lead}>{demo.headline}</p><div className={styles.prototypeTabs} role="tablist" aria-label="Bagian prototype">{([['dashboard','Halaman & dashboard'],['data','Data & output'],['workflow','Workflow & rules'],['governance','Role & integrasi']] as const).map(([id,label]) => <button type="button" role="tab" aria-selected={prototypeView === id} key={id} onClick={() => setPrototypeView(id)}>{label}</button>)}</div><div className={styles.demoDashboard}>{prototypeView === "dashboard" ? <><div className={styles.demoMetrics}>{demo.metrics.map((item) => <article key={item.label}><span>{item.label}</span><strong>{item.value}</strong></article>)}</div><div className={styles.demoModules}>{demo.modules.map((item, index) => <span key={item}><b>{index + 1}</b>{item}</span>)}</div></> : null}{prototypeView === "data" ? <div className={styles.blueprintColumns}><div><h3>Model data</h3>{demo.entities.map((item) => <span key={item}>{item}</span>)}</div><div><h3>Output</h3>{demo.outputs.map((item) => <span key={item}>{item}</span>)}</div></div> : null}{prototypeView === "workflow" ? <><div className={styles.demoFlow}>{demo.flow.map((item, index) => <div key={item}><b>{index + 1}</b><span>{item}</span></div>)}</div><div className={styles.ruleList}>{demo.rules.map((item) => <span key={item}>✓ {item}</span>)}</div></> : null}{prototypeView === "governance" ? <div className={styles.blueprintColumns}><div><h3>Role pengguna</h3>{demo.roles.map((item) => <span key={item}>{item}</span>)}</div><div><h3>Integrasi</h3>{demo.integrations.map((item) => <span key={item}>{item}</span>)}</div></div> : null}</div><p className={styles.disclaimer}>Ini bukan representasi akurat project final, melainkan konsep untuk menjawab konteks bisnis dan memulai pembahasan. {triage.reasons.join("; ")}. Setelah review QIRA dan persetujuan customer, halaman, data, workflow, role, rules, output, serta integrasi dikunci sebagai baseline scope dan UAT.</p></section>
      <section className={styles.section}><p className={styles.kicker}>03 · Implementasi</p><h2>{proposal.package.durationWeeks[0]}–{proposal.package.durationWeeks[1]} minggu</h2><div className={styles.timeline}><div><strong>1</strong><span>Konfirmasi scope dan DP 50%</span></div><div><strong>2</strong><span>Development, demo, dan UAT</span></div><div><strong>3</strong><span>Pelunasan, Go Live, onboarding</span></div></div></section>
      <section className={styles.section}><p className={styles.kicker}>04 · Harga awal</p><h2>{rupiah.format(commercial.totalIdr)}</h2><div className={styles.payments}><div><span>DP · 50% setelah scope final</span><strong>{rupiah.format(commercial.downPaymentAmountIdr)}</strong></div><div><span>Pelunasan · setelah UAT disetujui</span><strong>{rupiah.format(commercial.finalPaymentAmountIdr)}</strong></div></div><p className={styles.disclaimer}>Harga bersifat indikatif. Integrasi berbayar, domain, hosting, layanan pihak ketiga, dan permintaan di luar scope dihitung terpisah. Bug atau ketidaksesuaian terhadap scope diperbaiki dalam proses UAT.</p></section>
      <section className={styles.threeColumns}><div><h3>Termasuk</h3><ul>{proposal.scope.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3>Asumsi</h3><ul>{proposal.assumptions.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3>Belum termasuk</h3><ul>{proposal.exclusions.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
    </article>
    <section className={styles.customerDecision}><div><p className={styles.kicker}>Persetujuan digital</p><h2>Setujui arah awal atau minta penyesuaian.</h2><p>Keputusan, nama pemberi persetujuan, waktu, versi consent, dan blueprint akan dicatat. Persetujuan membuat workspace implementasi; harga serta scope final tetap divalidasi QIRA.</p></div><form className={styles.decisionForm} onSubmit={submitDecision}><div className={styles.decisionChoices}><button type="button" aria-pressed={decision==="approved"} onClick={()=>setDecision("approved")}>Setuju & mulai implementasi</button><button type="button" aria-pressed={decision==="revision_requested"} onClick={()=>setDecision("revision_requested")}>Minta revisi</button></div><label>Nama pemberi persetujuan<input required minLength={2} value={signer.name} onChange={event=>setSigner(current=>({...current,name:event.target.value}))}/></label><label>WhatsApp<input required inputMode="tel" value={signer.whatsapp} onChange={event=>setSigner(current=>({...current,whatsapp:event.target.value}))}/></label><label>Email (opsional)<input type="email" value={signer.email} onChange={event=>setSigner(current=>({...current,email:event.target.value}))}/></label><label className={styles.decisionConsent}><input type="checkbox" checked={signer.consented} onChange={event=>setSigner(current=>({...current,consented:event.target.checked}))}/><span>Saya menyatakan berwenang dan menyetujui keputusan ini dicatat secara elektronik oleh QIRA.</span></label><button className={styles.decisionSubmit} type="submit" disabled={isDeciding}>{isDeciding?"Mencatat keputusan…":decision==="approved"?"Setujui dan buat workspace":"Kirim permintaan revisi"}</button>{decisionResult?<p className={decisionResult.status==="success"?styles.decisionSuccess:styles.decisionError}>{decisionResult.message}</p>:null}</form></section>
  </main>;
}
