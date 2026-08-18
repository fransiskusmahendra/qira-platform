"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { calculateDiscoveryScores, findMissingRequiredAnswers, getBusinessBlueprint, getDiscoveryQuestionnaire, type DiscoveryQuestion, type ServiceId } from "@qira/domain";
import styles from "../discovery.module.css";
import { submitPublicDiscovery, type PublicDiscoverySubmissionState } from "../actions";
import { clearDiscoveryDraft, DISCOVERY_DRAFT_VERSION, readDiscoveryDraft, writeDiscoveryDraft } from "../_lib/draft";

interface ServiceOption { id: ServiceId; name: string; outcome: string }
interface DiscoveryFormProps { services: readonly ServiceOption[] }
type Answers = Record<string, string | number | undefined>;
type Contact = { fullName: string; businessName: string; whatsapp: string; email: string };
type ProblemAssessment = { businessName?: string; teamSize?: string; priority?: string; description?: string; profile?: { businessTypeId?: string; name?: string; title?: string; problem?: string } };

const EMPTY_CONTACT: Contact = { fullName: "", businessName: "", whatsapp: "", email: "" };
const STEPS = [
  { number: "01", title: "Profil usaha", time: "± 1 menit" },
  { number: "02", title: "Proses & masalah", time: "± 3 menit" },
  { number: "03", title: "Kebutuhan sektoral", time: "± 3 menit" },
  { number: "04", title: "Kesiapan implementasi", time: "± 3 menit" },
] as const;
const SCORE_LABELS = { opportunity: "Peluang dampak", readiness: "Kesiapan digital", complexity: "Kompleksitas" } as const;

function readProblemAssessment(): ProblemAssessment | undefined {
  try {
    const raw = window.localStorage.getItem("qira-problem-assessment");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as ProblemAssessment;
    return parsed.description && parsed.profile?.name ? parsed : undefined;
  } catch { return undefined; }
}

function estimatedUserCount(teamSize = ""): number {
  if (teamSize.includes("1–3")) return 3;
  if (teamSize.includes("4–10")) return 7;
  if (teamSize.includes("11–25")) return 18;
  if (teamSize.includes("25")) return 26;
  return 1;
}

function problemAssessmentAnswers(source: ProblemAssessment): Answers {
  const businessName = source.businessName?.trim();
  const businessType = source.profile?.name ?? "Usaha";
  const description = source.description?.trim() ?? "";
  return {
    business_profile: `${businessType}${businessName ? ` bernama ${businessName}` : ""}, dengan ukuran tim ${source.teamSize ?? "yang akan dikonfirmasi"}.`,
    business_goal: `${source.priority ?? "Merapikan operasional"}. Target awal: ${source.profile?.title ?? "proses lebih jelas dan mudah dipantau"}`,
    current_process: `Kondisi awal yang disampaikan: ${description}`,
    pain_point: source.profile?.problem ?? description,
    current_tools: "WhatsApp, catatan manual, atau spreadsheet — mohon sesuaikan dengan kondisi sebenarnya.",
    user_count: estimatedUserCount(source.teamSize),
  };
}

function isVisible(question: DiscoveryQuestion, answers: Answers) {
  return !question.showWhen || String(answers[question.showWhen.questionId] ?? "") === question.showWhen.equals;
}

