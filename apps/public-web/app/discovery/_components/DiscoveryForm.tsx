"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getPublicDiscoveryQuestionnaire, type DiscoveryQuestion, type ServiceId } from "@qira/domain";
import { trackConversion } from "../../_components/ConversionTracker";
import styles from "../discovery.module.css";
import { submitPublicDiscovery, type PublicDiscoverySubmissionState } from "../actions";
import { clearDiscoveryDraft, DISCOVERY_DRAFT_VERSION, readDiscoveryDraft, writeDiscoveryDraft, writeSubmittedDiscoveryPreview } from "../_lib/draft";

interface ServiceOption { id: ServiceId; name: string; outcome: string }
interface DiscoveryFormProps { services: readonly ServiceOption[] }
type Answers = Record<string, string | number | undefined>;
type Contact = { fullName: string; businessName: string; whatsapp: string; email: string };
type ProblemAssessment = { businessName?: string; teamSize?: string; priority?: string; description?: string; profile?: { businessTypeId?: string; name?: string; title?: string; problem?: string } };
type Screen = { kind: "identity" } | { kind: "question"; question: DiscoveryQuestion } | { kind: "consent" };

const EMPTY_CONTACT: Contact = { fullName: "", businessName: "", whatsapp: "", email: "" };
const DEFAULT_ASSESSMENT = { impact: 3, readiness: 3, complexity: 3 };
const PROBLEM_ASSESSMENT_KEY = "qira-problem-assessment";
const PROBLEM_ASSESSMENT_ORIGIN_KEY = "qira-problem-assessment-origin";
const AUTO_FILLED_QUESTION_IDS = new Set(["business_profile", "business_goal", "current_process"]);

function readProblemAssessment(): ProblemAssessment | undefined {
  try {
    const sessionRaw = window.sessionStorage.getItem(PROBLEM_ASSESSMENT_KEY);
    const legacyRaw = window.localStorage.getItem(PROBLEM_ASSESSMENT_KEY);
    const raw = sessionRaw ?? legacyRaw;
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as ProblemAssessment;
    if (!parsed.description || !parsed.profile?.name) return undefined;

    if (!sessionRaw && legacyRaw) {
      window.sessionStorage.setItem(PROBLEM_ASSESSMENT_KEY, legacyRaw);
      window.sessionStorage.setItem(PROBLEM_ASSESSMENT_ORIGIN_KEY, "1");
      window.localStorage.removeItem(PROBLEM_ASSESSMENT_KEY);
    }
    return parsed;
  } catch {
    return undefined;
  }
}

function clearProblemAssessment() {
  try {
    window.sessionStorage.removeItem(PROBLEM_ASSESSMENT_KEY);
    window.sessionStorage.removeItem(PROBLEM_ASSESSMENT_ORIGIN_KEY);
    window.localStorage.removeItem(PROBLEM_ASSESSMENT_KEY);
  } catch {
    // Best-effort cleanup only.
  }
}

function problemAssessmentAnswers(source: ProblemAssessment): Answers {
  const businessName = source.businessName?.trim();
  const businessType = source.profile?.name ?? "Usaha";
  const description = source.description?.trim() ?? "";
  return {
    business_profile: `${businessType}${businessName ? ` bernama ${businessName}` : ""}, dengan ukuran tim ${source.teamSize ?? "yang akan dikonfirmasi"}.`,
    business_goal: `${source.priority ?? "Merapikan pekerjaan sehari-hari"}. Target awal: ${source.profile?.title ?? "pekerjaan lebih jelas dan mudah dipantau"}`,
    current_process: description,
    pain_point: source.profile?.problem ?? description,
  };
}

function normalizeOldAnswers(input: Answers): Answers {
  const answers = { ...input };
  if (answers.integration_needed === "Ya, perlu integrasi") answers.integration_needed = "Ya, ada aplikasi lain";
  if (answers.integration_needed === "Tidak untuk tahap awal") answers.integration_needed = "Tidak, cukup QIRA dulu";
  return answers;
}

function isVisible(question: DiscoveryQuestion, answers: Answers) {
  return !question.showWhen || String(answers[question.showWhen.questionId] ?? "") === question.showWhen.equals;
}

function stageLabel(question?: DiscoveryQuestion) {
  if (!question) return "Sedikit lagi";
  if (question.stage === "profile") return "Tentang usaha";
  if (question.stage === "process") return "Cara kerja sekarang";
  return "Hampir selesai";
}

