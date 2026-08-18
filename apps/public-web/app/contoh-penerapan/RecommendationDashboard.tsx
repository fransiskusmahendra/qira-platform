"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./case-studies.module.css";

type Assessment = {
  businessName: string; teamSize: string; priority: string; description: string;
  profile: { name: string; packageId: string; packageName: string; title: string; problem: string; modules: string[]; metrics: { label: string; value: string }[]; flow: string[] };
};
type Detail = { users:string[]; pages:{name:string;description:string}[]; automations:string[]; day:{time:string;activity:string;result:string}[]; records:string[] };

const common: Detail = {
  users:["Pemilik usaha","Admin atau staf operasional"],
  pages:[
    {name:"Ringkasan usaha",description:"Melihat pekerjaan aktif, hal yang terlambat, dan angka penting tanpa membuka banyak catatan."},
    {name:"Data pelanggan",description:"Nama, kontak, riwayat transaksi, serta catatan tindak lanjut tersimpan rapi."},
    {name:"Pekerjaan & status",description:"Setiap permintaan memiliki penanggung jawab, tahapan, dan status yang mudah dipahami."},
    {name:"Laporan ringkas",description:"Pemilik dapat melihat aktivitas dan hasil usaha dari data yang sudah masuk."}
  ],
  automations:["Mengingatkan pekerjaan yang mendekati jatuh tempo","Membuat ringkasan aktivitas tanpa rekap ulang","Menandai data yang belum lengkap"],
  day:[
    {time:"Pagi",activity:"Pemilik membuka dashboard",result:"Langsung melihat prioritas hari ini."},
    {time:"Siang",activity:"Staf memperbarui pekerjaan",result:"Status berubah dan dapat dilihat semua pihak terkait."},
    {time:"Sore",activity:"QIRA merangkum aktivitas",result:"Pemilik tidak perlu mengumpulkan laporan manual."}
  ],
  records:["Pelanggan","Pekerjaan","Status","Catatan","Laporan"]
};

