"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  calculateCommercialTerms,
  createProposalPreview,
  findService,
  PROPOSAL_PACKAGES,
} from "@qira/domain";
import { readDiscoveryDraft, type DiscoveryPreviewDraft } from "../_lib/draft";
import {
  addProposalVersion,
  createProposalWorkspace,
  readProposalWorkspace,
  writeProposalWorkspace,
  type ClientProfile,
  type ProposalSettings,
  type ProposalWorkspace,
} from "./_lib/proposal-draft";
import styles from "./proposal.module.css";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export function ProposalPreview() {
  const [draft, setDraft] = useState<DiscoveryPreviewDraft>();
  const [workspace, setWorkspace] = useState<ProposalWorkspace>();
  const [loaded, setLoaded] = useState(false);
  const [commercialApproved, setCommercialApproved] = useState(false);

  useEffect(() => {
    const issueDate = new Date();
    const validUntil = new Date(issueDate);
    validUntil.setDate(validUntil.getDate() + 30);
    const today = issueDate.toISOString().slice(0, 10);
    setDraft(readDiscoveryDraft());
    setWorkspace(readProposalWorkspace() ?? createProposalWorkspace(today, validUntil.toISOString().slice(0, 10)));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (workspace) writeProposalWorkspace(workspace);
  }, [workspace]);

  const proposal = useMemo(() => {
    if (!draft || !workspace) return undefined;
    return createProposalPreview({
      serviceId: draft.serviceId,
      packageId: workspace.currentSettings.packageId,
      objective: String(draft.answers.business_goal ?? ""),
    });
  }, [draft, workspace]);

  const commercial = useMemo(() => workspace ? calculateCommercialTerms(workspace.currentSettings) : undefined, [workspace]);

  function updateClient(field: keyof ClientProfile, value: string) {
    setCommercialApproved(false);
    setWorkspace((current) => current && { ...current, currentClient: { ...current.currentClient, [field]: value } });
  }

  function updateSetting<K extends keyof ProposalSettings>(field: K, value: ProposalSettings[K]) {
    setCommercialApproved(false);
    setWorkspace((current) => current && { ...current, currentSettings: { ...current.currentSettings, [field]: value } });
  }

  function updateNumberSetting(field: "basePriceIdr" | "discountPercent" | "taxPercent" | "downPaymentPercent", rawValue: string) {
    const maximum = field === "basePriceIdr" ? Number.MAX_SAFE_INTEGER : 100;
    const parsed = Number(rawValue);
    updateSetting(field, Math.min(maximum, Math.max(0, Number.isFinite(parsed) ? parsed : 0)));
  }

  function selectPackage(packageId: ProposalSettings["packageId"]) {
    const selected = PROPOSAL_PACKAGES.find((item) => item.id === packageId);
    if (!selected) return;
    setCommercialApproved(false);
    setWorkspace((current) => current && {
      ...current,
      currentSettings: { ...current.currentSettings, packageId, basePriceIdr: selected.indicativePriceIdr },
    });
  }

  function saveVersion() {
    setWorkspace((current) => current ? addProposalVersion(current) : current);
  }

  if (!loaded) return <main className={styles.empty}>Memuat proposal preview…</main>;
  if (!draft || !proposal || !workspace || !commercial) {
    return <main className={styles.empty}><h1>Discovery belum tersedia.</h1><Link href="/discovery">Mulai Discovery</Link></main>;
  }

  const service = findService(draft.serviceId);
  const profileComplete = Boolean(workspace.currentClient.organizationName.trim() && workspace.currentClient.recipientName.trim());
  const printable = commercialApproved && profileComplete;

  return (
    <main className={styles.page}>
      <header className={styles.toolbar}>
        <Link href="/discovery/review">← Kembali ke review</Link>
        <span>Proposal preview · versi tersimpan {workspace.versions.length}</span>
        <div className={styles.toolbarActions}>
          <button type="button" onClick={saveVersion}>Simpan versi</button>
          <button type="button" disabled={!printable} onClick={() => window.print()}>Cetak preview</button>
        </div>
      </header>

      <section className={styles.editor}>
        <div>
          <h2>Profil calon klien</h2>
          <label>Nama organisasi<input value={workspace.currentClient.organizationName} onChange={(e) => updateClient("organizationName", e.target.value)} /></label>
          <label>Nama penerima<input value={workspace.currentClient.recipientName} onChange={(e) => updateClient("recipientName", e.target.value)} /></label>
          <label>Jabatan<input value={workspace.currentClient.recipientTitle} onChange={(e) => updateClient("recipientTitle", e.target.value)} /></label>
          <label>Email<input type="email" value={workspace.currentClient.email} onChange={(e) => updateClient("email", e.target.value)} /></label>
        </div>
        <div>
          <h2>Metadata proposal</h2>
          <label>Nomor proposal<input value={workspace.currentSettings.proposalNumber} onChange={(e) => updateSetting("proposalNumber", e.target.value)} /></label>
          <label>Tanggal terbit<input type="date" value={workspace.currentSettings.issueDate} onChange={(e) => updateSetting("issueDate", e.target.value)} /></label>
          <label>Berlaku sampai<input type="date" value={workspace.currentSettings.validUntil} onChange={(e) => updateSetting("validUntil", e.target.value)} /></label>
        </div>
        <div>
          <h2>Commercial terms</h2>
          <label>Harga dasar<input type="number" min="0" value={workspace.currentSettings.basePriceIdr} onChange={(e) => updateNumberSetting("basePriceIdr", e.target.value)} /></label>
          <label>Diskon %<input type="number" min="0" max="100" value={workspace.currentSettings.discountPercent} onChange={(e) => updateNumberSetting("discountPercent", e.target.value)} /></label>
          <label>Pajak %<input type="number" min="0" max="100" value={workspace.currentSettings.taxPercent} onChange={(e) => updateNumberSetting("taxPercent", e.target.value)} /></label>
          <label>DP %<input type="number" min="0" max="100" value={workspace.currentSettings.downPaymentPercent} onChange={(e) => updateNumberSetting("downPaymentPercent", e.target.value)} /></label>
        </div>
      </section>

      <aside className={styles.packagePicker} aria-label="Pilih paket indikatif">
        {PROPOSAL_PACKAGES.map((item) => (
          <button type="button" key={item.id} aria-pressed={workspace.currentSettings.packageId === item.id} className={workspace.currentSettings.packageId === item.id ? styles.activePackage : ""} onClick={() => selectPackage(item.id)}>
            <span>{item.name}</span><strong>{rupiah.format(item.indicativePriceIdr)}</strong>
          </button>
        ))}
      </aside>

      <article className={styles.document}>
        <section className={styles.cover}>
          <div className={styles.logo}>QIRA<span>.</span></div>
          <p>{workspace.currentSettings.proposalNumber} · {workspace.currentSettings.issueDate}</p>
          <h1>{proposal.package.name}</h1>
          <h2>{service?.name}</h2>
          <div className={styles.clientMeta}>
            <span>Disiapkan untuk</span>
            <strong>{workspace.currentClient.organizationName || "Nama calon klien"}</strong>
            <small>{workspace.currentClient.recipientName || "Nama penerima"}{workspace.currentClient.recipientTitle ? ` · ${workspace.currentClient.recipientTitle}` : ""}</small>
          </div>
          <div className={styles.coverMeta}><span>Total indikatif</span><strong>{rupiah.format(commercial.totalIdr)}</strong><small>Berlaku sampai {workspace.currentSettings.validUntil}</small></div>
        </section>

        <section className={styles.section}><p className={styles.kicker}>01 · Tujuan</p><h2>Hasil yang ingin dicapai</h2><p className={styles.lead}>{proposal.objective}</p></section>
        <section className={styles.section}><p className={styles.kicker}>02 · Scope dan deliverables</p><h2>Apa yang akan dikerjakan</h2><ul className={styles.cards}>{proposal.scope.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section className={styles.section}><p className={styles.kicker}>03 · Rencana implementasi</p><h2>{proposal.package.durationWeeks[0]}–{proposal.package.durationWeeks[1]} minggu</h2><div className={styles.timeline}><div><strong>1</strong><span>Konfirmasi scope</span></div><div><strong>2</strong><span>Build dan validasi</span></div><div><strong>3</strong><span>Implementasi dan handover</span></div></div></section>
        <section className={styles.section}>
          <p className={styles.kicker}>04 · Investasi</p><h2>{rupiah.format(commercial.totalIdr)}</h2>
          <div className={styles.commercialBreakdown}><span>Harga dasar <b>{rupiah.format(commercial.basePriceIdr)}</b></span><span>Diskon <b>− {rupiah.format(commercial.discountAmountIdr)}</b></span><span>Pajak <b>+ {rupiah.format(commercial.taxAmountIdr)}</b></span></div>
          <div className={styles.payments}><div><span>DP · {commercial.downPaymentPercent}%</span><strong>{rupiah.format(commercial.downPaymentAmountIdr)}</strong></div><div><span>Pelunasan · {commercial.finalPaymentPercent}%</span><strong>{rupiah.format(commercial.finalPaymentAmountIdr)}</strong></div></div>
          <p className={styles.disclaimer}>Simulasi indikatif dan belum menjadi penawaran mengikat.</p>
        </section>
        <section className={styles.threeColumns}><div><h3>Asumsi</h3><ul>{proposal.assumptions.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3>Risiko</h3><ul>{proposal.risks.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3>Di luar scope</h3><ul>{proposal.exclusions.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
        <section className={styles.approval}>
          <label><input type="checkbox" checked={commercialApproved} onChange={(e) => setCommercialApproved(e.target.checked)} /><span>Saya menyimulasikan approval Founder QIRA atas profil klien, harga, diskon, pajak, dan termin ini.</span></label>
          <p>{printable ? "Preview siap dicetak untuk review internal." : "Lengkapi organisasi dan penerima, lalu berikan approval komersial preview."}</p>
        </section>
      </article>

      <section className={styles.history}>
        <h2>Version history lokal</h2>
        {workspace.versions.length === 0 ? <p>Belum ada versi tersimpan.</p> : [...workspace.versions].reverse().map((version) => <div key={version.version}><strong>Versi {version.version}</strong><span>{version.client.organizationName || "Tanpa nama klien"}</span><span>{rupiah.format(calculateCommercialTerms(version.settings).totalIdr)}</span><time>{new Date(version.savedAt).toLocaleString("id-ID")}</time></div>)}
      </section>
    </main>
  );
}
