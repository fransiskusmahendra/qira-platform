"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  calculateDiscoveryScores,
  findService,
  getDiscoveryQuestionnaire,
  type ScoreResult,
} from "@qira/domain";
import { readDiscoveryDraft, type DiscoveryPreviewDraft } from "../_lib/draft";
import styles from "../discovery.module.css";

type ReviewDecision = "pending" | "approved" | "reopen";

const SCORE_CONTENT: Record<ScoreResult["type"], { title: string; explanation: string }> = {
  opportunity: {
    title: "Peluang dampak",
    explanation: "Nilai tinggi menunjukkan manfaat bisnis yang diperkirakan semakin besar.",
  },
  readiness: {
    title: "Kesiapan digital",
    explanation: "Nilai tinggi menunjukkan proses, data, sponsor, dan tim semakin siap.",
  },
  complexity: {
    title: "Kompleksitas",
    explanation: "Nilai tinggi berarti integrasi, variasi proses, atau risiko implementasi perlu perhatian lebih.",
  },
};

export function DiscoveryReview() {
  const router = useRouter();
  const [draft, setDraft] = useState<DiscoveryPreviewDraft>();
  const [loaded, setLoaded] = useState(false);
  const [decision, setDecision] = useState<ReviewDecision>("pending");

  function approveAndContinue() {
    setDecision("approved");
    router.push("/discovery/proposal");
  }

  useEffect(() => {
    setDraft(readDiscoveryDraft());
    setLoaded(true);
  }, []);

  const review = useMemo(() => {
    if (!draft) return undefined;
    const questionnaire = getDiscoveryQuestionnaire(draft.serviceId);
    const scores = calculateDiscoveryScores({
      opportunity: { expectedImpact: draft.assessment.impact },
      readiness: { selfAssessment: draft.assessment.readiness },
      complexity: { selfAssessment: draft.assessment.complexity },
    });
    return { questionnaire, scores, service: findService(draft.serviceId) };
  }, [draft]);

  if (!loaded) {
    return <main className={styles.reviewState}>Memuat draft lokal…</main>;
  }

  if (!draft || !review) {
    return (
      <main className={styles.reviewState}>
        <p className={styles.eyebrow}>Draft tidak ditemukan</p>
        <h1>Isi Discovery terlebih dahulu.</h1>
        <p>Draft preview hanya tersedia pada tab browser tempat Anda mengisinya.</p>
        <Link className={styles.reviewLink} href="/discovery">Mulai Discovery</Link>
      </main>
    );
  }

  return (
    <main className={styles.reviewPage}>
      <header className={styles.reviewHeader}>
        <div>
          <p className={styles.eyebrow}>Consultant review · preview lokal</p>
          <h1>Ringkasan Discovery</h1>
          <p>{review.service?.name} · ruleset {review.questionnaire.version}</p>
        </div>
        <Link className={styles.reviewLinkSecondary} href="/discovery">Edit jawaban</Link>
      </header>

      <section className={styles.reviewPanel}>
        <h2>Jawaban utama</h2>
        <div className={styles.answerList}>
          {review.questionnaire.questions.map((question) => (
            <article key={question.id}>
              <span>{question.prompt}</span>
              <p>{String(draft.answers[question.id] ?? "Belum diisi")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.reviewPanel}>
        <h2>Penjelasan skor</h2>
        <div className={styles.reviewScoreGrid}>
          {review.scores.map((score) => (
            <article key={score.type}>
              <span>{SCORE_CONTENT[score.type].title}</span>
              <strong>{score.value}<small>/100</small></strong>
              <p>{SCORE_CONTENT[score.type].explanation}</p>
              <details>
                <summary>Lihat faktor</summary>
                {Object.entries(score.factors).map(([factor, value]) => (
                  <div className={styles.factorRow} key={factor}><span>{factor}</span><b>{value}/5</b></div>
                ))}
                <div className={styles.factorRow}><span>Ruleset</span><b>{score.rulesetVersion}</b></div>
              </details>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.reviewPanel}>
        <h2>Keputusan review</h2>
        <p className={styles.reviewHint}>Simulasi ini tidak membuat approval resmi atau audit event.</p>
        <div className={styles.decisionActions}>
          <button type="button" onClick={() => setDecision("reopen")}>Kembalikan untuk dilengkapi</button>
          <button type="button" onClick={approveAndContinue}>Setujui dan buat proposal</button>
        </div>
        {decision !== "pending" ? (
          <div className={decision === "approved" ? styles.successMessage : styles.errorMessage} role="status">
            {decision === "approved"
              ? "Preview ditandai disetujui. Approval resmi baru aktif setelah login, tenant verification, dan audit database tersedia."
              : "Preview ditandai perlu dilengkapi. Gunakan tombol Edit jawaban untuk kembali."}
          </div>
        ) : null}
      </section>
    </main>
  );
}