const details: Record<string, Detail> = {
  "Rental Kendaraan":{
    users:["Pemilik rental","Admin booking","Petugas serah-terima"],
    pages:[
      {name:"Kalender booking",description:"Menunjukkan kendaraan yang tersedia, dipesan, sedang disewa, atau akan kembali."},
      {name:"Daftar armada",description:"Status kendaraan, jadwal servis, dokumen, dan kondisi terakhir terlihat per unit."},
      {name:"Data penyewa",description:"Identitas, kontak, riwayat sewa, pembayaran, dan catatan tersimpan bersama."},
      {name:"Serah-terima",description:"Checklist kondisi, waktu keluar-kembali, foto, serta konfirmasi petugas tercatat."}
    ],
    automations:["Mencegah dua booking memakai kendaraan yang sama","Mengingatkan waktu pengembalian dan keterlambatan","Memberi tanda kendaraan yang mendekati jadwal servis"],
    day:[
      {time:"08.00",activity:"Admin menerima permintaan sewa",result:"Sistem menampilkan armada yang benar-benar tersedia."},
      {time:"10.00",activity:"Penyewa mengambil kendaraan",result:"Checklist dan pembayaran tercatat dalam satu transaksi."},
      {time:"17.00",activity:"Pemilik mengecek dashboard",result:"Terlihat kendaraan disewa, kembali, dan perlu servis."}
    ],
    records:["Armada","Booking","Penyewa","Pembayaran","Servis","Serah-terima"]
  },
  "Laundry":{
    users:["Pemilik laundry","Petugas penerimaan","Tim cuci/setrika"],
    pages:[
      {name:"Penerimaan order",description:"Berat, layanan, harga, nama pelanggan, dan estimasi selesai dicatat sekali."},
      {name:"Status cucian",description:"Order terlihat pada tahap diterima, dicuci, disetrika, atau siap diambil."},
      {name:"Nota & pembayaran",description:"Nota tersusun otomatis dan status lunas atau belum lunas mudah diperiksa."},
      {name:"Pelanggan",description:"Riwayat order dan kontak membantu pelayanan pelanggan berikutnya."}
    ],
    automations:["Menghitung estimasi harga dari berat dan layanan","Mengingatkan staf ketika target selesai mendekat","Menyiapkan pesan bahwa cucian siap diambil"],
    day:[
      {time:"09.00",activity:"Petugas menerima cucian",result:"Order dan nota langsung tercatat."},
      {time:"13.00",activity:"Tim memindahkan status ke disetrika",result:"Pemilik mengetahui posisi setiap order."},
      {time:"16.00",activity:"Order ditandai selesai",result:"Pesan siap diambil dapat dikirim ke pelanggan."}
    ],
    records:["Order","Berat","Layanan","Status proses","Pembayaran","Pelanggan"]
  },
  "Kuliner & Katering":{
    users:["Pemilik usaha","Admin pesanan","Tim produksi","Petugas pengiriman"],
    pages:[
      {name:"Daftar pesanan",description:"Tanggal acara, menu, jumlah, alamat, catatan, DP, dan status pesanan tersimpan bersama."},
      {name:"Jadwal produksi",description:"Pesanan dikelompokkan berdasarkan hari agar kebutuhan produksi terlihat lebih awal."},
      {name:"Kebutuhan bahan",description:"Ringkasan menu dan jumlah membantu tim memperkirakan bahan yang perlu disiapkan."},
      {name:"Pengiriman",description:"Jam kirim, alamat, petugas, dan status diterima dapat dipantau."}
    ],
    automations:["Mengelompokkan pesanan berdasarkan tanggal produksi","Mengingatkan kekurangan DP atau pelunasan","Membuat ringkasan jumlah menu yang harus diproduksi"],
    day:[
      {time:"Pagi",activity:"Admin membuka jadwal produksi",result:"Jumlah pesanan dan menu hari itu langsung terlihat."},
      {time:"Siang",activity:"Tim menandai pesanan siap kirim",result:"Admin mengetahui order mana yang belum selesai."},
      {time:"Sore",activity:"Pengiriman dikonfirmasi",result:"Pemilik melihat pesanan selesai dan pembayaran masuk."}
    ],
    records:["Pesanan","Menu","Jadwal","Pelanggan","Pembayaran","Pengiriman"]
  },
  "Salon & Kecantikan":{
    users:["Pemilik salon","Resepsionis","Terapis atau stylist"],
    pages:[
      {name:"Kalender reservasi",description:"Jadwal pelanggan, layanan, durasi, dan staf yang menangani terlihat dalam satu kalender."},
      {name:"Daftar layanan",description:"Harga, durasi, dan staf yang tersedia tersusun jelas."},
      {name:"Profil pelanggan",description:"Riwayat kunjungan, preferensi, dan catatan layanan membantu pelayanan berikutnya."},
      {name:"Kinerja jadwal",description:"Jam sibuk, slot kosong, dan pelanggan kembali dapat dipantau."}
    ],
    automations:["Mencegah jadwal staf bertabrakan","Mengingatkan pelanggan sebelum jadwal layanan","Menandai pelanggan yang sudah waktunya ditindaklanjuti"],
    day:[
      {time:"09.00",activity:"Resepsionis melihat kalender",result:"Staf dan slot yang tersedia langsung diketahui."},
      {time:"13.00",activity:"Pelanggan menyelesaikan layanan",result:"Riwayat kunjungan diperbarui."},
      {time:"18.00",activity:"Pemilik melihat ringkasan",result:"Terlihat layanan terlaris dan slot yang masih kosong."}
    ],
    records:["Reservasi","Layanan","Staf","Pelanggan","Pembayaran","Riwayat"]
  },
  "Kontrakan & Kosan":{
    users:["Pemilik properti","Admin pengelola","Petugas lapangan"],
    pages:[
      {name:"Status unit",description:"Unit kosong, dipesan, terisi, atau perlu perbaikan terlihat dalam satu denah daftar."},
      {name:"Data penyewa",description:"Kontak, periode sewa, dokumen, deposit, dan catatan tersimpan per penyewa."},
      {name:"Tagihan bulanan",description:"Jatuh tempo, nominal, bukti bayar, dan tunggakan dapat diperiksa dengan cepat."},
      {name:"Keluhan & perbaikan",description:"Keluhan memiliki status, petugas, biaya, dan catatan penyelesaian."}
    ],
    automations:["Membuat daftar tagihan yang akan jatuh tempo","Menyiapkan pengingat pembayaran untuk penyewa","Menandai unit kosong dan keluhan yang belum selesai"],
    day:[
      {time:"Awal bulan",activity:"Tagihan penyewa disiapkan",result:"Pemilik melihat siapa yang sudah dan belum membayar."},
      {time:"Siang",activity:"Penyewa mengirim keluhan",result:"Keluhan tercatat dan diberikan kepada petugas."},
      {time:"Sore",activity:"Pemilik mengecek okupansi",result:"Unit kosong dan calon penyewa terlihat jelas."}
    ],
    records:["Unit","Penyewa","Kontrak","Tagihan","Pembayaran","Keluhan"]
  },
  "Peternakan":{
    users:["Pemilik peternakan","Kepala kandang","Petugas lapangan"],
    pages:[
      {name:"Monitoring batch",description:"Populasi awal, umur, bobot, mortalitas, dan target panen dibandingkan per batch."},
      {name:"Pakan & stok",description:"Pakan masuk, pemakaian harian, sisa stok, dan perkiraan kebutuhan tercatat."},
      {name:"Kesehatan ternak",description:"Gejala, tindakan, obat, petugas, dan hasil pemantauan tersimpan."},
      {name:"Biaya & proyeksi",description:"Biaya berjalan dan perkiraan hasil membantu pemilik menilai kondisi batch."}
    ],
    automations:["Memberi tanda ketika mortalitas melewati batas","Mengingatkan stok pakan yang menipis","Membuat perbandingan performa antar-batch"],
    day:[
      {time:"Pagi",activity:"Petugas mengisi populasi dan pakan",result:"Kondisi kandang langsung masuk ke dashboard."},
      {time:"Siang",activity:"Ada perubahan kesehatan",result:"Pemilik menerima tanda untuk tindak lanjut."},
      {time:"Mingguan",activity:"Bobot sampling dimasukkan",result:"Proyeksi panen diperbarui."}
    ],
    records:["Batch","Populasi","Pakan","Kesehatan","Bobot","Biaya"]
  },
  "Perkebunan":{
    users:["Pemilik kebun","Koordinator lapangan","Pekerja atau mandor"],
    pages:[
      {name:"Dashboard blok",description:"Luas, komoditas, umur tanaman, kondisi, dan pekerjaan berikutnya terlihat per blok."},
      {name:"Kalender kegiatan",description:"Pemupukan, penyemprotan, perawatan, dan panen dijadwalkan dengan penanggung jawab."},
      {name:"Pemakaian bahan",description:"Jenis, jumlah, lokasi pemakaian, dan sisa bahan tercatat."},
      {name:"Biaya & panen",description:"Biaya tenaga kerja dan bahan dibandingkan dengan estimasi atau hasil panen."}
    ],
    automations:["Mengingatkan kegiatan lapangan yang jatuh tempo","Menandai tugas yang belum selesai","Menyusun ringkasan biaya dan aktivitas per blok"],
    day:[
      {time:"Pagi",activity:"Mandor melihat tugas blok",result:"Tim mengetahui lokasi dan pekerjaan hari itu."},
      {time:"Siang",activity:"Pekerjaan ditandai selesai",result:"Pemilik dapat memantau progres dari jauh."},
      {time:"Akhir pekan",activity:"Dashboard merangkum aktivitas",result:"Biaya dan kesiapan panen terlihat per blok."}
    ],
    records:["Blok","Tanaman","Aktivitas","Tenaga kerja","Bahan","Panen"]
  },
  "Tambak & Budidaya Ikan":{
    users:["Pemilik tambak","Koordinator kolam","Petugas lapangan"],
    pages:[
      {name:"Monitoring kolam",description:"Umur tebar, populasi, kualitas air, pakan, dan kondisi terakhir terlihat per kolam."},
      {name:"Kualitas air",description:"pH, suhu, DO, dan catatan tindakan dapat dibandingkan dari waktu ke waktu."},
      {name:"Pakan & sampling",description:"Pemakaian pakan, bobot sampling, dan pertumbuhan tercatat teratur."},
      {name:"Proyeksi panen",description:"Estimasi waktu, ukuran, hasil, dan biaya membantu persiapan panen."}
    ],
    automations:["Memberi tanda jika parameter air di luar batas","Mengingatkan jadwal sampling dan pencatatan","Memperbarui estimasi panen dari data pertumbuhan"],
    day:[
      {time:"Pagi",activity:"Petugas memasukkan kualitas air",result:"Kolam yang perlu perhatian langsung terlihat."},
      {time:"Siang",activity:"Pakan harian dicatat",result:"Pemakaian dan sisa stok terpantau."},
      {time:"Mingguan",activity:"Hasil sampling dimasukkan",result:"Pertumbuhan dan proyeksi panen diperbarui."}
    ],
    records:["Kolam","Kualitas air","Pakan","Sampling","Kesehatan","Panen"]
  },

  "Bengkel Kendaraan":{users:["Pemilik bengkel","Admin","Mekanik"],pages:[{name:"Antrean servis",description:"Kendaraan, keluhan, mekanik, estimasi, dan posisi pengerjaan terlihat berurutan."},{name:"Work order",description:"Pemeriksaan, pekerjaan, jasa, sparepart, dan persetujuan pelanggan tersimpan per kendaraan."},{name:"Stok sparepart",description:"Barang terpakai otomatis dikaitkan dengan servis dan stok penting mudah dipantau."},{name:"Riwayat kendaraan",description:"Servis sebelumnya membantu mekanik memberi rekomendasi yang lebih tepat."}],automations:["Mengingatkan kendaraan yang belum selesai","Menandai sparepart yang perlu dibeli","Menyiapkan riwayat servis untuk kunjungan berikutnya"],day:[{time:"Pagi",activity:"Admin menerima kendaraan",result:"Keluhan masuk antrean dan mekanik ditugaskan."},{time:"Siang",activity:"Mekanik memperbarui pekerjaan",result:"Admin mengetahui status tanpa bertanya satu per satu."},{time:"Sore",activity:"Kendaraan selesai",result:"Biaya dan riwayat servis tersimpan."}],records:["Kendaraan","Pelanggan","Work order","Sparepart","Mekanik","Pembayaran"]},
  "Warung & Toko Kelontong":{users:["Pemilik toko","Kasir","Petugas pembelian"],pages:[{name:"Penjualan",description:"Transaksi harian dicatat sederhana tanpa sistem kasir yang rumit."},{name:"Stok prioritas",description:"Barang terlaris dan stok yang menipis dipantau tanpa harus menghitung seluruh rak."},{name:"Pemasok",description:"Pembelian, harga terakhir, dan jatuh tempo pemasok tersimpan."},{name:"Utang-piutang",description:"Catatan bon pelanggan dan pembayaran tidak lagi hanya mengandalkan ingatan."}],automations:["Menandai stok barang penting yang menipis","Membuat rekap penjualan harian","Mengingatkan utang pelanggan dan tagihan pemasok"],day:[{time:"Pagi",activity:"Barang dari pemasok masuk",result:"Stok dan tagihan pembelian diperbarui."},{time:"Siang",activity:"Transaksi berlangsung",result:"Penjualan dan stok prioritas tercatat."},{time:"Malam",activity:"Pemilik melihat rekap",result:"Omzet, stok menipis, dan bon terlihat."}],records:["Produk prioritas","Penjualan","Pemasok","Pembelian","Utang","Piutang"]},
  "Penjahit & Fashion":{users:["Pemilik","Admin pesanan","Penjahit"],pages:[{name:"Pesanan",description:"Model, bahan, jumlah, ukuran, biaya, dan tenggat tersimpan per pelanggan."},{name:"Ukuran pelanggan",description:"Detail ukuran dan catatan fitting dapat digunakan kembali."},{name:"Produksi",description:"Pesanan terlihat pada tahap potong, jahit, fitting, atau selesai."},{name:"Jadwal selesai",description:"Pekerjaan mendesak dan jadwal pengambilan mudah diprioritaskan."}],automations:["Mengingatkan fitting dan tenggat selesai","Menandai pesanan yang belum lunas","Menyimpan ukuran pelanggan untuk pesanan berikutnya"],day:[{time:"Pagi",activity:"Pesanan baru dicatat",result:"Ukuran, desain, DP, dan tenggat tersimpan."},{time:"Siang",activity:"Penjahit mengubah status",result:"Pemilik melihat progres setiap pesanan."},{time:"Sore",activity:"Pesanan siap",result:"Pelanggan dapat dihubungi untuk pengambilan."}],records:["Pelanggan","Ukuran","Desain","Bahan","Produksi","Pembayaran"]},
  "Toko Online & Reseller":{users:["Pemilik toko","Admin order","Tim packing"],pages:[{name:"Pesanan",description:"Order dari chat dan kanal penjualan dirangkum dengan status yang sama."},{name:"Pembayaran",description:"Order lunas, COD, atau belum dibayar mudah dipisahkan."},{name:"Packing & resi",description:"Tim melihat barang yang perlu dikemas dan nomor kirim per order."},{name:"Stok produk",description:"Stok siap jual dan barang yang perlu dibeli kembali terlihat."}],automations:["Menandai order yang belum diproses","Membuat daftar packing harian","Mengingatkan pesanan tanpa pembayaran atau resi"],day:[{time:"Pagi",activity:"Admin mengumpulkan order",result:"Semua pesanan masuk daftar kerja."},{time:"Siang",activity:"Tim menyelesaikan packing",result:"Status dan resi diperbarui."},{time:"Sore",activity:"Pemilik memeriksa ringkasan",result:"Order tertunda dan stok menipis terlihat."}],records:["Produk","Pesanan","Pembayaran","Packing","Resi","Pelanggan"]},
  "Jasa Servis & Teknisi":{users:["Pemilik jasa","Admin","Teknisi lapangan"],pages:[{name:"Tiket servis",description:"Keluhan, alamat, perangkat, tingkat urgensi, dan status tersimpan per pelanggan."},{name:"Jadwal teknisi",description:"Kunjungan dibagi berdasarkan waktu, lokasi, dan teknisi yang tersedia."},{name:"Biaya & sparepart",description:"Estimasi, persetujuan, pemakaian barang, dan pembayaran tercatat."},{name:"Garansi pekerjaan",description:"Kunjungan ulang dapat dibedakan dari pekerjaan baru."}],automations:["Mengingatkan teknisi sebelum kunjungan","Menandai tiket tanpa tindak lanjut","Mengingatkan masa garansi pekerjaan"],day:[{time:"Pagi",activity:"Admin membagi jadwal",result:"Teknisi mengetahui pelanggan dan lokasi tujuan."},{time:"Siang",activity:"Teknisi mengisi hasil servis",result:"Biaya, foto, dan status langsung terlihat."},{time:"Sore",activity:"Admin menutup tiket",result:"Pelanggan dan garansi tercatat."}],records:["Tiket","Pelanggan","Perangkat","Teknisi","Sparepart","Garansi"]},
  "Percetakan & Fotokopi":{users:["Pemilik","Admin order","Operator produksi"],pages:[{name:"Order cetak",description:"Nama pelanggan, file, ukuran, bahan, jumlah, finishing, dan tenggat dicatat bersama."},{name:"Antrean produksi",description:"Operator melihat urutan pekerjaan dan prioritas tanpa mencari chat."},{name:"File & persetujuan",description:"Versi file serta persetujuan desain membantu mencegah salah cetak."},{name:"Pengambilan",description:"Order siap, belum lunas, atau sudah diambil mudah diperiksa."}],automations:["Mengingatkan tenggat produksi","Menandai file atau spesifikasi yang belum lengkap","Menyiapkan kabar saat pesanan siap diambil"],day:[{time:"Pagi",activity:"Admin memeriksa antrean",result:"Prioritas cetak hari itu terlihat."},{time:"Siang",activity:"Operator menyelesaikan produksi",result:"Status order berubah menjadi siap."},{time:"Sore",activity:"Pelanggan mengambil pesanan",result:"Pembayaran dan serah terima tercatat."}],records:["Order","File","Spesifikasi","Produksi","Pembayaran","Pelanggan"]},
  "Homestay & Penginapan":{users:["Pemilik","Resepsionis","Housekeeping"],pages:[{name:"Kalender kamar",description:"Kamar tersedia, dipesan, terisi, atau diblokir terlihat per tanggal."},{name:"Data tamu",description:"Kontak, periode menginap, jumlah tamu, pembayaran, dan permintaan khusus tersimpan."},{name:"Check-in/out",description:"Kedatangan dan keberangkatan hari ini mudah dipantau."},{name:"Housekeeping",description:"Kamar yang harus dibersihkan atau diperiksa langsung masuk daftar tugas."}],automations:["Mencegah reservasi kamar bertabrakan","Mengingatkan check-in dan sisa pembayaran","Membuat tugas bersih-bersih setelah check-out"],day:[{time:"Pagi",activity:"Tamu check-out",result:"Kamar otomatis masuk daftar housekeeping."},{time:"Siang",activity:"Kamar selesai dibersihkan",result:"Status berubah menjadi siap dijual."},{time:"Sore",activity:"Tamu baru check-in",result:"Data dan pembayaran tercatat."}],records:["Kamar","Reservasi","Tamu","Pembayaran","Check-in","Housekeeping"]},
  "Kursus, Pelatihan & Sertifikasi":{users:["Pemilik lembaga","Admin pelatihan","Trainer","Asesor"],pages:[{name:"Program & batch",description:"Program, kompetensi akhir, jadwal, lokasi, kapasitas, trainer, dan perusahaan pengirim terlihat per batch."},{name:"Peserta & kehadiran",description:"Identitas, perusahaan, program, kehadiran per sesi, materi, dan status pembayaran tersimpan per peserta."},{name:"Asesmen & kelulusan",description:"Pre-test, post-test, hasil asesmen, batas nilai, dan keputusan kelulusan dapat dipantau secara transparan."},{name:"Sertifikat & verifikasi",description:"Nomor sertifikat, tanggal terbit, masa berlaku, QR verifikasi, dan pengingat perpanjangan dikelola bersama."}],automations:["Mengingatkan jadwal pelatihan kepada peserta dan trainer","Menandai peserta yang belum memenuhi kehadiran atau nilai minimum","Menerbitkan sertifikat digital setelah kelulusan terverifikasi","Mengingatkan sertifikat yang mendekati masa berakhir"],day:[{time:"Pagi",activity:"Admin membuka dashboard batch",result:"Jadwal, peserta, trainer, ruang, dan kebutuhan hari itu langsung terlihat."},{time:"Setelah sesi",activity:"Trainer mengisi kehadiran dan hasil pembelajaran",result:"Status setiap peserta diperbarui tanpa rekap ulang."},{time:"Setelah asesmen",activity:"Asesor memvalidasi kelulusan",result:"Sertifikat digital bernomor unik siap diterbitkan dan diverifikasi."}],records:["Program","Batch","Peserta","Perusahaan","Trainer","Kehadiran","Asesmen","Sertifikat","Pembayaran"]},
  "Depot Air Minum":{users:["Pemilik depot","Admin pesanan","Kurir"],pages:[{name:"Pesanan galon",description:"Jumlah, jenis, alamat, pembayaran, dan catatan pelanggan masuk dalam antrean."},{name:"Rute pengantaran",description:"Pesanan dikelompokkan agar kurir tidak bolak-balik tanpa arah."},{name:"Pelanggan tetap",description:"Alamat, frekuensi pesan, dan galon pinjaman tersimpan."},{name:"Galon & pembayaran",description:"Galon keluar-kembali serta piutang pelanggan dapat dipantau."}],automations:["Mengelompokkan pengantaran berdasarkan area","Mengingatkan pesanan yang belum diantar","Menandai galon pinjaman dan pembayaran tertunda"],day:[{time:"Pagi",activity:"Pesanan masuk",result:"Admin membentuk daftar antar berdasarkan area."},{time:"Siang",activity:"Kurir mengonfirmasi pengiriman",result:"Status dan pembayaran diperbarui."},{time:"Sore",activity:"Pemilik melihat rekap",result:"Penjualan, galon, dan piutang terlihat."}],records:["Pesanan","Pelanggan","Alamat","Kurir","Galon","Pembayaran"]},
  "Kerajinan & Furnitur":{users:["Pemilik usaha","Admin proyek","Tim produksi"],pages:[{name:"Pesanan custom",description:"Ukuran, desain, bahan, revisi, harga, dan tenggat tersimpan per pesanan."},{name:"Bahan baku",description:"Kebutuhan serta pemakaian bahan dapat dikaitkan dengan pesanan."},{name:"Tahap produksi",description:"Pekerjaan terlihat dari desain, produksi, finishing, hingga pengiriman."},{name:"Biaya pesanan",description:"Bahan, tenaga, uang muka, dan pelunasan membantu menilai hasil pekerjaan."}],automations:["Mengingatkan persetujuan desain dan tenggat","Menandai kebutuhan bahan yang belum tersedia","Menyusun biaya berjalan per pesanan"],day:[{time:"Pagi",activity:"Tim melihat prioritas produksi",result:"Pesanan dan pekerjaan hari itu jelas."},{time:"Siang",activity:"Bahan dipakai dan progres diisi",result:"Biaya serta status diperbarui."},{time:"Sore",activity:"Pemilik memeriksa proyek",result:"Pesanan berisiko terlambat terlihat."}],records:["Pesanan","Desain","Bahan","Produksi","Biaya","Pengiriman"]},
  "Event & Dekorasi":{users:["Pemilik EO","Project manager","Tim dan vendor"],pages:[{name:"Proyek acara",description:"Brief, tanggal, lokasi, anggaran, klien, dan perubahan kebutuhan tersimpan bersama."},{name:"Timeline tugas",description:"Setiap pekerjaan memiliki penanggung jawab dan tenggat."},{name:"Vendor & perlengkapan",description:"Konfirmasi, biaya, pembayaran, dan kebutuhan barang dipantau."},{name:"Pembayaran klien",description:"DP, termin, tambahan pekerjaan, dan pelunasan terlihat per acara."}],automations:["Mengingatkan tugas dan persetujuan yang terlambat","Menandai vendor yang belum dikonfirmasi","Membuat checklist menjelang hari acara"],day:[{time:"Pagi",activity:"Project manager mengecek timeline",result:"Tugas mendesak dan PIC terlihat."},{time:"Siang",activity:"Vendor mengonfirmasi kebutuhan",result:"Status dan biaya diperbarui."},{time:"H-1",activity:"Checklist akhir dibuka",result:"Tim memastikan semua siap."}],records:["Klien","Acara","Tugas","Vendor","Perlengkapan","Pembayaran"]},
  "Kontraktor & Renovasi":{users:["Pemilik usaha","Site manager","Admin proyek"],pages:[{name:"Dashboard proyek",description:"Nilai, durasi, progres, penanggung jawab, dan risiko terlihat per lokasi."},{name:"Progres lapangan",description:"Laporan, foto, pekerjaan selesai, kendala, dan rencana berikutnya tersimpan."},{name:"Material & biaya",description:"Barang masuk, pemakaian, pemasok, dan biaya dibandingkan dengan rencana."},{name:"Termin pembayaran",description:"Tagihan klien dan pembayaran vendor atau pekerja dipantau."}],automations:["Mengingatkan laporan dan pekerjaan terlambat","Menandai biaya atau material yang menyimpang","Menyusun ringkasan progres untuk pemilik atau klien"],day:[{time:"Pagi",activity:"Site manager melihat rencana",result:"Tim mengetahui pekerjaan prioritas."},{time:"Sore",activity:"Progres dan foto diunggah",result:"Pemilik memantau lokasi tanpa harus hadir."},{time:"Mingguan",activity:"Biaya dan progres dirangkum",result:"Risiko keterlambatan lebih cepat terlihat."}],records:["Proyek","Pekerjaan","Material","Tenaga kerja","Biaya","Termin"]},
};

