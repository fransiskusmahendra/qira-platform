import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { calculateCommercialTerms } from "@qira/domain";
import type { Json } from "../../../../lib/supabase/database.types";
import { createClient } from "../../../../lib/supabase/server";
import { transitionProposal } from "../actions";
import styles from "../../workspace.module.css";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

interface ProposalPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
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
  const nextStatus = proposal.status === "draft" ? "review" : proposal.status === "review" ? "approved" : proposal.status === "approved" ? "shared" : undefined;
  const nextLabel = nextStatus === "review" ? "Ajukan review" : nextStatus === "approved" ? "Approve proposal" : nextStatus === "shared" ? "Tandai dibagikan" : undefined;

  return (
    <main className={styles.page}>
      <header className={styles.header}><Link className={styles.brand} href="/workspace">QIRA.</Link><Link href="/workspace">← Semua proposal</Link></header>
      {query.error && <p className={styles.alert}>Perubahan status ditolak. Muat ulang halaman dan periksa role Anda.</p>}
      <section className={styles.detailHero}><div><p className={styles.kicker}>{proposal.proposal_number}</p><h1>{proposal.client_name}</h1><p>Untuk {proposal.recipient_name} · berlaku sampai {proposal.valid_until}</p></div><span className={styles.status}>{proposal.status}</span></section>
      <section className={styles.grid}><article><span>Total proposal</span><strong>{rupiah.format(commercial.totalIdr)}</strong></article><article><span>DP {commercial.downPaymentPercent}%</span><strong>{rupiah.format(commercial.downPaymentAmountIdr)}</strong></article><article><span>Versi tersimpan</span><strong>{versions?.length ?? 0}</strong></article></section>
      <section className={styles.detailGrid}>
        <article className={styles.panel}><p className={styles.kicker}>Commercial breakdown</p><div className={styles.metricRow}><span>Harga dasar</span><strong>{rupiah.format(commercial.basePriceIdr)}</strong></div><div className={styles.metricRow}><span>Diskon</span><strong>− {rupiah.format(commercial.discountAmountIdr)}</strong></div><div className={styles.metricRow}><span>Pajak</span><strong>+ {rupiah.format(commercial.taxAmountIdr)}</strong></div>{nextStatus && <form action={transitionProposal}><input type="hidden" name="proposal_id" value={proposal.id} /><input type="hidden" name="target_status" value={nextStatus} /><button className={styles.primaryAction} type="submit">{nextLabel}</button></form>}</article>
        <article className={styles.panel}><p className={styles.kicker}>Audit timeline</p>{!events?.length && <p className={styles.empty}>Belum ada audit event.</p>}{events?.map((event) => <div className={styles.timelineRow} key={event.id}><strong>{event.action}</strong><time>{new Date(event.occurred_at).toLocaleString("id-ID")}</time></div>)}</article>
      </section>
      {(["approved", "shared"].includes(proposal.status)) && <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Approved export</p><h2>PDF proposal</h2></div><a className={styles.primaryAction} href={`/workspace/proposals/${proposal.id}/export`}>Download PDF</a></div><p>Setiap ekspor dicatat dengan checksum SHA-256 dan terikat pada versi approved.</p>{exports?.map((item) => <div className={styles.row} key={item.id}><strong>{new Date(item.generated_at).toLocaleString("id-ID")}</strong><span>{item.checksum_sha256.slice(0, 16)}...</span><span>PDF</span></div>)}</section>}
      <section className={styles.detailGrid}><article className={styles.panel}><p className={styles.kicker}>Client decisions</p><h2>Respons klien</h2>{!decisions?.length && <p className={styles.empty}>Belum ada keputusan klien.</p>}{decisions?.map((item: any) => <div className={styles.timelineRow} key={item.id}><div><strong>{item.decision}</strong>{item.comment && <p>{item.comment}</p>}</div><time>v{item.proposal_version} · {new Date(item.decided_at).toLocaleString("id-ID")}</time></div>)}</article><article className={styles.panel}><p className={styles.kicker}>Client activity</p><h2>Aktivitas proposal</h2>{!clientEvents?.length && <p className={styles.empty}>Belum ada aktivitas klien.</p>}{clientEvents?.map((item: any) => <div className={styles.timelineRow} key={item.id}><strong>PDF diunduh</strong><time>v{item.proposal_version} · {new Date(item.occurred_at).toLocaleString("id-ID")}</time></div>)}</article></section>
    </main>
  );
}
