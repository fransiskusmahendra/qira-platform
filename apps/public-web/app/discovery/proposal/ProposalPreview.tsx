"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  createProposalPreview,
  calculateCommercialTerms,
  calculateValidUntil,
  createProposalNumber,
  findService,
  PROPOSAL_PACKAGES,
  type ProposalPackageId,
} from "@qira/domain";
import { readDiscoveryDraft, type DiscoveryPreviewDraft } from "../_lib/draft";
import styles from "./proposal.module.css";
import {
  readProposalHistory,
  saveProposalVersion,
  type ProposalProfile,
  type ProposalVersion,
} from "./proposal-history";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export function ProposalPreview() {
  const [draft, setDraft] = useState<DiscoveryPreviewDraft>();
  const [loaded, setLoaded] = useState(false);
  const [packageId, setPackageId] = useState<ProposalPackageId>("digital-foundation");
  const [commercialApproved, setCommercialApproved] = useState(false);
  const [profile, setProfile] = useState<ProposalProfile>({ organizationName: "", recipientName: "", recipientRole: "", recipientEmail: "" });
  const [issueDate, setIssueDate] = useState("");
  const [validityDays, setValidityDays] = useState(14);
  const [basePriceIdr, setBasePriceIdr] = useState(4_900_000);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [history, setHistory] = useState<ProposalVersion[]>([]);
  const [versionMessage, setVersionMessage] = useState("Belum ada versi tersimpan.");

  useEffect(() => {
    setDraft(readDiscoveryDraft());
    const today = new Date().toISOString().slice(0, 10);
    setIssueDate(today);
    setHistory(readProposalHistory());
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

  const terms = useMemo(
    () => calculateCommercialTerms({ basePriceIdr, discountPercentage, taxPercentage }),
    [basePriceIdr, discountPercentage, taxPercentage],
  );
  const proposalNumber = issueDate ? createProposalNumber(issueDate, 1) : "";
  const validUntil = issueDate ? calculateValidUntil(issueDate, validityDays) : "";

  function invalidateApproval() {
    setCommercialApproved(false);
  }

  function updateProfile(key: keyof ProposalProfile, value: string) {
    setProfile((current) => ({ ...current, [key]: value }));
    invalidateApproval();
  }

  function storeVersion() {
    if (!proposalNumber || !issueDate || !validUntil) return;
    const next = saveProposalVersion({ proposalNumber, issueDate, validUntil, packageId, profile, basePriceIdr, discountPercentage, taxPercentage, approved: commercialApproved });
    setHistory(next);
    setVersionMessage(`Versi ${next[0].version} tersimpan di tab ini.`);
  }

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
            onClick={() => { setPackageId(item.id); setBasePriceIdr(item.indicativePriceIdr); invalidateApproval(); }}
          >
            <span>{item.name}</span>
            <strong>{rupiah.format(item.indicativePriceIdr)}</strong>
          </button>
        ))}
      </aside>

      <section className={styles.editor}>
        <div>
          <h2>Profil dan dokumen</h2>
          <label>Nama organisasi<input value={profile.organizationName} onChange={(event) => updateProfile("organizationName", event.target.value)} /></label>
          <label>Nama penerima<input value={profile.recipientName} onChange={(event) => updateProfile("recipientName", event.target.value)} /></label>
          <label>Jabatan penerima<input value={profile.recipientRole} onChange={(event) => updateProfile("recipientRole", event.target.value)} /></label>
          <label>Email penerima<input type="email" value={profile.recipientEmail} onChange={(event) => updateProfile("recipientEmail", event.target.value)} /></label>
          <div className={styles.inlineFields}>
            <label>Tanggal proposal<input type="date" value={issueDate} onChange={(event) => { setIssueDate(event.target.value); invalidateApproval(); }} /></label>
            <label>Berlaku (hari)<input type="number" min="1" max="90" value={validityDays} onChange={(event) => { setValidityDays(Math.min(90, Math.max(1, Number(event.target.value) || 1))); invalidateApproval(); }} /></label>
          </div>
        </div>
        <div>
          <h2>Nilai komersial</h2>
          <label>Harga dasar<input type="number" min="0" step="100000" value={basePriceIdr} onChange={(event) => { setBasePriceIdr(Number(event.target.value)); invalidateApproval(); }} /></label>
          <div className={styles.inlineFields}>
            <label>Diskon (%)<input type="number" min="0" max="30" value={discountPercentage} onChange={(event) => { setDiscountPercentage(Math.min(30, Math.max(0, Number(event.target.value)))); invalidateApproval(); }} /></label>
            <label>Pajak (%)<input type="number" min="0" max="20" value={taxPercentage} onChange={(event) => { setTaxPercentage(Math.min(20, Math.max(0, Number(event.target.value)))); invalidateApproval(); }} /></label>
          </div>
          <dl className={styles.calculation}>
            <div><dt>Diskon</dt><dd>{rupiah.format(terms.discountAmountIdr)}</dd></div>
            <div><dt>Pajak</dt><dd>{rupiah.format(terms.taxAmountIdr)}</dd></div>
            <div><dt>Total</dt><dd>{rupiah.format(terms.totalIdr)}</dd></div>
          </dl>
        </div>
        <div className={styles.versionBox}>
          <h2>Version history</h2>
          <button type="button" onClick={storeVersion}>Simpan versi sekarang</button>
          <p>{versionMessage}</p>
          <ol>{history.map((item) => <li key={`${item.version}-${item.savedAt}`}><strong>v{item.version}</strong><span>{item.approved ? "Approved preview" : "Draft"}</span><small>{new Date(item.savedAt).toLocaleString("id-ID")}</small></li>)}</ol>
        </div>
      </section>

      <article className={styles.document}>
        <section className={styles.cover}>
          <div className={styles.logo}>QIRA<span>.</span></div>
          <p>Proposal solusi · {proposal.version}</p>
          <h1>{proposal.package.name}</h1>
          <h2>{service?.name}</h2>
          <div className={styles.clientMeta}>
            <span>{profile.organizationName || "Nama calon klien"}</span>
            <span>Kepada: {profile.recipientName || "Penerima proposal"}{profile.recipientRole ? ` · ${profile.recipientRole}` : ""}</span>
            <span>{proposalNumber} · berlaku sampai {validUntil || "—"}</span>
          </div>
          <div className={styles.coverMeta}>
            <span>Harga indikatif</span>
            <strong>{rupiah.format(terms.totalIdr)}</strong>
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
          <h2>{rupiah.format(terms.totalIdr)}</h2>
          <div className={styles.payments}>
            {terms.paymentTerms.map((term) => (
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
