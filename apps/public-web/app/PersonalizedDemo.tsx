"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { findBusinessBlueprint } from "@qira/domain";
import { trackConversion } from "./_components/ConversionTracker";
import { ContextualWhatsAppCta } from "./_components/ContextualWhatsAppCta";
import styles from "./PersonalizedDemo.module.css";

type Profile = {
  businessTypeId: string;
  name: string;
  title: string;
  problem: string;
};

const PROBLEM_ASSESSMENT_KEY = "qira-problem-assessment";
const PROBLEM_ASSESSMENT_ORIGIN_KEY = "qira-problem-assessment-origin";
const TOTAL_STEPS = 4;

const INSPIRATION_CHIPS = [
  "Pesanan & chat tercecer di WhatsApp",
  "Catatan stok barang sering keliru",
  "Pencatatan keuangan masih serba manual",
  "Pelanggan sering tanya hal berulang",
  "Status pekerjaan tim sulit dipantau",
  "Pembuatan invoice & nota memakan waktu",
] as const;

const PRIORITY_OPTIONS = [
  {
    title: "Merapikan pekerjaan sehari-hari",
    desc: "Mengatur pesanan, jadwal, dan alur tim agar tidak ada yang terlewat.",
  },
  {
    title: "Mengurangi catatan manual",
    desc: "Beralih dari buku/kertas ke form dan data digital yang tersimpan rapi.",
  },
  {
    title: "Melayani pelanggan lebih cepat",
    desc: "Memberikan informasi, katalog, dan respons lebih sigap kepada calon pembeli.",
  },
  {
    title: "Melihat laporan lebih mudah",
    desc: "Memantau pemasukan, pengeluaran, dan status bisnis kapan saja.",
  },
] as const;

const TEAM_SIZE_OPTIONS = [
  {
    title: "1–3 orang",
    desc: "Usaha mandiri atau tim perintis dengan operasional langsung oleh owner.",
  },
  {
    title: "4–10 orang",
    desc: "Tim mulai berkembang dengan pembagian tugas admin, kasir, atau operasional.",
  },
  {
    title: "11–25 orang",
    desc: "Operasional menengah dengan beberapa staf dan kebutuhan koordinasi rutin.",
  },
  {
    title: "Lebih dari 25 orang",
    desc: "Banyak cabang atau departemen terpisah yang membutuhkan integrasi sistem.",
  },
] as const;

function buildProfile(input: string): Profile {
  const blueprint = findBusinessBlueprint(input);
  if (blueprint) {
    return {
      businessTypeId: blueprint.id,
      name: blueprint.name,
      title: blueprint.headline,
      problem: blueprint.problem,
    };
  }
  const operational = /stok|jadwal|karyawan|produksi|laporan|operasional|cabang|gudang|pesanan|pembayaran/.test(
    input.toLowerCase()
  );
  return operational
    ? {
        businessTypeId: "general-operations",
        name: "Operasional Terpadu",
        title: "Pekerjaan lebih rapi dan mudah dipantau bersama tim.",
        problem: "Pekerjaan operasional masih berjalan terpisah.",
      }
    : {
        businessTypeId: "general-business",
        name: "Pertumbuhan Usaha",
        title: "Pelanggan lebih mudah memahami dan menghubungi usaha Anda.",
        problem: "Informasi usaha dan alur pesanan masih bisa dibuat lebih sederhana.",
      };
}

