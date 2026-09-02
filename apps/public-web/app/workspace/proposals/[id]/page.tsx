import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { calculateCommercialTerms } from "@qira/domain";
import type { Json } from "../../../../lib/supabase/database.types";
import { createClient } from "../../../../lib/supabase/server";
import { createProposalRevision, transitionProposal } from "../actions";
import styles from "../../workspace.module.css";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

interface ProposalPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ email?: string; error?: string; revision?: string }>;
}

function parseTerms(value: Json) {
  if (!value || Array.isArray(value) || typeof value !== "object") notFound();
  const record = value as Record<string, Json | undefined>;
  return {
    basePriceIdr: Number(record.basePriceIdr),
    discountPercent: Number(record.discountPercent),
    taxPercent: Number(record.taxPercent),
    downPaymentPercent: Number(record.downPaymentPercent),
  };
}

export default async function ProposalPage({ params, searchParams }: ProposalPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) redirect("/login");

  const [{ data: proposal }, { data: versions }, { data: events }, { data: exports }, { data: decisions }, { data: clientEvents }] = await Promise.all([
    supabase.from("proposals").select("*").eq("id", id).maybeSingle(),
    supabase.from("proposal_versions").select("id, version, created_at").eq("proposal_id", id).order("version"),
    supabase.from("audit_events").select("id, action, occurred_at").eq("resource_id", id).order("occurred_at", { ascending: false }),
    supabase.from("proposal_exports").select("id, checksum_sha256, generated_at").eq("proposal_id", id).order("generated_at", { ascending: false }),
    (supabase as any).from("proposal_client_decisions").select("id,decision,comment,proposal_version,decided_at").eq("proposal_id", id).order("decided_at", { ascending: false }),
    (supabase as any).from("proposal_client_events").select("id,event_type,proposal_version,occurred_at").eq("proposal_id", id).order("occurred_at", { ascending: false }).limit(20),
  ]);
  if (!proposal) notFound();

  const commercial = calculateCommercialTerms(parseTerms(proposal.commercial_terms));
  const rawTerms = proposal.commercial_terms as Record<string, Json | undefined>;
  const revisionRequest = decisions?.find((item: any) => item.proposal_version === proposal.version && item.decision === "revision_requested");
  const latestDecision = decisions?.[0];
  const nextStatus = proposal.status === "draft" ? "review" : proposal.status === "review" ? "approved" : proposal.status === "approved" ? "shared" : undefined;
  const nextLabel = nextStatus === "review" ? "Ajukan review" : nextStatus === "approved" ? "Setujui" : nextStatus === "shared" ? "Bagikan" : undefined;

  return <main className={styles.page}>
    <header className={styles.header}><Link className={styles.brand} href="/workspace">QIRA.</Link><Link href="/workspace">Kembali</Link></header>
    {query.error && <p className={styles.alert}>Aksi belum berhasil. Muat ulang lalu coba lagi.</p>}
    {query.email === "sent" && <p className={styles.success}>Proposal dibagikan dan email terkirim.</p>}
    {query.email === "failed" && <p className={styles.alert}>Proposal dibagikan, tetapi email belum terkirim.</p>}
    {query.revision === "1" && <p className={styles.success}>Draft revisi berhasil dibuat.</p>}

    <section className={styles.detailHero}>
      <div><p className={styles.kicker}>{proposal.proposal_number}</p><h1>{proposal.client_name}</h1><p>{proposal.recipient_name} · s.d. {proposal.valid_until}</p></div>
      <span className={styles.status}>{proposal.status}</span>
    </section>

    <section className={styles.grid}>
      <article><span>Total</span><strong>{rupiah.format(commercial.totalIdr)}</strong></article>
      <article><span>DP {commercial.downPaymentPercent}%</span><strong>{rupiah.format(commercial.downPaymentAmountIdr)}</strong></article>
      <article><span>Versi</span><strong>{proposal.version}</strong></article>
    </section>

    <section className={styles.panel}>
      <div className={styles.panelHeading}><div><p className={styles.kicker}>Berikutnya</p><h2>{revisionRequest ? "Revisi diminta klien" : nextLabel ?? (latestDecision?.decision === "accepted" ? "Diterima klien" : "Tidak ada aksi utama")}</h2></div>{(["approved", "shared"].includes(proposal.status)) && <a className={styles.primaryAction} href={`/workspace/proposals/${proposal.id}/export`}>PDF</a>}</div>
      {revisionRequest && <p>{revisionRequest.comment}</p>}
      {nextStatus && !revisionRequest && <form action={transitionProposal}><input type="hidden" name="proposal_id" value={proposal.id}/><input type="hidden" name="target_status" value={nextStatus}/><button className={styles.primaryAction} type="submit">{nextLabel}</button></form>}
    </section>

    {proposal.status === "shared" && revisionRequest && <section className={styles.panel}><p className={styles.kicker}>Revisi</p><h2>Buat versi {proposal.version + 1}</h2><form action={createProposalRevision} className={styles.proposalForm}><input name="proposal_id" type="hidden" value={proposal.id}/><input name="package_id" type="hidden" value={String(rawTerms.packageId ?? "custom")}/><fieldset><legend>Ketentuan baru</legend><label>Harga dasar<input name="base_price" type="number" min="0" defaultValue={commercial.basePriceIdr} required/></label><label>DP (%)<input name="down_payment_percent" type="number" min="0" max="100" defaultValue={commercial.downPaymentPercent} required/></label><label>Berlaku sampai<input name="valid_until" type="date" defaultValue={proposal.valid_until} required/></label></fieldset><details><summary>Diskon & pajak</summary><fieldset><label>Diskon (%)<input name="discount_percent" type="number" min="0" max="100" defaultValue={commercial.discountPercent} required/></label><label>Pajak (%)<input name="tax_percent" type="number" min="0" max="100" defaultValue={commercial.taxPercent} required/></label></fieldset></details><button className={styles.primaryAction} type="submit">Buat draft revisi</button></form></section>}

    <details className={styles.panel}><summary>Detail harga & riwayat</summary><div className={styles.detailGrid}><article><div className={styles.metricRow}><span>Harga dasar</span><strong>{rupiah.format(commercial.basePriceIdr)}</strong></div><div className={styles.metricRow}><span>Diskon</span><strong>− {rupiah.format(commercial.discountAmountIdr)}</strong></div><div className={styles.metricRow}><span>Pajak</span><strong>+ {rupiah.format(commercial.taxAmountIdr)}</strong></div></article><article><p>Versi tersimpan: {versions?.length ?? 0}</p><p>Ekspor PDF: {exports?.length ?? 0}</p><p>Aktivitas klien: {clientEvents?.length ?? 0}</p></article></div></details>

    <details className={styles.panel}><summary>Keputusan & audit</summary>{!decisions?.length && !events?.length && <p className={styles.empty}>Belum ada riwayat.</p>}{decisions?.map((item: any) => <div className={styles.timelineRow} key={item.id}><div><strong>{item.decision}</strong>{item.comment && <p>{item.comment}</p>}</div><time>v{item.proposal_version} · {new Date(item.decided_at).toLocaleString("id-ID")}</time></div>)}{events?.map((event) => <div className={styles.timelineRow} key={event.id}><strong>{event.action}</strong><time>{new Date(event.occurred_at).toLocaleString("id-ID")}</time></div>)}</details>
  </main>;
}