export function DiscoveryForm({ services }: DiscoveryFormProps) {
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT);
  const [website, setWebsite] = useState("");
  const [serviceId, setServiceId] = useState<ServiceId>(services[0]?.id ?? "discovery");
  const [businessTypeId, setBusinessTypeId] = useState<string>();
  const [answers, setAnswers] = useState<Answers>({});
  const [assessment, setAssessment] = useState({ impact: 3, readiness: 3, complexity: 3 });
  const [consented, setConsented] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showValidation, setShowValidation] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const [draftMessage, setDraftMessage] = useState("Menyiapkan Discovery…");
  const [isSubmitting, startSubmitting] = useTransition();
  const [submission, setSubmission] = useState<PublicDiscoverySubmissionState>({ status: "idle", message: "" });

  useEffect(() => {
    const draft = readDiscoveryDraft();
    const source = readProblemAssessment();
    if (draft) {
      setContact(draft.contact); setServiceId(draft.serviceId); setBusinessTypeId(draft.businessTypeId);
      setAnswers(draft.answers); setAssessment(draft.assessment); setConsented(draft.consented);
      setCurrentStep(Math.min(4, Math.max(1, draft.currentStep)));
      setDraftMessage("Jawaban terakhir Anda sudah dipulihkan.");
    } else if (source) {
      setContact((value) => ({ ...value, businessName: source.businessName?.trim() ?? "" }));
      setServiceId("business-apps"); setBusinessTypeId(source.profile?.businessTypeId);
      setAnswers(problemAssessmentAnswers(source));
      setDraftMessage("Data dari Coba Masalah sudah terisi. Anda cukup memeriksa dan melengkapinya.");
    }
    setDraftReady(true);
  }, []);

  useEffect(() => {
    if (!draftReady) return;
    writeDiscoveryDraft({ schemaVersion: DISCOVERY_DRAFT_VERSION, serviceId, businessTypeId, contact, currentStep, answers, assessment, consented, savedAt: new Date().toISOString() });
    const timer = window.setTimeout(() => setDraftMessage("Tersimpan otomatis di perangkat ini."), 400);
    return () => window.clearTimeout(timer);
  }, [answers, assessment, businessTypeId, consented, contact, currentStep, draftReady, serviceId]);

  const blueprint = useMemo(() => getBusinessBlueprint(businessTypeId), [businessTypeId]);
  const questionnaire = useMemo(() => {
    const base = getDiscoveryQuestionnaire(serviceId);
    const sector = (blueprint?.sectorQuestions ?? []).map((question) => ({ ...question, stage: "sector" as const }));
    return { ...base, questions: [...base.questions, ...sector] };
  }, [blueprint, serviceId]);
  const visibleQuestions = questionnaire.questions.filter((question) => isVisible(question, answers));
  const stage = (["profile", "process", "sector", "implementation"] as const)[currentStep - 1];
  const stepQuestions = visibleQuestions.filter((question) => question.stage === stage);
  const missing = useMemo(() => findMissingRequiredAnswers(questionnaire, answers), [answers, questionnaire]);
  const stepMissing = stepQuestions.filter((question) => question.required && missing.includes(question.id));
  const requiredCount = visibleQuestions.filter((question) => question.required).length;
  const progress = requiredCount ? Math.round(((requiredCount - missing.length) / requiredCount) * 100) : 100;
  const contactReady = contact.fullName.trim().length >= 2 && contact.businessName.trim().length >= 2 && /^[0-9+() -]{8,24}$/.test(contact.whatsapp.trim()) && (!contact.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()));
  const scores = calculateDiscoveryScores({ opportunity: { expectedImpact: assessment.impact }, readiness: { selfAssessment: assessment.readiness }, complexity: { selfAssessment: assessment.complexity } });
  const ready = contactReady && missing.length === 0 && consented;

  function changeStep(next: number) {
    setCurrentStep(next); setShowValidation(false); setSubmission({ status: "idle", message: "" });
    window.setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }
  function nextStep() {
    setShowValidation(true);
    if ((currentStep === 1 && !contactReady) || stepMissing.length) return;
    changeStep(Math.min(4, currentStep + 1));
  }
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setShowValidation(true); setSubmission({ status: "idle", message: "" });
    if (!ready) return;
    startSubmitting(async () => {
      const result = await submitPublicDiscovery({ contact, website, serviceId, businessTypeId, answers, assessment, consented });
      setSubmission(result);
      if (result.status === "success" && result.reference) {
        sessionStorage.setItem("qira.discovery.reference", result.reference);
        clearDiscoveryDraft(); router.push("/discovery/proposal");
      }
    });
  }
  function removeDraft() {
    clearDiscoveryDraft(); setContact(EMPTY_CONTACT); setAnswers({}); setAssessment({ impact: 3, readiness: 3, complexity: 3 });
    setConsented(false); setCurrentStep(1); setDraftMessage("Draft sudah dihapus.");
  }
  function updateAnswer(id: string, value: string) { setAnswers((current) => ({ ...current, [id]: value })); }

  function renderQuestion(question: DiscoveryQuestion) {
    const hasError = showValidation && missing.includes(question.id);
    const id = `question-${question.id}`;
    return <label className={styles.field} key={question.id} htmlFor={id}>
      <span>{question.prompt}{question.required ? " *" : " (opsional)"}</span>
      {question.answerType === "long_text" ? <textarea id={id} rows={4} value={String(answers[question.id] ?? "")} aria-invalid={hasError} onChange={(event) => updateAnswer(question.id, event.target.value)} />
        : question.answerType === "single_select" ? <select id={id} value={String(answers[question.id] ?? "")} aria-invalid={hasError} onChange={(event) => updateAnswer(question.id, event.target.value)}><option value="">Pilih jawaban</option>{question.options?.map((option) => <option key={option}>{option}</option>)}</select>
          : <input id={id} type={question.answerType === "number" ? "number" : "text"} min={question.answerType === "number" ? 0 : undefined} value={String(answers[question.id] ?? "")} aria-invalid={hasError} onChange={(event) => updateAnswer(question.id, event.target.value)} />}
      {hasError ? <small>Jawaban ini diperlukan untuk melanjutkan.</small> : null}
    </label>;
  }

  return <form className={styles.workspace} onSubmit={handleSubmit} noValidate>
    <aside className={styles.sidebar}>
      <div className={styles.progressHeader}><span>Kelengkapan jawaban</span><strong>{progress}%</strong></div>
      <div className={styles.progressTrack} aria-label={`Kelengkapan ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
      <ol className={styles.steps}>{STEPS.map((item, index) => <li key={item.number} className={index + 1 === currentStep ? styles.currentStep : index + 1 < currentStep ? styles.completedStep : ""}><button type="button" onClick={() => index + 1 < currentStep && changeStep(index + 1)}><span>{index + 1 < currentStep ? "✓" : item.number}</span><span><strong>{item.title}</strong><small>{item.time}</small></span></button></li>)}</ol>
      <div className={styles.safetyNote}><strong>Detail tanpa terasa panjang.</strong><p>QIRA hanya menampilkan pertanyaan yang relevan dengan usaha dan jawaban Anda.</p></div>
      <div className={styles.draftStatus}><span>{draftMessage}</span><button type="button" onClick={removeDraft}>Hapus draft</button></div>
    </aside>

    <div className={styles.formContent} ref={topRef}>
      <div className={styles.mobileProgress}>Tahap {currentStep} dari 4 <span>{STEPS[currentStep - 1].time}</span></div>
      <section className={styles.formSection}>
        <div className={styles.sectionNumber}>{STEPS[currentStep - 1].number} · {STEPS[currentStep - 1].time}</div>
        <div className={styles.sectionTitle}>
          <h2>{currentStep === 1 ? "Konfirmasi profil usaha Anda." : currentStep === 2 ? "Bagaimana usaha berjalan saat ini?" : currentStep === 3 ? `Detail operasional ${blueprint?.name ?? "usaha Anda"}.` : "Siapkan rancangan implementasi."}</h2>
          <p>{currentStep === 1 ? "Sebagian jawaban sudah diambil dari Coba Masalah. Periksa, lalu lengkapi data kontak." : currentStep === 2 ? "Kami memetakan proses dan titik masalah agar solusi tidak sekadar terlihat menarik." : currentStep === 3 ? "Pertanyaan ini dipilih khusus dari blueprint usaha Anda." : "Informasi ini membantu QIRA menyusun ruang lingkup, data awal, dan jadwal yang realistis."}</p>
        </div>

        {currentStep === 1 ? <>
          <div className={styles.contactGrid}>{([['fullName','Nama lengkap *','text','name'],['businessName','Nama bisnis/perusahaan *','text','organization'],['whatsapp','Nomor WhatsApp *','tel','tel'],['email','Email (opsional)','email','email']] as const).map(([key,label,type,autoComplete]) => <label className={styles.field} key={key}><span>{label}</span><input type={type} autoComplete={autoComplete} value={contact[key]} aria-invalid={showValidation && ((key === "fullName" || key === "businessName") ? contact[key].trim().length < 2 : key === "whatsapp" ? !/^[0-9+() -]{8,24}$/.test(contact.whatsapp.trim()) : Boolean(contact.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())))} onChange={(event) => setContact((value) => ({ ...value, [key]: event.target.value }))} /></label>)}</div>
          <div className={styles.serviceSummary}><span>Solusi yang sedang disiapkan</span><strong>{services.find((service) => service.id === serviceId)?.name}</strong><p>{blueprint ? `Disesuaikan untuk ${blueprint.name}` : "Disesuaikan dengan kebutuhan utama Anda"}</p></div>
          <label className={styles.honeypot} aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
        </> : null}

        <div className={styles.questionGrid}>{stepQuestions.map(renderQuestion)}</div>
        {currentStep === 3 && stepQuestions.length === 0 ? <div className={styles.emptySector}><strong>Profil sektoral belum terbaca.</strong><p>Kembali ke Coba Masalah agar QIRA dapat memilih pertanyaan khusus usaha Anda.</p></div> : null}

        {currentStep === 4 ? <>
          <div className={styles.assessmentGrid}>{([['impact','Perkiraan dampak','Seberapa besar manfaat jika masalah diselesaikan?'],['readiness','Kesiapan','Seberapa siap proses, data, dan pemiliknya?'],['complexity','Kompleksitas','Seberapa banyak sistem dan pengecualian terlibat?']] as const).map(([key,label,help]) => <label className={styles.rangeField} key={key}><span><strong>{label}</strong><output>{assessment[key]}/5</output></span><small>{help}</small><input type="range" min="0" max="5" step="1" value={assessment[key]} onChange={(event) => setAssessment((value) => ({ ...value, [key]: Number(event.target.value) }))} /></label>)}</div>
          <div className={styles.scoreGrid}>{scores.map((score) => <div className={styles.scoreCard} key={score.type}><span>{SCORE_LABELS[score.type]}</span><strong>{score.value}</strong><small>dari 100</small></div>)}</div>
          <label className={styles.consent}><input type="checkbox" checked={consented} onChange={(event) => setConsented(event.target.checked)} /><span>Saya menyetujui data ini disimpan oleh QIRA dan dapat dihubungi untuk tindak lanjut Discovery.</span></label>
        </> : null}
      </section>

      <div className={styles.stepActions}>
        {currentStep > 1 ? <button className={styles.backButton} type="button" onClick={() => changeStep(currentStep - 1)}>Kembali</button> : <span />}
        {currentStep < 4 ? <button className={styles.submitButton} type="button" onClick={nextStep}>Lanjut ke tahap {currentStep + 1}</button> : <button className={styles.submitButton} type="submit" disabled={isSubmitting}>{isSubmitting ? "Menyiapkan rancangan…" : "Kirim & lihat rancangan QIRA"}</button>}
      </div>
      {showValidation && ((currentStep === 1 && !contactReady) || stepMissing.length > 0 || (currentStep === 4 && !consented)) ? <div className={styles.errorMessage} role="status">Lengkapi bagian yang ditandai sebelum melanjutkan.</div> : null}
      {submission.status === "error" ? <div className={styles.errorMessage} role="status">{submission.message}</div> : null}
    </div>
  </form>;
}
