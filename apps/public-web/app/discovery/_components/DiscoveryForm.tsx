"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  calculateDiscoveryScores,
  findMissingRequiredAnswers,
  getDiscoveryQuestionnaire,
  type ServiceId,
} from "@qira/domain";
import styles from "../discovery.module.css";
import {
  submitPublicDiscovery,
  type PublicDiscoverySubmissionState,
} from "../actions";
import {
  clearDiscoveryDraft,
  DISCOVERY_DRAFT_VERSION,
  readDiscoveryDraft,
  writeDiscoveryDraft,
} from "../_lib/draft";

interface ServiceOption {
  id: ServiceId;
  name: string;
  outcome: string;
}

interface DiscoveryFormProps {
  services: readonly ServiceOption[];
}

type Answers = Record<string, string | number | undefined>;

const SCORE_LABELS = {
  opportunity: "Peluang dampak",
  readiness: "Kesiapan digital",
  complexity: "Kompleksitas",
} as const;

export function DiscoveryForm({ services }: DiscoveryFormProps) {
  const router = useRouter();
  const [contact, setContact] = useState({ fullName: "", businessName: "", whatsapp: "", email: "" });
  const [website, setWebsite] = useState("");
  const [serviceId, setServiceId] = useState<ServiceId>(services[0]?.id ?? "discovery");
  const [answers, setAnswers] = useState<Answers>({});
  const [consented, setConsented] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [assessment, setAssessment] = useState({ impact: 3, readiness: 3, complexity: 3 });
  const [draftReady, setDraftReady] = useState(false);
  const [draftMessage, setDraftMessage] = useState("Draft lokal belum dibuat.");
  const [isSubmitting, startSubmitting] = useTransition();
  const [submission, setSubmission] = useState<PublicDiscoverySubmissionState>({
    status: "idle",
    message: "",
  });

  useEffect(() => {
    const draft = readDiscoveryDraft();
    if (draft) {
      setServiceId(draft.serviceId);
      setAnswers(draft.answers);
      setAssessment(draft.assessment);
      setConsented(draft.consented);
      setDraftMessage("Draft dari tab ini berhasil dipulihkan.");
    }
    setDraftReady(true);
  }, []);

  useEffect(() => {
    if (!draftReady) return;
    writeDiscoveryDraft({
      schemaVersion: DISCOVERY_DRAFT_VERSION,
      serviceId,
      answers,
      assessment,
      consented,
      savedAt: new Date().toISOString(),
    });
    setDraftMessage("Draft tersimpan sementara di tab ini.");
  }, [answers, assessment, consented, draftReady, serviceId]);

  const questionnaire = useMemo(() => getDiscoveryQuestionnaire(serviceId), [serviceId]);
  const missing = useMemo(
    () => findMissingRequiredAnswers(questionnaire, answers),
    [answers, questionnaire],
  );
  const requiredCount = questionnaire.questions.filter((question) => question.required).length;
  const completedRequired = requiredCount - missing.length;
  const progress = requiredCount === 0 ? 100 : Math.round((completedRequired / requiredCount) * 100);
  const scores = calculateDiscoveryScores({
    opportunity: { expectedImpact: assessment.impact },
    readiness: { selfAssessment: assessment.readiness },
    complexity: { selfAssessment: assessment.complexity },
  });

  function selectService(nextServiceId: ServiceId) {
    setServiceId(nextServiceId);
    setAnswers({});
    setShowValidation(false);
  }

  function updateAnswer(id: string, value: string) {
    setAnswers((current) => ({ ...current, [id]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowValidation(true);
    setSubmission({ status: "idle", message: "" });
    if (!ready) return;
    startSubmitting(async () => {
      const result = await submitPublicDiscovery({
        contact,
        website,
        serviceId,
        answers,
        assessment,
        consented,
      });
      setSubmission(result);
      if (result.status === "success" && result.reference) {
        sessionStorage.setItem("qira.discovery.reference", result.reference);
        router.push("/discovery/proposal");
      }
    });
  }

  function removeDraft() {
    clearDiscoveryDraft();
    setAnswers({});
    setAssessment({ impact: 3, readiness: 3, complexity: 3 });
    setConsented(false);
    setShowValidation(false);
    setDraftMessage("Draft lokal sudah dihapus.");
  }

  const contactReady = contact.fullName.trim().length >= 2
    && contact.businessName.trim().length >= 2
    && /^[0-9+() -]{8,24}$/.test(contact.whatsapp.trim())
    && (!contact.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()));
  const ready = contactReady && missing.length === 0 && consented;

  return (
    <form className={styles.workspace} onSubmit={handleSubmit} noValidate>
      <aside className={styles.sidebar}>
        <div className={styles.progressHeader}>
          <span>Kelengkapan</span>
          <strong>{progress}%</strong>
        </div>
        <div className={styles.progressTrack} aria-label={`Kelengkapan ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <ol className={styles.steps}>
          <li className={contactReady ? styles.activeStep : ""}><span>01</span>Data kontak</li>
          <li className={styles.activeStep}><span>02</span>Pilih kebutuhan</li>
          <li className={progress > 0 ? styles.activeStep : ""}><span>03</span>Kondisi bisnis</li>
          <li className={ready ? styles.activeStep : ""}><span>04</span>Kirim Discovery</li>
        </ol>
        <div className={styles.safetyNote}>
          <strong>Anda tetap memegang kendali.</strong>
          <p>AI tidak membuat komitmen harga atau keputusan final tanpa review QIRA.</p>
        </div>
        <div className={styles.draftStatus}>
          <span>{draftMessage}</span>
          <button type="button" onClick={removeDraft}>Hapus draft</button>
        </div>
      </aside>

      <div className={styles.formContent}>
        <section className={styles.formSection} aria-labelledby="contact-heading">
          <div className={styles.sectionNumber}>01</div>
          <div className={styles.sectionTitle}>
            <h2 id="contact-heading">Mari berkenalan.</h2>
            <p>Tim QIRA memakai data ini hanya untuk meninjau dan menindaklanjuti Discovery Anda.</p>
          </div>
          <div className={styles.contactGrid}>
            {([
              ["fullName", "Nama lengkap *", "text", "name"],
              ["businessName", "Nama bisnis/perusahaan *", "text", "organization"],
              ["whatsapp", "Nomor WhatsApp *", "tel", "tel"],
              ["email", "Email (opsional)", "email", "email"],
            ] as const).map(([key, label, type, autoComplete]) => {
              const invalid = showValidation && (
                key === "fullName" || key === "businessName"
                  ? contact[key].trim().length < 2
                  : key === "whatsapp"
                    ? !/^[0-9+() -]{8,24}$/.test(contact.whatsapp.trim())
                    : Boolean(contact.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()))
              );
              return (
                <label className={styles.field} key={key}>
                  <span>{label}</span>
                  <input
                    type={type}
                    autoComplete={autoComplete}
                    value={contact[key]}
                    aria-invalid={invalid}
                    onChange={(event) => setContact((current) => ({ ...current, [key]: event.target.value }))}
                  />
                  {invalid ? <small>Mohon periksa data ini.</small> : null}
                </label>
              );
            })}
          </div>
          <label className={styles.honeypot} aria-hidden="true">
            Website
            <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
          </label>
        </section>

        <section className={styles.formSection} aria-labelledby="service-heading">
          <div className={styles.sectionNumber}>02</div>
          <div className={styles.sectionTitle}>
            <h2 id="service-heading">Apa kebutuhan utama Anda?</h2>
            <p>Pilih satu fokus untuk Discovery pertama. Kebutuhan lain dapat ditambahkan saat review.</p>
          </div>
          <div className={styles.serviceOptions}>
            {services.map((service) => (
              <button
                className={service.id === serviceId ? styles.selectedService : styles.serviceOption}
                key={service.id}
                type="button"
                aria-pressed={service.id === serviceId}
                onClick={() => selectService(service.id)}
              >
                <strong>{service.name}</strong>
                <span>{service.outcome}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.formSection} aria-labelledby="business-heading">
          <div className={styles.sectionNumber}>03</div>
          <div className={styles.sectionTitle}>
            <h2 id="business-heading">Ceritakan kondisi bisnis Anda.</h2>
            <p>Pertanyaan menyesuaikan layanan yang dipilih. Tanda * wajib diisi.</p>
          </div>
          <div className={styles.questionGrid}>
            {questionnaire.questions.map((question) => {
              const hasError = showValidation && missing.includes(question.id);
              const fieldId = `question-${question.id}`;
              return (
                <label className={styles.field} key={question.id} htmlFor={fieldId}>
                  <span>{question.prompt}{question.required ? " *" : ""}</span>
                  {question.answerType === "long_text" ? (
                    <textarea
                      id={fieldId}
                      rows={4}
                      value={String(answers[question.id] ?? "")}
                      aria-invalid={hasError}
                      onChange={(event) => updateAnswer(question.id, event.target.value)}
                    />
                  ) : (
                    <input
                      id={fieldId}
                      type={question.answerType === "number" ? "number" : "text"}
                      min={question.answerType === "number" ? 0 : undefined}
                      value={String(answers[question.id] ?? "")}
                      aria-invalid={hasError}
                      onChange={(event) => updateAnswer(question.id, event.target.value)}
                    />
                  )}
                  {hasError ? <small>Jawaban ini diperlukan.</small> : null}
                </label>
              );
            })}
          </div>
        </section>

        <section className={styles.formSection} aria-labelledby="assessment-heading">
          <div className={styles.sectionNumber}>04</div>
          <div className={styles.sectionTitle}>
            <h2 id="assessment-heading">Penilaian awal.</h2>
            <p>Geser berdasarkan pemahaman saat ini. QIRA akan memvalidasi faktor lengkap saat review.</p>
          </div>
          <div className={styles.assessmentGrid}>
            {([
              ["impact", "Perkiraan dampak", "Seberapa besar manfaat jika masalah diselesaikan?"],
              ["readiness", "Kesiapan", "Seberapa siap proses, data, dan pemiliknya?"],
              ["complexity", "Kompleksitas", "Seberapa banyak sistem dan pengecualian terlibat?"],
            ] as const).map(([key, label, help]) => (
              <label className={styles.rangeField} key={key}>
                <span><strong>{label}</strong><output>{assessment[key]}/5</output></span>
                <small>{help}</small>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={assessment[key]}
                  onChange={(event) => setAssessment((current) => ({ ...current, [key]: Number(event.target.value) }))}
                />
              </label>
            ))}
          </div>
          <div className={styles.scoreGrid} aria-label="Preview skor Discovery">
            {scores.map((score) => (
              <div className={styles.scoreCard} key={score.type}>
                <span>{SCORE_LABELS[score.type]}</span>
                <strong>{score.value}</strong>
                <small>dari 100 · ruleset {score.rulesetVersion}</small>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.consentSection}>
          <label className={styles.consent}>
            <input type="checkbox" checked={consented} onChange={(event) => setConsented(event.target.checked)} />
            <span>Saya menyetujui data ini disimpan oleh QIRA dan tim QIRA dapat menghubungi saya melalui WhatsApp atau email untuk menindaklanjuti Discovery.</span>
          </label>
          <button className={styles.submitButton} type="submit" disabled={isSubmitting || submission.status === "success"}>
            {isSubmitting ? "Mengirim Discovery…" : submission.status === "success" ? "Discovery sudah terkirim" : "Kirim Discovery ke QIRA"}
          </button>
          {submission.status !== "idle" ? (
            <div className={submission.status === "success" ? styles.successMessage : styles.errorMessage} role="status">
              {submission.status === "success" && submission.reference ? <strong>Referensi: {submission.reference}</strong> : null}
              <span>{submission.message}</span>
            </div>
          ) : showValidation && !ready ? (
            <div className={styles.errorMessage} role="status">
              Lengkapi data kontak, {missing.length} jawaban wajib, dan persetujuan sebelum mengirim.
            </div>
          ) : null}
        </section>
      </div>
    </form>
  );
}