export function PersonalizedDemo() {
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>(PRIORITY_OPTIONS[0].title);
  const [teamSize, setTeamSize] = useState<string>(TEAM_SIZE_OPTIONS[0].title);
  const [profile, setProfile] = useState<Profile | null>(null);

  const canContinue = useMemo(() => {
    if (step === 0) return businessName.trim().length >= 2;
    if (step === 1) return description.trim().length >= 10;
    return true;
  }, [businessName, description, step]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!canContinue) return;

    if (step < TOTAL_STEPS - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      if (nextStep === 1) void trackConversion("assessment_step_2");
      if (nextStep === 2) void trackConversion("assessment_step_3");
      if (nextStep === 3) void trackConversion("assessment_step_4");
      return;
    }

    const nextProfile = buildProfile(description.trim());
    const payload = {
      businessName: businessName.trim(),
      teamSize,
      priority,
      description: description.trim(),
      profile: nextProfile,
    };
    setProfile(nextProfile);
    window.sessionStorage.setItem(PROBLEM_ASSESSMENT_KEY, JSON.stringify(payload));
    window.sessionStorage.setItem(PROBLEM_ASSESSMENT_ORIGIN_KEY, "1");
    window.localStorage.removeItem(PROBLEM_ASSESSMENT_KEY);
    void trackConversion("story_complete");
    void trackConversion("assessment_complete");
  }

  const handleChipClick = (text: string) => {
    if (!description.trim()) {
      setDescription(text);
    } else if (!description.includes(text)) {
      setDescription((prev) => `${prev.trim()}, ${text.toLowerCase()}`);
    }
  };

  const suggestedPackage = useMemo(() => {
    const text = description.toLowerCase();
    const isHeavyOps =
      teamSize === "11–25 orang" ||
      teamSize === "Lebih dari 25 orang" ||
      /integrasi|multi-user|cabang|gudang|sistem besar|karyawan banyak/.test(text);

    if (isHeavyOps) {
      return {
        name: "Connected Growth",
        price: "Rp4,9 jt",
        timeline: "2–3 minggu",
        reason: "Cocok untuk alur kerja multi-tim, database operasional terpadu, dan laporan otomatis.",
      };
    }

    const isSimpleBrand =
      priority === "Mulai dikenal & dipercaya pelanggan" &&
      teamSize === "1–3 orang" &&
      !/pesanan|transaksi|dashboard|rekap|stok/.test(text);

    if (isSimpleBrand) {
      return {
        name: "Digital Foundation",
        price: "Rp1,5 jt",
        timeline: "1–2 minggu",
        reason: "Fokus pada profil usaha profesional, formulir kontak, dan tombol WhatsApp.",
      };
    }

    return {
      name: "Growth Engine",
      price: "Rp2,9 jt",
      timeline: "1–2 minggu",
      reason: "Paling populer untuk merapikan alur pemesanan, pencatatan otomatis, dan dashboard ringkas.",
    };
  }, [description, priority, teamSize]);

  if (profile) {
    return (
      <section className={styles.section} id="live-experience">
        <div className={styles.resultSimple} aria-live="polite">
          <div className={styles.resultHeader}>
            <span className={styles.badge}>Arah Solusi Awal</span>
            <span className={styles.stepLabel}>Selesai</span>
          </div>

          <h2>{businessName.trim()}</h2>

          <div className={styles.answerCard}>
            <small>Fokus yang Disarankan</small>
            <strong>{profile.title}</strong>
            <p className={styles.questionHelper} style={{ marginTop: "8px" }}>
              Berdasarkan masalah yang Anda ceritakan, langkah awal terbaik adalah menyelesaikan alur ini tanpa menambah kompleksitas sistem.
            </p>

            <div className={styles.resultSummaryGrid}>
              <div className={styles.resultSummaryItem}>
                <small>Prioritas Pilihan</small>
                <span>{priority}</span>
              </div>
              <div className={styles.resultSummaryItem}>
                <small>Skala Tim</small>
                <span>{teamSize}</span>
              </div>
            </div>

            <div className={styles.packageEstimateBox}>
              <div className={styles.packageEstimateHeader}>
                <span className={styles.packageBadge}>Paket & Waktu yang Disarankan</span>
                <span className={styles.packageTimeline}>⏱️ Estimasi: {suggestedPackage.timeline}</span>
              </div>
              <div className={styles.packageEstimateMain}>
                <div>
                  <h4 className={styles.packageName}>{suggestedPackage.name}</h4>
                  <p className={styles.packageReason}>{suggestedPackage.reason}</p>
                </div>
                <div className={styles.packagePrice}>
                  <small>Mulai dari</small>
                  <strong>{suggestedPackage.price}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.resultActions}>
            <Link className={styles.nextButton} href="/discovery">
              Lanjut ke Pemetaan Kebutuhan (±2 Menit) <b aria-hidden="true">→</b>
            </Link>
            <ContextualWhatsAppCta
              context={`rekomendasi paket ${suggestedPackage.name} untuk usaha ${businessName.trim()}`}
              className={styles.secondaryWaButton}
            >
              Diskusikan langsung via WhatsApp →
            </ContextualWhatsAppCta>
          </div>

          <p className={styles.reassurance}>
            ✓ Gratis · Tanpa komitmen beli · Data Anda dijaga kerahasiaannya sesuai kebijakan privasi.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} id="live-experience">
      <div className={styles.intro}>
        <p className={styles.kicker}>Pemetaan Awal</p>
        <h2>Ceritakan masalah usaha Anda.</h2>
        <span className={styles.questionHelper}>
          Jawab 4 pertanyaan ringkas agar kami bisa memberi gambaran solusi yang paling cocok.
        </span>
      </div>

      <form className={styles.form} onSubmit={submit} aria-label="Pemetaan awal kebutuhan usaha">
        {/* Progress bar */}
        <div className={styles.progressContainer}>
          <div
            className={styles.progress}
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={TOTAL_STEPS}
            aria-valuenow={step + 1}
            aria-label={`Pertanyaan ${step + 1} dari ${TOTAL_STEPS}`}
          >
            <span style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} />
          </div>
          <div className={styles.progressMeta}>
            <span>Pertanyaan {step + 1} dari {TOTAL_STEPS}</span>
            <span className={styles.stepLabel}>{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
          </div>
        </div>

        {/* Step 0: Nama Usaha */}
        {step === 0 && (
          <div className={styles.questionWrapper}>
            <h3 className={styles.questionTitle}>Apa nama usaha atau toko Anda?</h3>
            <p className={styles.questionHelper}>
              Kami gunakan nama ini untuk mempersonalisasi rekomendasi solusi digital Anda.
            </p>
            <input
              autoFocus
              className={styles.textInput}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              maxLength={120}
              autoComplete="organization"
              placeholder="Contoh: Toko Berkah Mandiri, Klinik Sehat Sentosa, dsb."
              aria-required="true"
            />
          </div>
        )}

        {/* Step 1: Deskripsi Masalah */}
        {step === 1 && (
          <div className={styles.questionWrapper}>
            <h3 className={styles.questionTitle}>Pekerjaan apa yang saat ini paling merepotkan?</h3>
            <p className={styles.questionHelper}>
              Ceritakan singkat dengan bahasa sehari-hari. Tidak perlu memakai istilah teknis.
            </p>
            <textarea
              autoFocus
              className={styles.textAreaInput}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minLength={10}
              maxLength={500}
              rows={4}
              placeholder="Contoh: Pesanan pelanggan sering tercecer di chat WhatsApp dan pencatatan stok di gudang sering tidak sesuai..."
              aria-required="true"
            />

            <div className={styles.charCountWrapper}>
              <span className={description.trim().length >= 10 ? styles.charCountValid : styles.charCount}>
                {description.trim().length >= 10
                  ? "✓ Memenuhi syarat minimal"
                  : `Minimal 10 karakter (saat ini: ${description.trim().length})`}
              </span>
              <span className={styles.charCount}>{description.length} / 500</span>
            </div>

            {/* Inspiration chips */}
            <div>
              <p className={styles.chipsLabel}>Atau klik contoh masalah yang sering dialami:</p>
              <div className={styles.chipGroup}>
                {INSPIRATION_CHIPS.map((chip) => (
                  <button
                    type="button"
                    key={chip}
                    className={styles.chipButton}
                    onClick={() => handleChipClick(chip)}
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Hasil yang paling penting */}
        {step === 2 && (
          <div className={styles.questionWrapper}>
            <h3 className={styles.questionTitle}>Hasil apa yang paling ingin Anda capai lebih dulu?</h3>
            <p className={styles.questionHelper}>
              Pilih satu fokus utama yang dampaknya paling terasa untuk operasional usaha Anda saat ini.
            </p>
            <div className={styles.optionsGrid} role="radiogroup" aria-label="Prioritas hasil">
              {PRIORITY_OPTIONS.map((opt) => {
                const isSelected = priority === opt.title;
                return (
                  <button
                    type="button"
                    key={opt.title}
                    role="radio"
                    aria-checked={isSelected}
                    className={`${styles.optionCard} ${isSelected ? styles.optionCardSelected : ""}`}
                    onClick={() => setPriority(opt.title)}
                  >
                    <div className={styles.optionHeader}>
                      <span className={styles.optionTitle}>{opt.title}</span>
                      <span className={styles.checkIndicator} aria-hidden="true">✓</span>
                    </div>
                    <span className={styles.optionDesc}>{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Berapa orang terlibat */}
        {step === 3 && (
          <div className={styles.questionWrapper}>
            <h3 className={styles.questionTitle}>Berapa orang yang terlibat dalam aktivitas usaha?</h3>
            <p className={styles.questionHelper}>
              Ini membantu kami mengukur tingkat kesederhanaan sistem yang akan dibangun.
            </p>
            <div className={styles.optionsGrid} role="radiogroup" aria-label="Jumlah tim yang terlibat">
              {TEAM_SIZE_OPTIONS.map((opt) => {
                const isSelected = teamSize === opt.title;
                return (
                  <button
                    type="button"
                    key={opt.title}
                    role="radio"
                    aria-checked={isSelected}
                    className={`${styles.optionCard} ${isSelected ? styles.optionCardSelected : ""}`}
                    onClick={() => setTeamSize(opt.title)}
                  >
                    <div className={styles.optionHeader}>
                      <span className={styles.optionTitle}>{opt.title}</span>
                      <span className={styles.checkIndicator} aria-hidden="true">✓</span>
                    </div>
                    <span className={styles.optionDesc}>{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className={styles.actions}>
          {step > 0 ? (
            <button
              type="button"
              className={styles.backButton}
              onClick={() => setStep((curr) => curr - 1)}
            >
              ← Kembali
            </button>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={!canContinue}
          >
            {step === TOTAL_STEPS - 1 ? "Lihat Arah Solusi →" : "Lanjut →"}
          </button>
        </div>
      </form>
    </section>
  );
}
