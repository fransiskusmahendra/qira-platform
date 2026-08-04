import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { calculateCommercialTerms } from "@qira/domain";
import type { Json } from "../../../../lib/supabase/database.types";
import { createClient } from "../../../../lib/supabase/server";
import styles from "../../../workspace/workspace.module.css";
import { decideProposal } from "./actions";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
function terms(value: Json) {
  if (!value || Array.isArray(value) || typeof value !== "object") notFound();
  const item = value as Record<string, Json | undefined>;
  return calculateCommercialTerms({ basePriceIdr: Number(item.basePriceIdr), discountPercent: Number(item.discountPercent), taxPercent: Number(item.taxPercent), downPaymentPercent: Number(item.downPaymentPercent) });
}

export default async function ClientProposalPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) redirect("/login");
  const { data: proposal } = await supabase.from("proposals").select("id, proposal_number, client_name, recipient_name, issue_date, valid_until, status, version, commercial_terms").eq("id", id).eq("status", "shared").maybeSingle();
  if (!proposal) notFound();
  const { data: decision } = await (supabase as any).from("proposal_client_decisions").select("decision,comment,decided_at").eq("proposal_id", id).eq("proposal_version", proposal.version).maybeSingle();
  const commercial = terms(proposal.commercial_terms);

  return <main className={styles.page}>
    <header className={styles.header}><Link className={styles.brand} href="/client">QIRA.</Link><Link href="/client">Kembali</Link></header>
    {query.saved === "1" && <p className={styles.success}>Keputusan Anda sudah tersimpan dan dapat dilihat tim QIRA.</p>}
    {query.error && <p className={styles.alert}>Keputusan belum dapat disimpan. Pastikan proposal masih aktif dan komentar revisi sudah diisi.</p>}
    <section className={styles.detailHero}><div><p className={styles.kicker}>{proposal.proposal_number}</p><h1>{proposal.client_name}</h1><p>Untuk {proposal.recipient_name} · versi {proposal.version}</p></div><div><span className={styles.status}>Shared</span><a className={styles.primaryAction} href={`/client/proposals/${proposal.id}/export`}>Download PDF</a></div></section>
    <section className={styles.grid}><article><span>Total approved</span><strong>{rupiah.format(commercial.totalIdr)}</strong></article><article><span>DP {commercial.downPaymentPercent}%</span><strong>{rupiah.format(commercial.downPaymentAmountIdr)}</strong></article><article><span>Berlaku sampai</span><strong>{proposal.valid_until}</strong></article></section>
    <section className={styles.panel}><p className={styles.kicker}>Commercial terms</p><div className={styles.metricRow}><span>Harga dasar</span><strong>{rupiah.format(commercial.basePriceIdr)}</strong></div><div className={styles.metricRow}><span>Diskon</span><strong>{commercial.discountPercent}%</strong></div><div className={styles.metricRow}><span>Pajak</span><strong>{commercial.taxPercent}%</strong></div><p>Hubungi QIRA jika terdapat pertanyaan atau perubahan kebutuhan. Materi internal, prompt, margin, dan draft tidak ditampilkan di Client Workspace.</p></section>
    <section className={styles.panel}><p className={styles.kicker}>Client decision</p><h2>Konfirmasi proposal</h2>{decision ? <div><p><strong>{decision.decision === "accepted" ? "Proposal diterima" : "Revisi diminta"}</strong> · {new Date(decision.decided_at).toLocaleString("id-ID")}</p>{decision.comment && <p>{decision.comment}</p>}<small>Keputusan untuk versi ini bersifat final dan tidak dapat diubah.</small></div> : <div className={styles.detailGrid}><form action={decideProposal}><input name="proposal_id" type="hidden" value={proposal.id} /><input name="decision" type="hidden" value="accepted" /><p>Saya menyetujui ruang lingkup dan ketentuan komersial proposal ini.</p><button className={styles.primaryAction} type="submit">Terima proposal</button></form><form action={decideProposal} className={styles.proposalForm}><input name="proposal_id" type="hidden" value={proposal.id} /><input name="decision" type="hidden" value="revision_requested" /><label>Catatan revisi<textarea name="comment" required rows={4} placeholder="Jelaskan bagian yang perlu disesuaikan" /></label><button type="submit">Minta revisi</button></form></div>}</section>
  </main>;
}
