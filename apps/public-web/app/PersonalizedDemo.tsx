"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { findBusinessBlueprint } from "@qira/domain";
import { trackConversion } from "./_components/ConversionTracker";
import styles from "./PersonalizedDemo.module.css";

type Profile = { businessTypeId: string; name: string; title: string; problem: string };

const PROBLEM_ASSESSMENT_KEY = "qira-problem-assessment";
const PROBLEM_ASSESSMENT_ORIGIN_KEY = "qira-problem-assessment-origin";
const TOTAL_STEPS = 4;

function buildProfile(input: string): Profile {
  const blueprint = findBusinessBlueprint(input);
  if (blueprint) return { businessTypeId: blueprint.id, name: blueprint.name, title: blueprint.headline, problem: blueprint.problem };

  const operational = /stok|jadwal|karyawan|produksi|laporan|operasional|cabang|gudang|pesanan|pembayaran/.test(input.toLowerCase());
  return operational
    ? { businessTypeId: "general-operations", name: "Usaha Anda", title: "Pekerjaan lebih rapi dan mudah dipantau.", problem: "Pekerjaan masih berjalan terpisah." }
    : { businessTypeId: "general-business", name: "Usaha Anda", title: "Pelanggan lebih mudah memahami dan menghubungi usaha Anda.", problem: "Informasi usaha masih bisa dibuat lebih sederhana." };
}

export function PersonalizedDemo() {
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Merapikan pekerjaan sehari-hari");
  const [teamSize, setTeamSize] = useState("1–3 orang");
  const [profile, setProfile] = useState<Profile | null>(null);

  const canContinue = useMemo(() => step === 0 ? businessName.trim().length >= 2 : step === 1 ? description.trim().length >= 10 : true, [businessName, description, step]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!canContinue) return;
    if (step < TOTAL_STEPS - 1) { setStep((current) => current + 1); return; }

    const nextProfile = buildProfile(description.trim());
    const payload = { businessName: businessName.trim(), teamSize, priority, description: description.trim(), profile: nextProfile };
    setProfile(nextProfile);
    window.sessionStorage.setItem(PROBLEM_ASSESSMENT_KEY, JSON.stringify(payload));
    window.sessionStorage.setItem(PROBLEM_ASSESSMENT_ORIGIN_KEY, "1");
    window.localStorage.removeItem(PROBLEM_ASSESSMENT_KEY);
    void trackConversion("story_complete");
  }

  if (profile) {
    return <section className={styles.section} id="live-experience">
      <div className={styles.resultSimple} aria-live="polite">
        <p className={styles.kicker}>Arah awal</p>
        <h2>{businessName.trim()}</h2>
        <div className={styles.answerCard}><small>Fokus</small><strong>{profile.title}</strong></div>
        <Link className={styles.nextButton} href="/discovery">Lanjut <b>→</b></Link>
      </div>
    </section>;
  }

  return <section className={styles.section} id="live-experience">
    <div className={styles.intro}><p>4 pertanyaan</p><h2>Mulai.</h2></div>

    <form className={styles.form} onSubmit={submit}>
      <div className={styles.progress}><span style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} /></div>
      <small className={styles.stepLabel}>{step + 1} / {TOTAL_STEPS}</small>

      {step === 0 ? <label className={styles.question}>Nama usaha?
        <input autoFocus value={businessName} onChange={(event) => setBusinessName(event.target.value)} maxLength={120} placeholder="Contoh: Toko Sinar Jaya" />
      </label> : null}

      {step === 1 ? <label className={styles.question}>Yang paling bikin repot?
        <textarea autoFocus value={description} onChange={(event) => setDescription(event.target.value)} minLength={10} maxLength={500} rows={5} placeholder="Contoh: pesanan tercecer di WhatsApp." />
      </label> : null}

      {step === 2 ? <label className={styles.question}>Hasil yang paling penting?
        <select autoFocus value={priority} onChange={(event) => setPriority(event.target.value)}>
          <option>Merapikan pekerjaan sehari-hari</option>
          <option>Mengurangi catatan manual</option>
          <option>Melayani pelanggan lebih cepat</option>
          <option>Melihat laporan lebih mudah</option>
        </select>
      </label> : null}

      {step === 3 ? <label className={styles.question}>Berapa orang terlibat?
        <select autoFocus value={teamSize} onChange={(event) => setTeamSize(event.target.value)}>
          <option>1–3 orang</option><option>4–10 orang</option><option>11–25 orang</option><option>Lebih dari 25 orang</option>
        </select>
      </label> : null}

      <div className={styles.actions}>
        {step > 0 ? <button type="button" className={styles.backButton} onClick={() => setStep((current) => current - 1)}>Kembali</button> : <span />}
        <button type="submit" disabled={!canContinue}>{step === TOTAL_STEPS - 1 ? "Lihat arah" : "Lanjut"}</button>
      </div>
    </form>
  </section>;
}
