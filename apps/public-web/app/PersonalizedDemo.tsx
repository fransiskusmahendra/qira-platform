"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { findBusinessBlueprint } from "@qira/domain";
import { trackConversion } from "./_components/ConversionTracker";
import styles from "./PersonalizedDemo.module.css";

type Profile = {
  businessTypeId: string;
  name: string;
  title: string;
  problem: string;
};

const PROBLEM_ASSESSMENT_KEY = "qira-problem-assessment";
const PROBLEM_ASSESSMENT_ORIGIN_KEY = "qira-problem-assessment-origin";

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

  const operational = /stok|jadwal|karyawan|produksi|laporan|operasional|cabang|gudang|pesanan|pembayaran/.test(input.toLowerCase());
  return operational
    ? {
        businessTypeId: "general-operations",
        name: "Usaha Anda",
        title: "Pekerjaan penting jadi lebih rapi dan mudah dipantau.",
        problem: "Beberapa pekerjaan masih berjalan terpisah sehingga mudah terlambat, terlewat, atau sulit dicek.",
      }
    : {
        businessTypeId: "general-business",
        name: "Usaha Anda",
        title: "Pelanggan lebih mudah memahami dan menghubungi usaha Anda.",
        problem: "Informasi usaha dan jalur pelanggan masih bisa dibuat lebih sederhana dan mudah ditemukan.",
      };
}

const TOTAL_STEPS = 4;

export function PersonalizedDemo() {
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Merapikan pekerjaan sehari-hari");
  const [teamSize, setTeamSize] = useState("1–3 orang");
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
      setStep((current) => current + 1);
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

    // Keep the story only for this browser session so a shared device does not
    // accidentally carry one prospective customer's details into the next one.
    window.sessionStorage.setItem(PROBLEM_ASSESSMENT_KEY, JSON.stringify(payload));
    window.sessionStorage.setItem(PROBLEM_ASSESSMENT_ORIGIN_KEY, "1");
    window.localStorage.removeItem(PROBLEM_ASSESSMENT_KEY);
    void trackConversion("story_complete");
  }

  if (profile) {
    return <section className={styles.section} id="live-experience">
      <div className={styles.resultSimple} aria-live="polite">
        <p className={styles.kicker}>Kami sudah menangkap ceritamu</p>
        <h2>{businessName.trim()}, ini yang kami pahami.</h2>
        <p className={styles.problem}>{profile.problem}</p>
        <div className={styles.answerCard}>
          <small>Yang sebaiknya dibuat lebih mudah</small>
          <strong>{profile.title}</strong>
        </div>
        <p className={styles.reassurance}>Belum perlu memutuskan bentuk aplikasinya. Ceritakan sedikit lagi agar QIRA bisa menyiapkan arah yang lebih pas.</p>
        <Link className={styles.nextButton} href="/discovery">Lanjut ceritakan kebutuhanmu <b>→</b></Link>
      </div>
    </section>;
  }

  return <section className={styles.section} id="live-experience">
    <div className={styles.intro}>
      <p>Bagian 1 dari 2</p>
      <h2>Kita mulai dari hal yang kamu alami setiap hari.</h2>
      <span>Satu pertanyaan setiap kali. Tidak ada istilah teknis.</span>
    </div>

    <form className={styles.form} onSubmit={submit}>
      <div className={styles.progress}><span style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} /></div>
      <small className={styles.stepLabel}>{step + 1} dari {TOTAL_STEPS}</small>

      {step === 0 ? <label className={styles.question}>Apa nama usahamu?
        <input autoFocus value={businessName} onChange={(event) => setBusinessName(event.target.value)} maxLength={120} placeholder="Contoh: Toko Sinar Jaya" />
      </label> : null}

      {step === 1 ? <label className={styles.question}>Apa satu hal yang paling bikin repot sekarang?
        <textarea autoFocus value={description} onChange={(event) => setDescription(event.target.value)} minLength={10} maxLength={500} rows={5} placeholder="Ceritakan dengan bahasa sehari-hari. Contoh: pesanan sering tercecer di WhatsApp dan saya sulit tahu mana yang sudah dibayar." />
      </label> : null}

      {step === 2 ? <label className={styles.question}>Kalau masalah ini beres, apa yang paling ingin terasa?
        <select autoFocus value={priority} onChange={(event) => setPriority(event.target.value)}>
          <option>Merapikan pekerjaan sehari-hari</option>
          <option>Mengurangi catatan manual</option>
          <option>Melayani pelanggan lebih cepat</option>
          <option>Melihat laporan lebih mudah</option>
        </select>
      </label> : null}

      {step === 3 ? <label className={styles.question}>Kira-kira berapa orang yang terlibat?
        <select autoFocus value={teamSize} onChange={(event) => setTeamSize(event.target.value)}>
          <option>1–3 orang</option>
          <option>4–10 orang</option>
          <option>11–25 orang</option>
          <option>Lebih dari 25 orang</option>
        </select>
      </label> : null}

      <div className={styles.actions}>
        {step > 0 ? <button type="button" className={styles.backButton} onClick={() => setStep((current) => current - 1)}>Kembali</button> : <span />}
        <button type="submit" disabled={!canContinue}>{step === TOTAL_STEPS - 1 ? "Lihat yang kami pahami" : "Lanjut"}</button>
      </div>
    </form>
  </section>;
}
