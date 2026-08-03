"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  createProposalPreview,
  findService,
  PROPOSAL_PACKAGES,
  type ProposalPackageId,
} from "@qira/domain";
import { readDiscoveryDraft, type DiscoveryPreviewDraft } from "../_lib/draft";
import styles from "./proposal.module.css";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export function ProposalPreview() {
  const [draft, setDraft] = useState<DiscoveryPreviewDraft>();
  const [loaded, setLoaded] = useState(false);
  const [packageId, setPackageId] = useState<ProposalPackageId>("digital-foundation");
  const [commercialApproved, setCommercialApproved] = useState(false);

  useEffect(() => {
    setDraft(readDiscoveryDraft());
    setLoaded(true);
  }, []);

  const proposal = useMemo(() => {
    if (!draft) return undefined;
    return createProposalPreview({
      serviceId: draft.serviceId,
      packageId,
      objective: String(draft.answers.business_goal ?? ""),
    });
  }, [draft, packageId]);

  if (!loaded) return <main className={styles.empty}>Memuat proposal preview…</main>;
  if (!draft || !proposal) {
    return (
      <main className={styles.empty}>
        <h1>Discovery belum tersedia.</h1>
        <Link href="/discovery">Mulai Discovery</Link>
      </main>
    );
  }

  const service = findService(draft.serviceId);

  return (
    <main className={styles.page}>
      <header className={styles.toolbar}>
        <Link href="/discovery/review">← Kembali ke review</Link>
        <span>Proposal preview · belum mengikat</span>
        <button type="button" disabled={!commercialApproved} onClick={() => window.print()}>
          Cetak preview
        </button>
      </header>

      <aside className={styles.packagePicker} aria-label="Pilih paket indikatif">
        {PROPOSAL_PACKAGES.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={packageId === item.id}
            className={packageId === item.id ? styles.activePackage : ""}
            onClick={() => { setPackageId(item.id); setCommercialApproved(false); }}
          >
            <span>{item.name}</span>
            <strong>{rupiah.format(item.indicativePriceIdr)}</strong>
          </button>
        ))}
      </aside>

      <article className={styles.document}>
        <section className={styles.cover}>
          <div className={styles.logo}>QIRA<span>.</span></div>
          <p>Proposal solusi · {proposal.version}</p>
          <h1>{proposal.package.name}</h1>
          <h2>{service?.name}</h2>
          <div className={styles.coverMeta}>
            <span>Harga indikatif</span>
            <strong>{rupiah.format(proposal.package.indicativePriceIdr)}</strong>
            <small>Memerlukan persetujuan Founder QIRA</small>
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.kicker}>01 · Tujuan</p>
          <h2>Hasil yang ingin dicapai</h2>
          <p className={styles.lead}>{proposal.objective}</p>
        </section>

        <section className={styles.section}>
          <p className={styles.kicker}>02 · Scope dan deliverables</p>
          <h2>Apa yang akan dikerjakan</h2>
          <ul className={styles.cards}>{proposal.scope.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <section className={styles.section}>
          <p className={styles.kicker}>03 · Rencana implementasi</p>
          <h2>{proposal.package.durationWeeks[0]}–{proposal.package.durationWeeks[1]} minggu</h2>
          <div className={styles.timeline}>
            <div><strong>1</strong><span>Konfirmasi scope</span></div>
            <div><strong>2</strong><span>Build dan validasi</span></div>
            <div><strong>3</strong><span>Implementasi dan handover</span></div>
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.kicker}>04 · Investasi</p>
          <h2>{rupiah.format(proposal.package.indicativePriceIdr)}</h2>
          <div className={styles.payments}>
            {proposal.paymentTerms.map((term) => (
              <div key={term.label}><span>{term.label} · {term.percentage}%</span><strong>{rupiah.format(term.amountIdr)}</strong></div>
            ))}
          </div>
          <p className={styles.disclaimer}>Simulasi indikatif; belum termasuk pajak atau biaya pihak ketiga dan belum menjadi penawaran mengikat.</p>
        </section>

        <section className={styles.threeColumns}>
          <div><h3>Asumsi</h3><ul>{proposal.assumptions.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><h3>Risiko</h3><ul>{proposal.risks.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><h3>Di luar scope</h3><ul>{proposal.exclusions.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </section>

        <section className={styles.approval}>
          <label>
            <input type="checkbox" checked={commercialApproved} onChange={(event) => setCommercialApproved(event.target.checked)} />
            <span>Saya menyimulasikan approval Founder QIRA atas paket, harga, dan termin proposal preview ini.</span>
          </label>
          <p>{commercialApproved ? "Preview siap dicetak untuk review internal." : "Cetak dinonaktifkan sampai approval komersial preview diberikan."}</p>
        </section>
      </article>
    </main>
  );
}

