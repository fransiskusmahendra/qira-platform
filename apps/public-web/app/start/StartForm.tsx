"use client";

import { useActionState } from "react";
import { submitPublicLead, type LeadFormState } from "./actions";
import styles from "./start.module.css";

const initialState: LeadFormState = { status: "idle", message: "" };

interface StartFormProps { defaultPackage: string }

export function StartForm({ defaultPackage }: StartFormProps) {
  const [state, action, pending] = useActionState(submitPublicLead, initialState);

  if (state.status === "success") {
    return <div className={styles.success} role="status"><span>✓</span><h2>Kebutuhan Anda sudah kami terima.</h2><p>{state.message}</p><a href="/">Kembali melihat demo</a></div>;
  }

  return (
    <form action={action} className={styles.form}>
      <div className={styles.row}>
        <label>Nama Anda *<input name="fullName" required maxLength={100} autoComplete="name" /></label>
        <label>Nama usaha *<input name="businessName" required maxLength={160} autoComplete="organization" /></label>
      </div>
      <div className={styles.row}>
        <label>Nomor WhatsApp *<input name="whatsapp" required maxLength={24} inputMode="tel" autoComplete="tel" placeholder="Contoh: 08211076517" /></label>
        <label>Email <span>(opsional)</span><input name="email" type="email" maxLength={254} autoComplete="email" /></label>
      </div>
      <label>Solusi yang diminati *
        <select name="packageInterest" defaultValue={defaultPackage}>
          <option value="digital-foundation">Digital Foundation — mulai Rp1,5 juta</option>
          <option value="growth-engine">Growth Engine — mulai Rp2,9 juta</option>
          <option value="connected-growth">Connected Growth — mulai Rp4,9 juta</option>
          <option value="custom">Custom Business Solution</option>
        </select>
      </label>
      <label>Ceritakan proses yang ingin diperbaiki *<textarea name="businessNeed" required minLength={20} maxLength={2000} rows={6} placeholder="Contoh: calon pelanggan masuk dari WhatsApp, tetapi pencatatan dan tindak lanjut masih manual..." /></label>
      <label>Anggaran awal yang dipertimbangkan *
        <select name="budgetRange" defaultValue="">
          <option value="" disabled>Pilih rentang anggaran</option>
          <option>Rp1–2 juta</option><option>Rp2–3 juta</option><option>Rp3–5 juta</option><option>Di atas Rp5 juta</option><option>Belum ditentukan</option>
        </select>
      </label>
      <label className={styles.consent}><input type="checkbox" name="consented" required /><span>Saya bersedia dihubungi QIRA melalui WhatsApp atau email untuk membahas kebutuhan ini.</span></label>
      <label className={styles.honeypot} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      {state.status === "error" ? <p className={styles.error} role="alert">{state.message}</p> : null}
      <button type="submit" disabled={pending}>{pending ? "Mengirim kebutuhan…" : "Kirim kebutuhan tanpa login"}</button>
      <small>Data tidak ditampilkan kepada publik dan hanya digunakan untuk menindaklanjuti konsultasi QIRA.</small>
    </form>
  );
}
