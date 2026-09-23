"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import styles from "./sertifikasi.module.css";

type ReminderStage = "H-60" | "H-30" | "H-7" | "GRACE";

type SampleCert = {
  code: string;
  name: string;
  program: string;
  company: string;
  issueDate: string;
  expiryDate: string;
  status: "warning" | "valid" | "expired";
  statusText: string;
  assessor: string;
  log: string[];
};

const SAMPLE_CERTS: Record<string, SampleCert> = {
  "UTS-SCM-2024-089": {
    code: "UTS-SCM-2024-089",
    name: "Aditya Pratama, S.T., CSLP",
    program: "Certified Supply Chain & Logistics Professional (CSLP)",
    company: "PT Samudera Logistik Nusantara",
    issueDate: "20 Oktober 2024",
    expiryDate: "19 Oktober 2026",
    status: "warning",
    statusText: "Aktif - Perlu Perpanjangan (Sisa 28 Hari)",
    assessor: "Dr. Ir. Hoetomo Lembito, MBA, CSLP, CMILT",
    log: [
      "20 Ags 2026: Email Reminder H-60 otomatis terkirim (Status: Opened)",
      "19 Sep 2026: WhatsApp Cloud API Reminder H-30 terkirim (Status: Read)",
      "Jadwal Berikutnya: WhatsApp Alert H-7 jika berkas belum diterima",
    ],
  },
  "UTS-LOG-2023-014": {
    code: "UTS-LOG-2023-014",
    name: "Dewi Kartikasari, S.E., CSLP",
    program: "Certified Professional in Supply Chain Operations",
    company: "PT Trans Indo Kargo",
    issueDate: "15 Maret 2025",
    expiryDate: "14 Maret 2028",
    status: "valid",
    statusText: "Aktif & Terverifikasi (Masa Berlaku Aman)",
    assessor: "Dr. Ir. Hoetomo Lembito, MBA, CSLP, CMILT",
    log: [
      "Sertifikat telah diperpanjang melalui fast-track verifikasi portofolio",
      "Tidak ada reminder aktif yang dijadwalkan dalam waktu dekat",
    ],
  },
  "UTS-EXP-2022-003": {
    code: "UTS-EXP-2022-003",
    name: "Bambang Sudiro, M.M.",
    program: "Logistics Warehouse & Distribution Management",
    company: "PT Distribusi Makmur Sentosa",
    issueDate: "10 Januari 2023",
    expiryDate: "09 Januari 2025",
    status: "expired",
    statusText: "Masa Berlaku Berakhir (Perlu Uji Re-sertifikasi)",
    assessor: "Tim Asesor Sertifikasi UTS",
    log: [
      "Masa tenggang 30 hari telah terlewati pada 08 Feb 2025",
      "Tersedia opsi re-sertifikasi jalur percepatan portofolio UTS",
    ],
  },
};

