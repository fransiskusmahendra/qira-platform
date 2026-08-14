"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { calculateCommercialTerms, createProposalPreview, findService, PROPOSAL_PACKAGES, type ProposalPackageId } from "@qira/domain";
import { readDiscoveryDraft, type DiscoveryPreviewDraft } from "../_lib/draft";
import styles from "./proposal.module.css";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

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

  useEffect(() => {
    setDraft(readDiscoveryDraft());
    setReference(sessionStorage.getItem("qira.discovery.reference") ?? "QIRA-DISC-PREVIEW");
    setLoaded(true);
  }, []);

  const result = useMemo(() => {
    if (!draft) return undefined;
    const packageId = recommendPackage(draft);
    const selectedPackage = PROPOSAL_PACKAGES.find((item) => item.id === packageId);
    if (!selectedPackage) return undefined;
    const proposal = createProposalPreview({ serviceId: draft.serviceId, packageId, objective: String(draft.answers.business_goal ?? "Merapikan proses bisnis melalui solusi digital yang terukur.") });
    const commercial = calculateCommercialTerms({ basePriceIdr: selectedPackage.introductoryPriceIdr, discountPercent: 0, taxPercent: 0, downPaymentPercent: 50 });
    return { proposal, commercial, service: findService(draft.serviceId) };
  }, [draft]);

  if (!loaded) return <main className={styles.empty}>Menyiapkan proposal awal Anda…</main>;
  if (!draft || !result) return <main className={styles.empty}><h1>Discovery belum tersedia.</h1><p>Isi dan kirim Discovery agar QIRA dapat membuat proposal awal yang relevan.</p><Link href="/discovery">Mulai Discovery</Link></main>;

  const { proposal, commercial, service } = result;
  const issuedOn = new Date();
  const validUntil = new Date(issuedOn);
  validUntil.setDate(validUntil.getDate() + 14);
  const approvalMessage = encodeURIComponent(`Halo QIRA, saya tertarik melanjutkan proposal awal ${reference}. Mohon konfirmasi scope final dan invoice DP 50%.`);
  const revisionMessage = encodeURIComponent(`Halo QIRA, saya ingin meminta revisi untuk proposal awal ${reference}.`);

  return <main className={styles.page}>
    <header className={styles.customerToolbar}><Link href="/">QIRA.</Link><span>Proposal awal · {reference}</span><button type="button" onClick={() => window.print()}>Simpan / cetak</button></header>
    <section className={styles.indicativeNotice}><strong>Proposal awal otomatis</strong><span>Estimasi dibuat langsung dari Discovery Anda. Scope dan harga final akan divalidasi QIRA sebelum pembayaran.</span></section>
    <article className={styles.document}>
      <section className={styles.cover}>
        <div className={styles.logo}>QIRA<span>.</span></div><p>{reference} · {issuedOn.toLocaleDateString("id-ID")}</p><h1>{proposal.package.name}</h1><h2>{service?.name}</h2>
        <div className={styles.clientMeta}><span>Tujuan utama</span><strong>{proposal.objective}</strong><small>Disusun otomatis berdasarkan jawaban Discovery</small></div>
        <div className={styles.coverMeta}><span>Estimasi investasi awal</span><strong>{rupiah.format(commercial.totalIdr)}</strong><small>Berlaku 14 hari · sampai {validUntil.toLocaleDateString("id-ID")}</small></div>
      </section>
      <section className={styles.section}><p className={styles.kicker}>01 · Rekomendasi</p><h2>Solusi awal untuk kebutuhan Anda</h2><p className={styles.lead}>{service?.outcome}</p><ul className={styles.cards}>{proposal.scope.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section className={styles.section}><p className={styles.kicker}>02 · Concept demo</p><h2>Alur yang akan diwujudkan</h2><div className={styles.timeline}><div><strong>1</strong><span>Data atau permintaan masuk</span></div><div><strong>2</strong><span>Proses tertata dan terlihat</span></div><div><strong>3</strong><span>Status, output, dan tindak lanjut</span></div></div><Link className={styles.demoLink} href="/#demo">Buka kembali demo interaktif paket ini</Link></section>
      <section className={styles.section}><p className={styles.kicker}>03 · Implementasi</p><h2>{proposal.package.durationWeeks[0]}–{proposal.package.durationWeeks[1]} minggu</h2><div className={styles.timeline}><div><strong>1</strong><span>Konfirmasi scope dan DP 50%</span></div><div><strong>2</strong><span>Development, demo, dan UAT</span></div><div><strong>3</strong><span>Pelunasan, Go Live, onboarding</span></div></div></section>
      <section className={styles.section}><p className={styles.kicker}>04 · Harga awal</p><h2>{rupiah.format(commercial.totalIdr)}</h2><div className={styles.payments}><div><span>DP · 50% setelah scope final</span><strong>{rupiah.format(commercial.downPaymentAmountIdr)}</strong></div><div><span>Pelunasan · setelah UAT disetujui</span><strong>{rupiah.format(commercial.finalPaymentAmountIdr)}</strong></div></div><p className={styles.disclaimer}>Harga bersifat indikatif. Integrasi berbayar, domain, hosting, layanan pihak ketiga, dan permintaan di luar scope dihitung terpisah. Bug atau ketidaksesuaian terhadap scope diperbaiki dalam proses UAT.</p></section>
      <section className={styles.threeColumns}><div><h3>Termasuk</h3><ul>{proposal.scope.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3>Asumsi</h3><ul>{proposal.assumptions.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3>Belum termasuk</h3><ul>{proposal.exclusions.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
    </article>
    <section className={styles.customerDecision}><div><p className={styles.kicker}>Langkah berikutnya</p><h2>Setujui arah awal atau minta penyesuaian.</h2><p>QIRA akan memvalidasi scope, harga, jadwal, kriteria UAT, serta Managed by QIRA sebelum menerbitkan dokumen final.</p></div><div><a href={`https://wa.me/628211076517?text=${approvalMessage}`} target="_blank" rel="noreferrer">Setuju dan konfirmasi scope</a><a href={`https://wa.me/628211076517?text=${revisionMessage}`} target="_blank" rel="noreferrer">Minta revisi manual</a></div></section>
  </main>;
}
