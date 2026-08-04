import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { calculateCommercialTerms } from "@qira/domain";
import type { Json } from "../../../../lib/supabase/database.types";
import { createClient } from "../../../../lib/supabase/server";
import styles from "../../../workspace/workspace.module.css";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
function terms(value: Json) {
  if (!value || Array.isArray(value) || typeof value !== "object") notFound();
  const item = value as Record<string, Json | undefined>;
  return calculateCommercialTerms({ basePriceIdr: Number(item.basePriceIdr), discountPercent: Number(item.discountPercent), taxPercent: Number(item.taxPercent), downPaymentPercent: Number(item.downPaymentPercent) });
}

export default async function ClientProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) redirect("/login");
  const { data: proposal } = await supabase.from("proposals").select("id, proposal_number, client_name, recipient_name, issue_date, valid_until, status, version, commercial_terms").eq("id", id).eq("status", "shared").maybeSingle();
  if (!proposal) notFound();
  const commercial = terms(proposal.commercial_terms);

  return <main className={styles.page}>
    <header className={styles.header}><Link className={styles.brand} href="/client">QIRA.</Link><Link href="/client">Kembali</Link></header>
    <section className={styles.detailHero}><div><p className={styles.kicker}>{proposal.proposal_number}</p><h1>{proposal.client_name}</h1><p>Untuk {proposal.recipient_name} · versi {proposal.version}</p></div><div><span className={styles.status}>Shared</span><a className={styles.primaryAction} href={`/client/proposals/${proposal.id}/export`}>Download PDF</a></div></section>
    <section className={styles.grid}><article><span>Total approved</span><strong>{rupiah.format(commercial.totalIdr)}</strong></article><article><span>DP {commercial.downPaymentPercent}%</span><strong>{rupiah.format(commercial.downPaymentAmountIdr)}</strong></article><article><span>Berlaku sampai</span><strong>{proposal.valid_until}</strong></article></section>
    <section className={styles.panel}><p className={styles.kicker}>Commercial terms</p><div className={styles.metricRow}><span>Harga dasar</span><strong>{rupiah.format(commercial.basePriceIdr)}</strong></div><div className={styles.metricRow}><span>Diskon</span><strong>{commercial.discountPercent}%</strong></div><div className={styles.metricRow}><span>Pajak</span><strong>{commercial.taxPercent}%</strong></div><p>Hubungi QIRA jika terdapat pertanyaan atau perubahan kebutuhan. Materi internal, prompt, margin, dan draft tidak ditampilkan di Client Workspace.</p></section>
  </main>;
}