export function DiscoveryForm({ services }: DiscoveryFormProps) {
  const router = useRouter();
  const defaultService: ServiceId = services.some((service) => service.id === "business-apps") ? "business-apps" : (services[0]?.id ?? "discovery");
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT);
  const [website, setWebsite] = useState("");
  const [serviceId, setServiceId] = useState<ServiceId>(defaultService);
  const [businessTypeId, setBusinessTypeId] = useState<string>();
  const [answers, setAnswers] = useState<Answers>({});
  const [assessment, setAssessment] = useState(DEFAULT_ASSESSMENT);
  const [consented, setConsented] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draftReady, setDraftReady] = useState(false);
  const [continuedFromProblemStory, setContinuedFromProblemStory] = useState(false);
  const [isSubmitting, startSubmitting] = useTransition();
  const [submission, setSubmission] = useState<PublicDiscoverySubmissionState>({ status: "idle", message: "" });

  useEffect(() => {
    const draft = readDiscoveryDraft();
    const source = readProblemAssessment();
    const hasProblemStory = window.sessionStorage.getItem(PROBLEM_ASSESSMENT_ORIGIN_KEY) === "1";
    if (draft) {
      setContact(draft.contact);
      setServiceId(draft.serviceId);
      setBusinessTypeId(draft.businessTypeId);
      setAnswers(normalizeOldAnswers(draft.answers));
      setAssessment(draft.assessment);
      setConsented(draft.consented);
      setCurrentIndex(Math.max(0, draft.currentStep - 1));
      setContinuedFromProblemStory(hasProblemStory);
    } else if (source) {
      setContact((value) => ({ ...value, businessName: source.businessName?.trim() ?? "" }));
      setServiceId("business-apps");
      setBusinessTypeId(source.profile?.businessTypeId);
      setAnswers(problemAssessmentAnswers(source));
      setContinuedFromProblemStory(true);
    }
    setDraftReady(true);
    void trackConversion("discovery_start");
  }, []);

  const questionnaire = useMemo(() => getPublicDiscoveryQuestionnaire(serviceId), [serviceId]);

  const visibleQuestions = useMemo(() => questionnaire.questions
    .filter((question) => isVisible(question, answers))
    .filter((question) => !(continuedFromProblemStory && AUTO_FILLED_QUESTION_IDS.has(question.id))),
  [answers, continuedFromProblemStory, questionnaire]);

  const screens = useMemo<Screen[]>(() => [
    { kind: "identity" },
    ...visibleQuestions.map((question) => ({ kind: "question" as const, question })),
    { kind: "consent" },
  ], [visibleQuestions]);

  const safeIndex = Math.min(currentIndex, Math.max(0, screens.length - 1));
  const screen = screens[safeIndex];
  const progress = Math.round(((safeIndex + 1) / screens.length) * 100);

  useEffect(() => {
    if (!draftReady) return;
    writeDiscoveryDraft({ schemaVersion: DISCOVERY_DRAFT_VERSION, serviceId, businessTypeId, contact, currentStep: safeIndex + 1, answers, assessment, consented, savedAt: new Date().toISOString() });
  }, [answers, assessment, businessTypeId, consented, contact, draftReady, safeIndex, serviceId]);

  function currentIsValid() {
    if (!screen) return false;
    if (screen.kind === "identity") {
      return contact.fullName.trim().length >= 2
        && contact.businessName.trim().length >= 2
        && /^[0-9+() -]{8,24}$/.test(contact.whatsapp.trim())
        && (!contact.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()));
    }
    if (screen.kind === "consent") return consented;
    const value = answers[screen.question.id];
    return !screen.question.required || !(value === undefined || (typeof value === "string" && value.trim() === ""));
  }

  function updateAnswer(id: string, value: string) {
    setAnswers((current) => ({ ...current, [id]: value }));
  }

  function resetFlow() {
    clearDiscoveryDraft();
    clearProblemAssessment();
    setContact(EMPTY_CONTACT);
    setAnswers({});
    setAssessment(DEFAULT_ASSESSMENT);
    setConsented(false);
    setBusinessTypeId(undefined);
    setServiceId(defaultService);
    setWebsite("");
    setCurrentIndex(0);
    setContinuedFromProblemStory(false);
    setSubmission({ status: "idle", message: "" });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmission({ status: "idle", message: "" });
    if (!currentIsValid()) {
      setSubmission({ status: "error", message: "Lengkapi bagian ini dulu." });
      return;
    }

    if (safeIndex < screens.length - 1) {
      setCurrentIndex(safeIndex + 1);
      return;
    }

    startSubmitting(async () => {
      const result = await submitPublicDiscovery({ contact, website, serviceId, businessTypeId, answers, assessment, consented });
      setSubmission(result);
      if (result.status === "success" && result.reference) {
        writeSubmittedDiscoveryPreview({
          schemaVersion: DISCOVERY_DRAFT_VERSION,
          serviceId,
          businessTypeId,
          contact,
          currentStep: safeIndex + 1,
          answers,
          assessment,
          consented,
          savedAt: new Date().toISOString(),
        });
        sessionStorage.setItem("qira.discovery.reference", result.reference);
        clearDiscoveryDraft();
        clearProblemAssessment();
        setContinuedFromProblemStory(false);
        void trackConversion("discovery_submit");
        router.push("/discovery/proposal");
      }
    });
  }

  function renderQuestion(question: DiscoveryQuestion) {
    const id = `question-${question.id}`;
    return <label className={styles.field} htmlFor={id}>
      <span>{question.prompt}</span>
      {question.answerType === "long_text" ? <textarea id={id} autoFocus rows={4} value={String(answers[question.id] ?? "")} onChange={(event) => updateAnswer(question.id, event.target.value)} />
        : question.answerType === "single_select" ? <select id={id} autoFocus value={String(answers[question.id] ?? "")} onChange={(event) => updateAnswer(question.id, event.target.value)}><option value="">Pilih</option>{question.options?.map((option) => <option key={option}>{option}</option>)}</select>
          : <input id={id} autoFocus type={question.answerType === "number" ? "number" : "text"} min={question.answerType === "number" ? 0 : undefined} value={String(answers[question.id] ?? "")} onChange={(event) => updateAnswer(question.id, event.target.value)} />}
    </label>;
  }

  return <form className={styles.workspace} style={{ gridTemplateColumns: "1fr", maxWidth: 820 }} onSubmit={handleSubmit} noValidate>
    <div className={styles.formContent}>
      <div className={styles.mobileProgress} style={{ display: "flex" }}><span>{safeIndex + 1} / {screens.length}</span><span>{progress}%</span></div>
      <div className={styles.progressTrack} aria-label={`Progres ${progress}%`}><span style={{ width: `${progress}%` }} /></div>

      <section className={styles.formSection}>
        <div className={styles.sectionNumber}>{screen?.kind === "question" ? stageLabel(screen.question) : screen?.kind === "identity" ? "Kenalan singkat" : "Selesai"}</div>

        {screen?.kind === "identity" ? <>
          <div className={styles.sectionTitle}><h2>Kenalan dulu.</h2><p>Nama, usaha, WhatsApp.</p></div>
          <div className={styles.contactGrid}>
            <label className={styles.field}><span>Nama</span><input autoFocus autoComplete="name" value={contact.fullName} onChange={(event) => setContact((value) => ({ ...value, fullName: event.target.value }))} /></label>
            <label className={styles.field}><span>Usaha</span><input autoComplete="organization" value={contact.businessName} onChange={(event) => setContact((value) => ({ ...value, businessName: event.target.value }))} /></label>
            <label className={styles.field}><span>WhatsApp</span><input type="tel" autoComplete="tel" value={contact.whatsapp} onChange={(event) => setContact((value) => ({ ...value, whatsapp: event.target.value }))} /></label>
            <label className={styles.field}><span>Email (opsional)</span><input type="email" autoComplete="email" value={contact.email} onChange={(event) => setContact((value) => ({ ...value, email: event.target.value }))} /></label>
          </div>
        </> : null}

        {screen?.kind === "question" ? <div className={styles.questionGrid}>{renderQuestion(screen.question)}</div> : null}

        {screen?.kind === "consent" ? <>
          <div className={styles.sectionTitle}><h2>Siap.</h2><p>Kirim untuk lihat arah awal.</p></div>
          <label className={styles.consent}><input type="checkbox" required checked={consented} onChange={(event) => setConsented(event.target.checked)} /><span>Saya setuju QIRA menggunakan jawaban ini untuk menyiapkan saran dan menghubungi saya. <a href="/privasi" target="_blank" rel="noreferrer">Privasi</a>.</span></label>
        </> : null}

        <label className={styles.honeypot} aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
      </section>

      {submission.status === "error" ? <div className={styles.errorMessage} aria-live="polite">{submission.message}</div> : null}

      <div className={styles.stepActions}>
        {safeIndex > 0 ? <button type="button" className={styles.backButton} onClick={() => setCurrentIndex(safeIndex - 1)}>Kembali</button> : <span />}
        <button className={styles.submitButton} type="submit" disabled={isSubmitting}>{isSubmitting ? "Mengirim…" : safeIndex === screens.length - 1 ? "Lihat saran" : "Lanjut"}</button>
      </div>
    </div>
  </form>;
}
