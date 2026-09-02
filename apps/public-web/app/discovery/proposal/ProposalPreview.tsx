"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { calculateCommercialTerms, findBusinessBlueprint, getBusinessBlueprint, PROPOSAL_PACKAGES, type ProposalPackageId } from "@qira/domain";
import { readDiscoveryDraft, readSubmittedDiscoveryPreview, type DiscoveryPreviewDraft } from "../_lib/draft";
import styles from "./StoryProposal.module.css";
import { submitProposalDecision, type DecisionResult } from "./actions";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const TOTAL_CHAPTERS = 3;

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
  const [signer, setSigner] = useState({ name: "", email: "", whatsapp: "", consented: false });
  const [decisionResult, setDecisionResult] = useState<DecisionResult>();
  const [isDeciding, startDecision] = useTransition();

  useEffect(() => {
    const preview = readSubmittedDiscoveryPreview() ?? readDiscoveryDraft();
    setDraft(preview);
    setReference(sessionStorage.getItem("qira.discovery.reference") ?? "");
    if (preview?.contact) {
      setSigner({
        name: preview.contact.fullName ?? "",
        email: preview.contact.email ?? "",
        whatsapp: preview.contact.whatsapp ?? "",
        consented: false,
      });
    }
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
      goal: String(draft.answers.business_goal ?? "Pekerjaan sehari-hari menjadi lebih mudah."),
      problem: String(draft.answers.pain_point ?? draft.answers.current_process ?? "Ada pekerjaan yang masih terasa rumit dan sulit dipantau."),
      headline: blueprint?.headline ?? "Pekerjaan penting dibuat lebih rapi, jelas, dan mudah dipantau.",
      modules: blueprint?.modules?.slice(0, 4) ?? ["Pencatatan lebih rapi", "Status mudah dilihat", "Pengingat penting", "Ringkasan pemilik"],
      flow: blueprint?.flow?.slice(0, 5) ?? ["Masuk", "Dikerjakan", "Dicek", "Selesai"],
    };
  }, [draft]);

  const decisionCompleted = decisionResult?.status === "success";

  function submitDecision(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || decisionCompleted) return;
    setDecisionResult(undefined);
    startDecision(async () => {
      const result = await submitProposalDecision({
        reference,
        businessTypeId: draft.businessTypeId,
        decision,
        signerName: signer.name,
        signerEmail: signer.email,
        signerWhatsapp: signer.whatsapp,
        consented: signer.consented,
      });
      setDecisionResult(result);
    });
  }

  if (!loaded) return <main className={styles.empty}>Menyiapkan saran…</main>;
  if (!draft || !result) return <main className={styles.empty}><h1>Belum ada cerita.</h1><Link href="/discovery">Mulai</Link></main>;

  const next = () => setChapter((value) => Math.min(TOTAL_CHAPTERS - 1, value + 1));
  const back = () => setChapter((value) => Math.max(0, value - 1));

  return <main className={styles.page}>
    <article className={styles.proposal}>
      <section className={styles.cover}>
        <div className={styles.logo}>QIRA<span>.</span></div>
        <p>{reference || "Arah awal"}</p>
        <h1>{result.businessName}</h1>
        <h2>{chapter + 1} / {TOTAL_CHAPTERS}</h2>
      </section>

      {chapter === 0 ? <section className={styles.section}>
        <p className={styles.kicker}>Yang kami pahami</p>
        <h2>{result.headline}</h2>
        <p className={styles.lead}>{result.problem}</p>
        <div className={styles.clientMeta}><span>Target</span><strong>{result.goal}</strong></div>
        <ul className={styles.cards}>{result.modules.map((item) => <li key={item}>{item}</li>)}</ul>
      </section> : null}

      {chapter === 1 ? <section className={styles.section}>
        <p className={styles.kicker}>Arah awal</p>
        <h2>{rupiah.format(result.commercial.totalIdr)}</h2>
        <p className={styles.lead}>{result.selectedPackage.name} · {result.selectedPackage.durationWeeks[0]}–{result.selectedPackage.durationWeeks[1]} minggu</p>
        <div className={styles.timeline}>{result.flow.map((item, index) => <div key={item}><strong>{index + 1}</strong><span>{item}</span></div>)}</div>
        <div className={styles.payments}>
          <div><span>DP 50%</span><strong>{rupiah.format(result.commercial.downPaymentAmountIdr)}</strong></div>
          <div><span>Sisa 50%</span><strong>{rupiah.format(result.commercial.finalPaymentAmountIdr)}</strong></div>
        </div>
        <p className={styles.disclaimer}>Perkiraan awal. Scope final dikonfirmasi sebelum mulai.</p>
      </section> : null}

      {chapter === 2 ? <section className={styles.customerDecision}>
        <div>
          <p className={styles.kicker}>Pilih arah</p>
          <h2>Sudah cocok?</h2>
        </div>
        <form className={styles.decisionForm} onSubmit={submitDecision}>
          <div className={styles.decisionChoices}>
            <button type="button" disabled={decisionCompleted} aria-pressed={decision === "approved"} onClick={() => setDecision("approved")}>Lanjut</button>
            <button type="button" disabled={decisionCompleted} aria-pressed={decision === "revision_requested"} onClick={() => setDecision("revision_requested")}>Ubah dulu</button>
          </div>
          <label>Nama<input required minLength={2} disabled={decisionCompleted} value={signer.name} onChange={(event) => setSigner((current) => ({ ...current, name: event.target.value }))} /></label>
          <label>WhatsApp<input required inputMode="tel" disabled={decisionCompleted} value={signer.whatsapp} onChange={(event) => setSigner((current) => ({ ...current, whatsapp: event.target.value }))} /></label>
          <label>Email (opsional)<input type="email" disabled={decisionCompleted} value={signer.email} onChange={(event) => setSigner((current) => ({ ...current, email: event.target.value }))} /></label>
          <label className={styles.decisionConsent}><input type="checkbox" required disabled={decisionCompleted} checked={signer.consented} onChange={(event) => setSigner((current) => ({ ...current, consented: event.target.checked }))} /><span>Saya setuju pilihan ini dicatat QIRA.</span></label>
          <button className={styles.decisionSubmit} type="submit" disabled={isDeciding || decisionCompleted || !signer.consented}>{isDeciding ? "Mengirim…" : decisionCompleted ? "Tersimpan" : decision === "approved" ? "Lanjut bersama QIRA" : "Kirim perubahan"}</button>
          {decisionResult ? <div className={decisionResult.status === "success" ? styles.decisionSuccess : styles.decisionError} aria-live="polite">
            <p>{decisionResult.message}</p>
            {decisionResult.implementationUrl ? <Link href={decisionResult.implementationUrl}>Langkah berikutnya →</Link> : null}
          </div> : null}
        </form>
      </section> : null}

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 20 }}>
        <button type="button" className={styles.decisionSubmit} onClick={back} disabled={chapter === 0}>Kembali</button>
        {chapter < TOTAL_CHAPTERS - 1 ? <button type="button" className={styles.decisionSubmit} onClick={next}>Lanjut</button> : <span />}
      </div>
    </article>
  </main>;
}
