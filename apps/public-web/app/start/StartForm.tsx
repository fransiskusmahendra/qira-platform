"use client";

import { useActionState } from "react";
import { submitPublicLead, type LeadFormState } from "./actions";
import styles from "./start.module.css";

const initialState: LeadFormState = { status: "idle", message: "" };

interface StartFormProps {
  defaultPackage: string;
  defaultNeed?: string;
}

export function StartForm({ defaultPackage, defaultNeed = "" }: StartFormProps) {
  const [state, action, pending] = useActionState(submitPublicLead, initialState);

  if (state.status === "success") {
    return <div className={styles.success} role="status"><span>✓</span><h2>Sudah diterima.</h2><p>{state.message}</p><a href="/">Kembali ke QIRA</a></div>;
  }

  return <form action={action} className={styles.form}>
    <input type="hidden" name="packageInterest" value={defaultPackage} />
    <div className={styles.row}>
      <label>Nama<input name="fullName" required maxLength={100} autoComplete="name" /></label>
      <label>Usaha<input name="businessName" required maxLength={160} autoComplete="organization" /></label>
    </div>
    <div className={styles.row}>
      <label>WhatsApp<input name="whatsapp" required maxLength={24} inputMode="tel" autoComplete="tel" /></label>
      <label>Email <span>(opsional)</span><input name="email" type="email" maxLength={254} autoComplete="email" /></label>
    </div>
    <label>Apa yang ingin diperbaiki?<textarea name="businessNeed" required minLength={20} maxLength={2000} rows={5} defaultValue={defaultNeed} placeholder="Contoh: pencatatan dan follow-up masih manual." /></label>
    <label className={styles.consent}><input type="checkbox" name="consented" required /><span>Saya bersedia dihubungi QIRA.</span></label>
    <label className={styles.honeypot} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    {state.status === "error" ? <p className={styles.error} role="alert">{state.message}</p> : null}
    <button type="submit" disabled={pending}>{pending ? "Mengirim…" : "Kirim"}</button>
    <small>Hanya untuk menindaklanjuti kebutuhan Anda.</small>
  </form>;
}
