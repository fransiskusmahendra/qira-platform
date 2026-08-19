"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { calculateCommercialTerms, findBusinessBlueprint, getBusinessBlueprint, PROPOSAL_PACKAGES, type ProposalPackageId } from "@qira/domain";
import { readDiscoveryDraft, readSubmittedDiscoveryPreview, type DiscoveryPreviewDraft } from "../_lib/draft";
import styles from "./StoryProposal.module.css";
import { submitProposalDecision, type DecisionResult } from "./actions";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const TOTAL_CHAPTERS = 5;

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
    setDraft(readSubmittedDiscoveryPreview() ?? readDiscoveryDraft());
    setReference(sessionStorage.getItem("qira.discovery.reference") ?? "");
    setLoaded(true);
  }, []);

  const result = useMemo(() => {
    if (!draft) return undefined;
    const packageId = recommendPackage(draft);
    const selectedPackage = PROPOSAL_PACKAGES.find((item) => item.id === packageId);
    if (!selectedPackage) return undefined;

    const context = [draft.answers.business_profile, draft.answers.current_process, draft.answers.pain_point].join(" ");
    const blueprint = getBusinessBlueprint(draft.businessTypeId) ?? findBusinessBlueprint(context);
    const commercial = calculateCommercialTerms({ basePriceIdr: selectedPackage.introductoryPriceIdr, discountPercent: 0, taxPercent: 0, downPaymentPercent: 50 });

    return {
      selectedPackage,
      commercial,
      businessName: draft.contact.businessName || blueprint?.name || "Usaha Anda",
      goal: String(draft.answers.business_goal ?? "Pekerjaan sehari-hari menjadi lebih mudah."),
      problem: String(draft.answers.pain_point ?? "Ada pekerjaan yang masih terasa rumit dan sulit dipantau."),
      headline: blueprint?.headline ?? "Pekerjaan penting dibuat lebih rapi, jelas, dan mudah dipantau.",
      modules: blueprint?.modules?.slice(0, 4) ?? ["Pencatatan lebih rapi", "Status pekerjaan mudah dilihat", "Pengingat hal penting", "Ringkasan untuk pemilik"],
      flow: blueprint?.flow?.slice(0, 5) ?? ["Masuk", "Dikerjakan", "Dicek", "Selesai"],
    };
  }, [draft]);

  function submitDecision(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
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

  if (!loaded) return <main className={styles.empty}>Menyiapkan ringkasan untuk Anda…</main>;
  if (!draft || !result) return <main className={styles.empty}><h1>Cerita Anda belum tersedia.</h1><p>Isi beberapa pertanyaan singkat agar QIRA bisa menyiapkan saran yang sesuai.</p><Link href="/discovery">Mulai dari sini</Link></main>;

  const next = () => setChapter((value) => Math.min(TOTAL_CHAPTERS - 1, value + 1));
  const back = () => setChapter((value) => Math.max(0, value - 1));

  return <main className={styles.page}>
    <article className={styles.proposal}>
      <section className={styles.cover}>
        <div className={styles.logo}>QIRA<span>.</span></div>
        <p>{reference || "Ringkasan QIRA"}</p>
        <h1>{result.businessName}</h1>
        <h2>Bagian {chapter + 1} dari {TOTAL_CHAPTERS}</h2>
      </section>

      {chapter === 0 ? <section className={styles.section}>
        <p className={styles.kicker}>Yang kami pahami</p>
        <h2>Masalah utamanya bukan soal teknologi.</h2>
        <p className={styles.lead}>{result.problem}</p>
        <div className={styles.clientMeta}><span>Yang ingin dicapai</span><strong>{result.goal}</strong><small>Ini dirangkum dari cerita yang baru Anda kirim.</small></div>
      </section> : null}

      {chapter === 1 ? <section className={styles.section}>
        <p className={styles.kicker}>Yang bisa dibuat lebih mudah</p>
        <h2>{result.headline}</h2>
        <p className={styles.lead}>Untuk awal, QIRA menyarankan fokus pada beberapa hal ini saja.</p>
        <ul className={styles.cards}>{result.modules.map((item) => <li key={item}>{item}</li>)}</ul>
      </section> : null}

      {chapter === 2 ? <section className={styles.section}>
        <p className={styles.kicker}>Kira-kira cara kerjanya</p>
        <h2>Dibuat mengikuti alur kerja yang sudah Anda kenal.</h2>
        <p className={styles.lead}>Tujuannya bukan membuat pekerjaan terasa baru, tetapi membuat langkah yang ada menjadi lebih jelas.</p>
        <div className={styles.timeline}>{result.flow.map((item, index) => <div key={item}><strong>{index + 1}</strong><span>{item}</span></div>)}</div>
      </section> : null}

      {chapter === 3 ? <section className={styles.section}>
        <p className={styles.kicker}>Waktu dan biaya awal</p>
        <h2>{rupiah.format(result.commercial.totalIdr)}</h2>
        <p className={styles.lead}>Perkiraan pengerjaan sekitar {result.selectedPackage.durationWeeks[0]}–{result.selectedPackage.durationWeeks[1]} minggu.</p>
        <div className={styles.payments}>
          <div><span>Pembayaran awal 50%</span><strong>{rupiah.format(result.commercial.downPaymentAmountIdr)}</strong></div>
          <div><span>Sisa setelah hasil disetujui</span><strong>{rupiah.format(result.commercial.finalPaymentAmountIdr)}</strong></div>
        </div>
        <p className={styles.disclaimer}>Ini masih perkiraan awal. Sebelum mulai, QIRA akan memastikan bersama Anda apa yang benar-benar perlu dibuat dan apa yang belum perlu.</p>
      </section> : null}

      {chapter === 4 ? <section className={styles.customerDecision}>
        <div>
          <p className={styles.kicker}>Langkah terakhir</p>
          <h2>Apakah arah ini sudah terasa masuk akal?</h2>
          <p>Anda belum perlu memahami detail teknis. Pilih lanjut jika arahnya sudah cocok, atau minta diubah jika masih ada yang belum pas.</p>
        </div>
        <form className={styles.decisionForm} onSubmit={submitDecision}>
          <div className={styles.decisionChoices}>
            <button type="button" aria-pressed={decision === "approved"} onClick={() => setDecision("approved")}>Ya, lanjutkan</button>
            <button type="button" aria-pressed={decision === "revision_requested"} onClick={() => setDecision("revision_requested")}>Ada yang ingin diubah</button>
          </div>
          <label>Nama Anda<input required minLength={2} value={signer.name} onChange={(event) => setSigner((current) => ({ ...current, name: event.target.value }))} /></label>
          <label>WhatsApp<input required inputMode="tel" value={signer.whatsapp} onChange={(event) => setSigner((current) => ({ ...current, whatsapp: event.target.value }))} /></label>
          <label>Email (opsional)<input type="email" value={signer.email} onChange={(event) => setSigner((current) => ({ ...current, email: event.target.value }))} /></label>
          <label className={styles.decisionConsent}><input type="checkbox" checked={signer.consented} onChange={(event) => setSigner((current) => ({ ...current, consented: event.target.checked }))} /><span>Saya setuju keputusan ini dicatat oleh QIRA agar bisa ditindaklanjuti.</span></label>
          <button className={styles.decisionSubmit} type="submit" disabled={isDeciding}>{isDeciding ? "Mengirim…" : decision === "approved" ? "Lanjut bersama QIRA" : "Kirim permintaan perubahan"}</button>
          {decisionResult ? <div className={decisionResult.status === "success" ? styles.decisionSuccess : styles.decisionError}>
            <p>{decisionResult.message}</p>
            {decisionResult.implementationUrl ? <Link href={decisionResult.implementationUrl}>Lihat langkah berikutnya →</Link> : null}
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