export function LogisticsCertificationClient() {
  // 1. Simulator State
  const [activeStage, setActiveStage] = useState<ReminderStage>("H-30");
  const [simFeedback, setSimFeedback] = useState<string | null>(null);

  // 2. Verification State
  const [searchCode, setSearchCode] = useState<string>("UTS-SCM-2024-089");
  const [selectedCert, setSelectedCert] = useState<SampleCert>(SAMPLE_CERTS["UTS-SCM-2024-089"]);

  // 3. Calculator State
  const [alumniCount, setAlumniCount] = useState<number>(300);
  const [renewalFee, setRenewalFee] = useState<number>(2500000);
  const [conversionRate, setConversionRate] = useState<number>(35);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const calculatedRevenue = useMemo(() => {
    const renewed = Math.round(alumniCount * (conversionRate / 100));
    const total = renewed * renewalFee;
    const hoursSaved = Math.round(alumniCount * 0.7);
    return { renewed, total, hoursSaved };
  }, [alumniCount, renewalFee, conversionRate]);

  const handleSimulateSend = (channel: string) => {
    setSimFeedback(`Notifikasi ${channel} simulasi berhasil dikirimkan via API (Latency: 0.8s, Status: Delivered).`);
    setTimeout(() => {
      setSimFeedback(null);
    }, 4000);
  };

  const handleVerify = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (SAMPLE_CERTS[normalized]) {
      setSelectedCert(SAMPLE_CERTS[normalized]);
    } else {
      setSelectedCert({
        code: normalized,
        name: "Peserta Terdaftar",
        program: "Supply Chain & Logistics Program",
        company: "Lembaga Industri Mitra UTS",
        issueDate: "01 Januari 2024",
        expiryDate: "01 Januari 2026",
        status: "warning",
        statusText: "Masa Berlaku Berakhir (Perlu Pembaharuan)",
        assessor: "Dr. Ir. Hoetomo Lembito, MBA, CSLP, CMILT",
        log: ["Sertifikat terdaftar dalam indeks database verifikasi publik UTS."],
      });
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Contoh Penerapan Nyata - Solusi QIRA</span>
        <h1 className={styles.title}>
          Sistem Verifikasi & Notifikasi Otomatis Sertifikasi Logistik
        </h1>
        <p className={styles.subtitle}>
          Simulasi alur digitalisasi sertifikat profesional, auto-reminder masa kadaluarsa multi-channel (Email & WhatsApp Cloud API), serta fast-track perpanjangan untuk lembaga pelatihan & sertifikasi supply chain nasional.
        </p>
        <div className={styles.clientBadge}>
          <span>Penerapan Arsitektur: PT. Ugra Taraka Sigra (UTS) & Asosiasi SCM Nasional</span>
        </div>
      </header>

      {/* Key Metrics Grid */}
      <div className={styles.gridKeyMetrics}>
        <div className={styles.metricCard}>
          <small>Arsitektur Notifikasi</small>
          <strong>H-60, H-30, & H-7</strong>
          <span>Otomasi berjadwal via Email resmi & WhatsApp Cloud API resmi dengan badge bisnis terverifikasi.</span>
        </div>
        <div className={styles.metricCard}>
          <small>Pencegahan Sertifikat Hangus</small>
          <strong>100% Otomatis</strong>
          <span>Alumni diingatkan secara otomatis sebelum masa berlaku keahlian habis tanpa staf admin repot.</span>
        </div>
        <div className={styles.metricCard}>
          <small>Recurring Revenue Recovery</small>
          <strong>Zero Ad Spend</strong>
          <span>Menghasilkan kembali pendapatan re-sertifikasi berkala langsung dari database alumni eksisting.</span>
        </div>
      </div>

      {/* MODULE 1: Multi-Channel Reminder Simulator */}
      <section className={styles.sectionBox}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionKicker}>Modul 1: Simulator Notifikasi Multi-Kanal</div>
          <h2 className={styles.sectionTitle}>Simulasi Alur Pengingat Masa Berlaku (Email & WhatsApp)</h2>
          <p className={styles.sectionDesc}>
            Pilih fase pengingat di bawah ini untuk melihat persis bagaimana alumni menerima pemberitahuan resmi secara personal dan otomatis:
          </p>
        </div>

        {/* Tab Selector */}
        <div className={styles.tabsList}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeStage === "H-60" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveStage("H-60")}
          >
            [H-60] Email Early-Bird
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeStage === "H-30" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveStage("H-30")}
          >
            [H-30] WhatsApp Cloud API
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeStage === "H-7" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveStage("H-7")}
          >
            [H-7] WhatsApp Peringatan Terakhir
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeStage === "GRACE" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveStage("GRACE")}
          >
            [Grace Period] Masa Tenggang 30 Hari
          </button>
        </div>

        {/* Simulator Preview Display */}
        <div className={styles.simulatorDisplay}>
          {activeStage === "H-60" && (
            <div className={styles.emailContainer}>
              <div className={styles.emailHeaderMeta}>
                <div><strong>Dari:</strong> Lembaga Sertifikasi UTS &lt;sertifikasi@ugratarakasigra.com&gt;</div>
                <div><strong>Kepada:</strong> Aditya Pratama, S.T., CSLP &lt;aditya.pratama@perusahaan.co.id&gt;</div>
                <div><strong>Subjek:</strong> [Pemberitahuan Resmi UTS] Masa Berlaku Sertifikat SCM Anda Berakhir dalam 60 Hari</div>
              </div>
              <div className={styles.emailBody}>
                <div className={styles.emailBrandBar}>
                  PT. UGRA TARAKA SIGRA - PUSAT SERTIFIKASI LOGISTIK NASIONAL
                </div>
                <p>Yth. <strong>Bapak Aditya Pratama, S.T., CSLP</strong>,</p>
                <p>
                  Terima kasih atas dedikasi profesional Anda dalam memajukan standar logistik dan rantai pasok nasional. Melalui sistem verifikasi otomatis UTS, kami menginformasikan bahwa sertifikat keahlian Anda akan segera memasuki batas akhir masa berlaku:
                </p>

                <div className={styles.emailSummaryCard}>
                  <div className={styles.emailSummaryRow}>
                    <span>Nama Pemegang:</span>
                    <strong>Aditya Pratama, S.T.</strong>
                  </div>
                  <div className={styles.emailSummaryRow}>
                    <span>Gelar / Program:</span>
                    <strong>Certified Supply Chain & Logistics Professional (CSLP)</strong>
                  </div>
                  <div className={styles.emailSummaryRow}>
                    <span>Nomor Registrasi:</span>
                    <strong>UTS-SCM-2024-089</strong>
                  </div>
                  <div className={styles.emailSummaryRow}>
                    <span>Tanggal Berakhir:</span>
                    <strong>19 Oktober 2026 (Sisa 60 Hari)</strong>
                  </div>
                </div>

                <p>
                  Untuk mempertahankan keabsahan gelar profesi Anda di database industri logistik dan perusahaan mitra, silakan ajukan pembaharuan berkas portofolio proyek logistik terbaru Anda melalui portal re-sertifikasi UTS.
                </p>

                <a href="#demo" onClick={(e) => { e.preventDefault(); handleSimulateSend("Email H-60"); }} className={styles.emailCtaBtn}>
                  Ajukan Perpanjangan Sertifikat
                </a>

                <p style={{ marginTop: "20px", fontSize: "11px", color: "#64748b" }}>
                  Email ini dikirim otomatis oleh Sistem Notifikasi Sertifikasi QIRA untuk PT. Ugra Taraka Sigra.
                </p>
              </div>
            </div>
          )}

          {activeStage === "H-30" && (
            <div className={styles.waContainer}>
              <div className={styles.waHeader}>
                <div className={styles.waAvatar}>UTS</div>
                <div className={styles.waHeaderInfo}>
                  <strong>UTS SCM Certification Center</strong>
                  <span>Official Business Account (WhatsApp Cloud API)</span>
                </div>
              </div>
              <div className={styles.waBubble}>
                <p>Halo <strong>Bapak Aditya Pratama, S.T., CSLP</strong>,</p>
                <p>
                  Masa berlaku sertifikat keahlian logistik Anda:
                  <br />
                  - Program: <strong>Certified Supply Chain & Logistics Professional (CSLP)</strong>
                  <br />
                  - No. Registrasi: <strong>UTS-SCM-2024-089</strong>
                  <br />
                  - Batas Berlaku: <strong>19 Oktober 2026</strong> (Sisa 30 Hari).
                </p>
                <p>
                  Untuk memastikan nama Anda tetap aktif dalam Database Sertifikasi Logistik Nasional, Anda dapat melakukan perpanjangan instan berbasis portofolio melalui tautan resmi:
                  <br />
                  <strong>https://ugratarakasigra.com/renew/UTS-SCM-2024-089</strong>
                </p>
                <p>
                  Tim Asesor kami dipimpin oleh <strong>Dr. Ir. Hoetomo Lembito, MBA, CSLP, CMILT</strong> siap memverifikasi berkas Anda dalam 2 hari kerja.
                </p>
                <div className={styles.waTime}>10:15 WIB | Terkirim & Terbaca</div>
              </div>
              <div className={styles.waActions}>
                <button
                  type="button"
                  className={styles.waActionBtn}
                  onClick={() => handleSimulateSend("WhatsApp H-30")}
                >
                  Perpanjang Sekarang via Portal
                </button>
                <button
                  type="button"
                  className={styles.waActionBtn}
                  onClick={() => handleSimulateSend("WhatsApp Tanya Asesor")}
                >
                  Hubungi Admin Asesori UTS
                </button>
              </div>
            </div>
          )}

          {activeStage === "H-7" && (
            <div className={styles.waContainer}>
              <div className={styles.waHeader}>
                <div className={styles.waAvatar} style={{ background: "#071a33" }}>UTS</div>
                <div className={styles.waHeaderInfo}>
                  <strong>UTS SCM Certification Center</strong>
                  <span>Pemberitahuan Mendesak (H-7 Expiry)</span>
                </div>
              </div>
              <div className={styles.waBubble}>
                <p style={{ color: "#071a33", fontWeight: "700" }}>
                  PERINGATAN RESMI: MASA BERLAKU SERTIFIKAT SEGERA BERAKHIR
                </p>
                <p>Yth. <strong>Bapak Aditya Pratama, S.T.</strong>,</p>
                <p>
                  Masa berlaku sertifikat <strong>CSLP (UTS-SCM-2024-089)</strong> Anda akan berakhir dalam <strong>7 HARI LAGI</strong> (19 Oktober 2026).
                </p>
                <p>
                  Apabila melewati tanggal tersebut, status sertifikasi Anda akan non-aktif di sistem publik dan pengajuan perpanjangan memerlukan asesori ulang.
                </p>
                <p>
                  Gunakan jalur <strong>Fast-Track Renewal 24 Jam</strong> hari ini:
                  <br />
                  <strong>https://ugratarakasigra.com/urgent-renew/UTS-SCM-2024-089</strong>
                </p>
                <div className={styles.waTime}>09:00 WIB | Terkirim & Terbaca</div>
              </div>
              <div className={styles.waActions}>
                <button
                  type="button"
                  className={styles.waActionBtn}
                  style={{ borderColor: "#071a33", color: "#071a33" }}
                  onClick={() => handleSimulateSend("WhatsApp H-7 Urgent")}
                >
                  Amankan Status Sertifikat Sekarang
                </button>
              </div>
            </div>
          )}

          {activeStage === "GRACE" && (
            <div className={styles.emailContainer}>
              <div className={styles.emailHeaderMeta}>
                <div><strong>Subjek:</strong> [Status Kadaluarsa] Masa Tenggang 30 Hari Sertifikat Profesi UTS SCM</div>
                <div><strong>Kategori:</strong> Grace Period Recovery Notification</div>
              </div>
              <div className={styles.emailBody}>
                <div className={styles.emailBrandBar} style={{ borderBottomColor: "#071a33" }}>
                  STATUS SERTIFIKAT NON-AKTIF (MASA TENGGANG AKTIF)
                </div>
                <p>Yth. <strong>Bapak Aditya Pratama, S.T., CSLP</strong>,</p>
                <p>
                  Masa aktif sertifikat CSLP Anda telah berakhir pada 19 Oktober 2026. Namun lembaga memberikan <strong>Grace Period (Masa Tenggang) selama 30 Hari</strong> hingga 18 November 2026.
                </p>
                <div className={styles.emailSummaryCard}>
                  <p style={{ margin: 0, fontSize: "13px" }}>
                    Dalam masa tenggang ini, Anda <strong>tidak perlu mengulang ujian dari awal</strong>. Cukup melampirkan portofolio pengalaman kerja 1 tahun terakhir untuk validasi ulang oleh Asesor UTS.
                  </p>
                </div>
                <a href="#demo" onClick={(e) => { e.preventDefault(); handleSimulateSend("Grace Period Recovery"); }} className={styles.emailCtaBtn} style={{ background: "#071a33" }}>
                  Re-Aktivasi Portofolio Logistik
                </a>
              </div>
            </div>
          )}
        </div>

        {simFeedback && (
          <div className={styles.calloutBox} style={{ borderLeftColor: "#1769ff", background: "#f0f7ff" }}>
            <strong>Uji Coba Berhasil:</strong> {simFeedback}
          </div>
        )}
      </section>

      {/* MODULE 2: Live Public Verification Checker Mockup */}
      <section className={styles.sectionBox}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionKicker}>Modul 2: Portal Verifikasi Sertifikat Publik</div>
          <h2 className={styles.sectionTitle}>Uji Cek Keabsahan & Status Notifikasi Sertifikat</h2>
          <p className={styles.sectionDesc}>
            Fitur verifikasi publik untuk industri dan HRD dalam memvalidasi keaslian sertifikasi alumni UTS sekaligus memonitor riwayat pengingat:
          </p>
        </div>

        <div className={styles.quickSamples}>
          <span>Coba contoh nomor registrasi:</span>
          {Object.keys(SAMPLE_CERTS).map((code) => (
            <button
              key={code}
              type="button"
              className={styles.sampleTag}
              onClick={() => {
                setSearchCode(code);
                handleVerify(code);
              }}
            >
              {code}
            </button>
          ))}
        </div>

        <form
          className={styles.verifyInputRow}
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify(searchCode);
          }}
        >
          <input
            type="text"
            className={styles.verifyInput}
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Masukkan Nomor Registrasi (Contoh: UTS-SCM-2024-089)"
          />
          <button type="submit" className={styles.verifyBtn}>
            Periksa Sertifikat
          </button>
        </form>

        {selectedCert && (
          <div className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Nomor Registrasi Terverifikasi</span>
                <div style={{ fontSize: "18px", fontWeight: "800", color: "#071a33", fontFamily: "monospace" }}>{selectedCert.code}</div>
              </div>
              <div>
                {selectedCert.status === "valid" && (
                  <span className={styles.badgeStatusSuccess}>{selectedCert.statusText}</span>
                )}
                {selectedCert.status === "warning" && (
                  <span className={styles.badgeStatusWarning}>{selectedCert.statusText}</span>
                )}
                {selectedCert.status === "expired" && (
                  <span className={styles.badgeStatusDanger}>{selectedCert.statusText}</span>
                )}
              </div>
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <small>Nama Pemegang Sertifikat</small>
                <strong>{selectedCert.name}</strong>
              </div>
              <div className={styles.detailItem}>
                <small>Program Sertifikasi</small>
                <strong>{selectedCert.program}</strong>
              </div>
              <div className={styles.detailItem}>
                <small>Instansi / Perusahaan</small>
                <strong>{selectedCert.company}</strong>
              </div>
              <div className={styles.detailItem}>
                <small>Masa Berlaku Kompetensi</small>
                <strong>{selectedCert.issueDate} - {selectedCert.expiryDate}</strong>
              </div>
              <div className={styles.detailItem}>
                <small>Kepala Dewan Asesor</small>
                <strong>{selectedCert.assessor}</strong>
              </div>
              <div className={styles.detailItem}>
                <small>Otoritas Penerbit</small>
                <strong>PT. Ugra Taraka Sigra (UTS Logistics Center)</strong>
              </div>
            </div>

            <div className={styles.automationLog}>
              <div style={{ fontWeight: "700", color: "#071a33", marginBottom: "6px" }}>
                Riwayat Otomasi Notifikasi QIRA:
              </div>
              {selectedCert.log.map((entry, idx) => (
                <div key={idx}>- {entry}</div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* MODULE 3: Recertification Recurring Revenue ROI Calculator */}
      <section className={styles.sectionBox}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionKicker}>Modul 3: Kalkulator Bisnis & ROI Lembaga</div>
          <h2 className={styles.sectionTitle}>Simulasi Pemulihan Pendapatan Berulang (Recurring Revenue)</h2>
          <p className={styles.sectionDesc}>
            Hitung potensi pendapatan perpanjangan berkala yang dapat diselamatkan secara otomatis tanpa perlu menambah biaya iklan atau follow-up manual:
          </p>
        </div>

        <div className={styles.calcGrid}>
          <div>
            <div className={styles.sliderGroup}>
              <div className={styles.sliderLabel}>
                <span>Jumlah Alumni Tersertifikasi per Tahun</span>
                <span className={styles.sliderValue}>{alumniCount} Peserta</span>
              </div>
              <input
                type="range"
                className={styles.sliderInput}
                min={50}
                max={1000}
                step={25}
                value={alumniCount}
                onChange={(e) => setAlumniCount(Number(e.target.value))}
              />
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderLabel}>
                <span>Biaya Perpanjangan Portofolio / Re-sertifikasi</span>
                <span className={styles.sliderValue}>{formatRupiah(renewalFee)}</span>
              </div>
              <input
                type="range"
                className={styles.sliderInput}
                min={1000000}
                max={5000000}
                step={250000}
                value={renewalFee}
                onChange={(e) => setRenewalFee(Number(e.target.value))}
              />
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderLabel}>
                <span>Estimasi Tingkat Konversi Sukses Perpanjangan</span>
                <span className={styles.sliderValue}>{conversionRate}%</span>
              </div>
              <input
                type="range"
                className={styles.sliderInput}
                min={10}
                max={60}
                step={5}
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
              />
              <span style={{ fontSize: "11px", color: "#64748b", marginTop: "4px", display: "block" }}>
                *Industri pelatihan konvensional tanpa reminder otomatis rata-rata hanya mencapai kurang dari 10% konversi perpanjangan.
              </span>
            </div>
          </div>

          <div className={styles.calcResultsBox}>
            <h4>Hasil Estimasi Dampak Otomasi</h4>
            <div className={styles.highlightAmount}>
              {formatRupiah(calculatedRevenue.total)}
            </div>
            <p className={styles.calcResultsSub}>
              Pendapatan berulang tahunan yang terselamatkan dari <strong>{calculatedRevenue.renewed} alumni</strong> yang memperpanjang sertifikatnya tepat waktu.
            </p>

            <div className={styles.calcKeyMetrics}>
              <div className={styles.calcMetricItem}>
                <small>Waktu Admin Dihemat</small>
                <strong>~{calculatedRevenue.hoursSaved} Jam / Tahun</strong>
              </div>
              <div className={styles.calcMetricItem}>
                <small>Biaya Akuisisi Iklan</small>
                <strong>Rp 0 (Database Sendiri)</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className={styles.ctaCard}>
        <h3>Siap Mengimplementasikan Sistem Ini?</h3>
        <p>
          Arsitektur di atas siap dikustomisasi dan diintegrasikan langsung ke sistem operasional PT. Ugra Taraka Sigra maupun lembaga sertifikasi profesi lainnya. Integrasi mencakup WhatsApp Cloud API resmi, modul invoice otomatis, dan database verifikasi publik.
        </p>
        <div className={styles.ctaActions}>
          <Link
            className={styles.primaryCta}
            href={`https://wa.me/6281234567890?text=${encodeURIComponent(
              "Halo tim QIRA, saya ingin mendiskusikan implementasi sistem notifikasi sertifikasi dan integrasi WhatsApp Cloud API seperti pada simulasi sertifikasi logistik."
            )}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            Konsultasi Implementasi via WhatsApp
          </Link>
          <Link className={styles.secondaryCta} href="/contoh-penerapan">
            Lihat Contoh Penerapan Lainnya
          </Link>
        </div>
      </section>
    </div>
  );
}
