"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { calculateCommercialTerms, findBusinessBlueprint, getBusinessBlueprint, PROPOSAL_PACKAGES, type ProposalPackageId } from "@qira/domain";
import { readDiscoveryDraft, readSubmittedDiscoveryPreview, type DiscoveryPreviewDraft } from "../_lib/draft";
import styles from "./StoryProposal.module.css";
import { submitProposalDecision, type DecisionResult } from "./actions";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const TOTAL_CHAPTERS = 2;

function recommendPackage(draft: DiscoveryPreviewDraft): ProposalPackageId {
  if (draft.serviceId === "ai-employees") return "connected-growth";
  if (draft.serviceId === "automation") return draft.assessment.complexity >= 4 ? "connected-growth" : "growth-engine";
  if (draft.serviceId === "business-apps") return draft.assessment.complexity <= 2 ? "digital-foundation" : "growth-engine";
  return "digital-foundation";
}

export function ProposalPreview() {
  const [draft, setDraft] = useState<DiscoveryPreviewDraft>();
  const [reference, setReference] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [decision, setDecision] = useState<"approved" | "revision_requested">("approved");
  const [consented, setConsented] = useState(false);
  const [decisionResult, setDecisionResult] = useState<DecisionResult>();
  const [isDeciding, startDecision] = useTransition();

  useEffect(() => {
    const preview = readSubmittedDiscoveryPreview() ?? readDiscoveryDraft();
    setDraft(preview);
    setReference(sessionStorage.getItem("qira.discovery.reference") ?? "");
    setLoaded(true);
  }, []);

  const result = useMemo(() => {
    if (!draft) return undefined;
    const packageId = recommendPackage(draft);
    const selectedPackage = PROPOSAL_PACKAGES.find((item) => item.id === packageId);
    if (!selectedPackage) return undefined;

    const context = [draft.answers.business_profile, draft.answers.business_goal, draft.answers.current_process, draft.answers.pain_point].join(" ");
    const blueprint = getBusinessBlueprint(draft.businessTypeId) ?? findBusinessBlueprint(context);
    const commercial = calculateCommercialTerms({ basePriceIdr: selectedPackage.introductoryPriceIdr, discountPercent: 0, taxPercent: 0, downPaymentPercent: 50 });

    return {
      selectedPackage,
      commercial,
      businessName: draft.contact.businessName || blueprint?.name || "Usaha Anda",
      problem: String(draft.answers.pain_point ?? draft.answers.current_process ?? "Ada pekerjaan yang masih terasa rumit dan sulit dipantau."),
      headline: blueprint?.headline ?? "Pekerjaan penting dibuat lebih rapi dan mudah dipantau.",
      modules: blueprint?.modules?.slice(0, 4) ?? ["Pencatatan lebih rapi", "Status mudah dilihat", "Pengingat penting", "Ringkasan pemilik"],
      flow: blueprint?.flow?.slice(0, 4) ?? ["Masuk", "Dikerjakan", "Dicek", "Selesai"],
    };
  }, [draft]);

  const decisionCompleted = decisionResult?.status === "success";

  function submitDecision(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || decisionCompleted) return;
    setDecisionResult(undefined);
    startDecision(async () => {
      const response = await submitProposalDecision({
        reference,
        businessTypeId: draft.businessTypeId,
        decision,
        signerName: draft.contact.fullName,
        signerEmail: draft.contact.email,
        signerWhatsapp: draft.contact.whatsapp,
        consented,
      });
      setDecisionResult(response);
    });
  }

  if (!loaded) return <main className={styles.empty}>Menyiapkan saran…</main>;
  if (!draft || !result) return <main className={styles.empty}><h1>Belum ada cerita.</h1><Link href="/discovery">Mulai</Link></main>;

  return <main className={styles.page}>
    <article className={styles.proposal}>
      <section className={styles.cover}>
        <div className={styles.logo}>QIRA<span>.</span></div>
        <p>{reference || "Arah awal"}</p>
        <h1>{result.businessName}</h1>
        <h2>{chapter + 1} / {TOTAL_CHAPTERS}</h2>
      </section>

      {chapter === 0 ? <section className={styles.section}>
        <p className={styles.kicker}>Saran awal</p>
        <h2>{result.headline}</h2>
        <p className={styles.lead}>{result.problem}</p>
        <ul className={styles.cards}>{result.modules.map((item) => <li key={item}>{item}</li>)}</ul>
        <div className={styles.timeline}>{result.flow.map((item, index) => <div key={item}><strong>{index + 1}</strong><span>{item}</span></div>)}</div>
        <div className={styles.payments}>
          <div><span>Mulai dari</span><strong>{rupiah.format(result.commercial.totalIdr)}</strong></div>
          <div><span>Estimasi</span><strong>{result.selectedPackage.durationWeeks[0]}–{result.selectedPackage.durationWeeks[1]} minggu</strong></div>
        </div>
        <p className={styles.disclaimer}>{result.selectedPackage.name} · 50% awal · 50% sebelum serah terima · scope final dikonfirmasi sebelum mulai.</p>
      </section> : null}

      {chapter === 1 ? <section className={styles.customerDecision}>
        <div>
          <p className={styles.kicker}>Pilih arah</p>
          <h2>Sudah cocok?</h2>
          <p>Kontak yang sudah Anda isi akan digunakan untuk tindak lanjut.</p>
        </div>
        <form className={styles.decisionForm} onSubmit={submitDecision}>
          <div className={styles.decisionChoices}>
            <button type="button" disabled={decisionCompleted} aria-pressed={decision === "approved"} onClick={() => setDecision("approved")}>Lanjut</button>
            <button type="button" disabled={decisionCompleted} aria-pressed={decision === "revision_requested"} onClick={() => setDecision("revision_requested")}>Ubah dulu</button>
          </div>
          <label className={styles.decisionConsent}><input type="checkbox" required disabled={decisionCompleted} checked={consented} onChange={(event) => setConsented(event.target.checked)} /><span>Saya setuju pilihan ini dicatat QIRA.</span></label>
          <button className={styles.decisionSubmit} type="submit" disabled={isDeciding || decisionCompleted || !consented}>{isDeciding ? "Mengirim…" : decisionCompleted ? "Tersimpan" : decision === "approved" ? "Lanjut bersama QIRA" : "Kirim perubahan"}</button>
          {decisionResult ? <div className={decisionResult.status === "success" ? styles.decisionSuccess : styles.decisionError} aria-live="polite">
            <p>{decisionResult.message}</p>
            {decisionResult.implementationUrl ? <Link href={decisionResult.implementationUrl}>Lanjut →</Link> : null}
          </div> : null}
        </form>
      </section> : null}

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 20 }}>
        {chapter > 0 ? <button type="button" className={styles.decisionSubmit} onClick={() => setChapter(0)}>Kembali</button> : <span />}
        {chapter === 0 ? <button type="button" className={styles.decisionSubmit} onClick={() => setChapter(1)}>Pilih arah</button> : <span />}
      </div>
    </article>
  </main>;
}