const impactByPriority: Record<string,string[]> = {
  "Mendapatkan pelanggan":["Jalur calon pelanggan menjadi lebih jelas","Pertanyaan masuk tercatat dalam satu tempat","Tindak lanjut lebih konsisten"],
  "Merapikan operasional":["Status pekerjaan mudah dipantau","Tanggung jawab tim lebih jelas","Risiko proses terlewat berkurang"],
  "Mengurangi pencatatan manual":["Input berulang dapat dipangkas","Data lebih seragam dan mudah dicari","Kesalahan salin data dapat dikurangi"],
  "Membuat laporan lebih cepat":["Ringkasan tersedia dari data operasional","Kondisi usaha lebih cepat terlihat","Keputusan tidak menunggu rekap manual"]
};

export default function RecommendationDashboard(){
  const [assessment,setAssessment]=useState<Assessment|null>(null);
  const [activePage,setActivePage]=useState(0);
  useEffect(()=>{try{const saved=window.localStorage.getItem("qira-problem-assessment");if(saved)setAssessment(JSON.parse(saved))}catch{}},[]);
  const impacts=useMemo(()=>assessment?(impactByPriority[assessment.priority]||impactByPriority["Merapikan operasional"]):[],[assessment]);
  if(!assessment)return <main className={styles.page}><nav className={styles.nav}><Link className={styles.brand} href="/">QIRA<span>.</span></Link></nav><section className={styles.empty}><span>Rekomendasi personal belum tersedia</span><h1>Ceritakan masalah usahamu terlebih dahulu.</h1><p>Dashboard ini disusun dari jawaban pada tahap Coba Masalah agar yang ditampilkan benar-benar relevan.</p><Link href="/coba-masalah">Mulai Coba Masalah <b>→</b></Link></section></main>;

  const {profile}=assessment;
  const detail=details[profile.name]||common;
  const displayName=assessment.businessName.trim()||profile.name;
  const duration=profile.packageId==="connected-growth"?"3–6 minggu":profile.packageId==="growth-engine"?"2–4 minggu":"1–2 minggu";
  return <main className={styles.page}>
    <nav className={styles.nav}><Link className={styles.brand} href="/">QIRA<span>.</span></Link><Link className={styles.editLink} href="/coba-masalah">Ubah jawaban</Link></nav>
    <header className={styles.hero}><div><p>Rekomendasi khusus untuk {profile.name}</p><h1>Beginilah QIRA membantu <em>{displayName}.</em></h1><span>Lihat dengan bahasa sederhana apa yang akan digunakan tim Anda setiap hari.</span></div><aside><small>Solusi yang disarankan</small><strong>{profile.packageName}</strong><span>Perkiraan pengerjaan {duration} · disesuaikan lagi setelah Discovery</span></aside></header>

    <section className={styles.summary}><article className={styles.problem}><small>Yang kami pahami</small><h2>{profile.problem}</h2><blockquote>“{assessment.description}”</blockquote></article><div className={styles.context}><div><small>Digunakan oleh</small><strong>{detail.users.join(", ")}</strong></div><div><small>Prioritas Anda</small><strong>{assessment.priority}</strong></div><div><small>Hasil akhirnya</small><strong>{profile.title}</strong></div></div></section>

    <section className={styles.dashboard}>
      <div className={styles.sectionHead}><div><p>Contoh tampilan utama</p><h2>Saat membuka QIRA, informasi penting langsung terlihat.</h2></div><span>Data simulasi</span></div>
      <div className={styles.metrics}>{profile.metrics.map(item=><article key={item.label}><small>{item.label}</small><strong>{item.value}</strong><i>↗</i></article>)}</div>
      <div className={styles.workspace}><article><small>Menu yang tersedia</small><div className={styles.modules}>{profile.modules.map((item,index)=><span key={item}><b>0{index+1}</b>{item}</span>)}</div></article><article><small>Proses setelah menggunakan QIRA</small><ol>{profile.flow.map((item,index)=><li key={item}><b>{index+1}</b><span>{item}</span></li>)}</ol></article></div>
    </section>

    <section className={styles.received}>
      <div className={styles.sectionHead}><div><p>Apa yang Anda dapatkan</p><h2>Bukan satu halaman saja—setiap bagian memiliki fungsi yang jelas.</h2></div></div>
      <div className={styles.productTour}>
        <div className={styles.pageTabs} role="tablist" aria-label="Bagian solusi">{detail.pages.map((item,index)=><button key={item.name} className={activePage===index?styles.activeTab:""} onClick={()=>setActivePage(index)} role="tab" aria-selected={activePage===index}><b>0{index+1}</b><span>{item.name}</span></button>)}</div>
        <article className={styles.pagePreview}><span>Halaman {activePage+1} dari {detail.pages.length}</span><h3>{detail.pages[activePage].name}</h3><p>{detail.pages[activePage].description}</p><div><small>Data yang dapat dikelola</small>{detail.records.map(item=><i key={item}>✓ {item}</i>)}</div></article>
      </div>
    </section>

    <section className={styles.automation}><div><p>Yang dibantu secara otomatis</p><h2>Tim tetap bekerja seperti biasa, tetapi pekerjaan berulang menjadi lebih ringan.</h2></div><ol>{detail.automations.map((item,index)=><li key={item}><b>0{index+1}</b><span>{item}</span></li>)}</ol></section>

    <section className={styles.daily}>
      <div className={styles.sectionHead}><div><p>Contoh penggunaan sehari-hari</p><h2>Bayangkan satu hari kerja setelah solusi digunakan.</h2></div></div>
      <div className={styles.dayGrid}>{detail.day.map((item,index)=><article key={item.time}><div><b>{index+1}</b><span>{item.time}</span></div><h3>{item.activity}</h3><p>{item.result}</p></article>)}</div>
    </section>

    <section className={styles.impact}><div><p>Dampak yang dituju</p><h2>Proses lebih jelas, bukan sekadar memindahkan catatan ke layar.</h2></div><ul>{impacts.map(item=><li key={item}><i>✓</i><span>{item}</span></li>)}</ul></section>

    <section className={styles.scope}>
      <div><p>Termasuk dalam pengerjaan</p><ul><li>Discovery dan pemetaan proses</li><li>Desain tampilan sesuai usaha</li><li>Pembuatan fitur yang disepakati</li><li>Pengujian dan perbaikan</li><li>Panduan penggunaan</li><li>Pendampingan awal</li></ul></div>
      <div><p>Ditentukan setelah Discovery</p><ul><li>Jumlah pengguna dan hak akses</li><li>Integrasi WhatsApp atau pembayaran</li><li>Migrasi data lama</li><li>Kebutuhan domain dan hosting</li><li>Laporan khusus</li><li>Biaya serta jadwal final</li></ul></div>
    </section>

    <section className={styles.roadmap}><div className={styles.sectionHead}><div><p>Rencana penerapan</p><h2>Dari masalah menuju solusi yang siap digunakan.</h2></div></div><ol><li><b>01</b><span><strong>Discovery</strong>Memastikan proses dan kebutuhan sebenarnya.</span></li><li><b>02</b><span><strong>Prototype</strong>Calon tampilan diuji sebelum dibangun penuh.</span></li><li><b>03</b><span><strong>Implementasi</strong>Fitur dibuat, diuji, dan disiapkan untuk tim.</span></li><li><b>04</b><span><strong>Pendampingan</strong>Tim dibantu sampai memahami cara penggunaannya.</span></li></ol></section>

    <section className={styles.pricing}>
      <div className={styles.pricingHead}><div><p>Harga portofolio terbatas</p><h2>Kamu sudah bisa memperkirakan budget sebelum lanjut.</h2></div><span>Discovery gratis · tidak mengikat</span></div>
      <div className={styles.pricingGrid}>
        <article className={profile.packageId==="digital-foundation"?styles.recommendedPrice:""}><small>Mulai lebih rapi</small><h3>Digital Foundation</h3><strong>Rp1,5 juta</strong><p>Untuk kebutuhan dasar dan proses sederhana yang ingin segera dibuat digital.</p>{profile.packageId==="digital-foundation"?<b>Rekomendasi untukmu</b>:null}</article>
        <article className={profile.packageId==="growth-engine"?styles.recommendedPrice:""}><small>Mulai berkembang</small><h3>Growth Engine</h3><strong>Rp2,9 juta</strong><p>Untuk mengelola pelanggan, pesanan, pekerjaan, dan laporan dengan lebih teratur.</p>{profile.packageId==="growth-engine"?<b>Rekomendasi untukmu</b>:null}</article>
        <article className={profile.packageId==="connected-growth"?styles.recommendedPrice:""}><small>Lebih terhubung</small><h3>Connected Growth</h3><strong>Rp4,9 juta</strong><p>Untuk alur operasional, dashboard, hak akses, dan otomasi yang lebih lengkap.</p>{profile.packageId==="connected-growth"?<b>Rekomendasi untukmu</b>:null}</article>
      </div>
      <p className={styles.pricingNote}>Harga ini berlaku selama QIRA membangun portofolio dan merupakan estimasi awal. Harga final mengikuti fitur, integrasi, jumlah pengguna, dan scope yang disepakati setelah Discovery.</p>
    </section>

    <section className={styles.cta}><div><small>Langkah berikutnya</small><h2>Lengkapi Discovery agar QIRA dapat menyusun tampilan, fitur, waktu, dan harga yang tepat.</h2></div><Link href="/discovery">Lanjutkan ke Discovery <b>→</b></Link></section>
    <p className={styles.disclosure}>Tampilan, angka, dan alur di atas merupakan simulasi awal untuk membantu Anda membayangkan hasilnya. Rancangan final ditentukan bersama setelah Discovery.</p>
  </main>;
}
