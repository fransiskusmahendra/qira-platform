import Link from "next/link";

import { PROPOSAL_PACKAGES } from "@qira/domain";
import { createClient } from "../../../../lib/supabase/server";
import { createProposal } from "../actions";
import styles from "../../workspace.module.css";

interface NewProposalPageProps {
  searchParams: Promise<{ error?: string; discovery_id?: string }>;
}

export default async function NewProposalPage({ searchParams }: NewProposalPageProps) {
  const { error, discovery_id: selectedDiscoveryId } = await searchParams;
  const supabase = await createClient();
  const { data: discoveries } = await supabase
    .from("discoveries")
    .select("id, service_ids, version, updated_at")
    .eq("status", "approved")
    .order("updated_at", { ascending: false });
  const issueDate = new Date();
  const validUntil = new Date(issueDate);
  validUntil.setDate(validUntil.getDate() + 30);

  return (
    <main className={styles.page}>
      <header className={styles.header}><Link className={styles.brand} href="/workspace">QIRA.</Link><Link href="/workspace">← Workspace</Link></header>
      <section className={styles.formHeader}><p className={styles.kicker}>Proposal database</p><h1>Buat proposal baru.</h1><p>Proposal, snapshot versi pertama, dan audit event akan disimpan secara atomik.</p></section>
      {error && <p className={styles.alert}>Proposal belum dapat disimpan. Periksa seluruh data dan hak akses Anda.</p>}
      <form action={createProposal} className={styles.proposalForm}>
        <fieldset><legend>Sumber yang disetujui</legend><label>Approved Discovery<select name="discovery_id" defaultValue={selectedDiscoveryId ?? ""} required><option value="" disabled>Pilih Discovery</option>{discoveries?.map((discovery) => <option value={discovery.id} key={discovery.id}>{discovery.service_ids.join(", ")} · versi {discovery.version}</option>)}</select></label>{!discoveries?.length && <p>Belum ada Discovery approved yang memiliki snapshot immutable.</p>}</fieldset>
        <fieldset><legend>Calon klien</legend><label>Nama organisasi<input name="client_name" required /></label><label>Nama penerima<input name="recipient_name" required /></label><label>Email penerima<input type="email" name="recipient_email" autoComplete="email" required /></label></fieldset>
        <fieldset><legend>Periode proposal</legend><label>Tanggal terbit<input type="date" name="issue_date" defaultValue={issueDate.toISOString().slice(0, 10)} required /></label><label>Berlaku sampai<input type="date" name="valid_until" defaultValue={validUntil.toISOString().slice(0, 10)} required /></label></fieldset>
        <fieldset><legend>Commercial terms</legend><label>Paket<select name="package_id" defaultValue="digital-foundation">{PROPOSAL_PACKAGES.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><label>Harga dasar<input type="number" name="base_price" min="0" defaultValue="4900000" required /></label><label>Diskon %<input type="number" name="discount_percent" min="0" max="100" defaultValue="0" required /></label><label>Pajak %<input type="number" name="tax_percent" min="0" max="100" defaultValue="0" required /></label><label>DP %<input type="number" name="down_payment_percent" min="0" max="100" defaultValue="50" required /></label></fieldset>
        <button className={styles.primaryAction} type="submit" disabled={!discoveries?.length}>Simpan proposal</button>
      </form>
    </main>
  );
}
