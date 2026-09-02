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
  const { data: proposal } = await supabase.from("proposals").select("id, proposal_number, client_name, recipient_name, valid_until, status, version, commercial_terms").eq("id", id).eq("status", "shared").maybeSingle();
  if (!proposal) notFound();
  const { data: decision } = await (supabase as any).from("proposal_client_decisions").select("decision,comment,decided_at").eq("proposal_id", id).eq("proposal_version", proposal.version).maybeSingle();
  const commercial = terms(proposal.commercial_terms);

  return <main className={styles.page}>
    <header className={styles.header}><Link className={styles.brand} href="/client">QIRA.</Link><Link href="/client">Kembali</Link></header>
    {query.saved === "1" && <p className={styles.success}>Pilihan tersimpan.</p>}
    {query.error && <p className={styles.alert}>Belum berhasil disimpan. Coba lagi.</p>}

    <section className={styles.detailHero}><div><p className={styles.kicker}>{proposal.proposal_number}</p><h1>{proposal.client_name}</h1><p>{proposal.recipient_name}</p></div><div><a className={styles.primaryAction} href={`/client/proposals/${proposal.id}/export`}>PDF</a></div></section>

    <section className={styles.grid}>
      <article><span>Total</span><strong>{rupiah.format(commercial.totalIdr)}</strong></article>
      <article><span>DP {commercial.downPaymentPercent}%</span><strong>{rupiah.format(commercial.downPaymentAmountIdr)}</strong></article>
      <article><span>Berlaku sampai</span><strong>{proposal.valid_until}</strong></article>
    </section>

    <section className={styles.panel}><p className={styles.kicker}>Pilihan</p><h2>Sudah sesuai?</h2>
      {decision ? <div><p><strong>{decision.decision === "accepted" ? "Diterima" : "Perubahan diminta"}</strong></p>{decision.comment && <p>{decision.comment}</p>}</div>
      : <div className={styles.detailGrid}>
        <form action={decideProposal}><input name="proposal_id" type="hidden" value={proposal.id} /><input name="decision" type="hidden" value="accepted" /><button className={styles.primaryAction} type="submit">Terima</button></form>
        <form action={decideProposal} className={styles.proposalForm}><input name="proposal_id" type="hidden" value={proposal.id} /><input name="decision" type="hidden" value="revision_requested" /><label>Yang ingin diubah<textarea name="comment" required rows={3} /></label><button type="submit">Minta perubahan</button></form>
      </div>}
    </section>
  </main>;
}
