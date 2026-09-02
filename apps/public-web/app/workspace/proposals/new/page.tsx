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

  return <main className={styles.page}>
    <header className={styles.header}><Link className={styles.brand} href="/workspace">QIRA.</Link><Link href="/workspace">Kembali</Link></header>
    <section className={styles.formHeader}><p className={styles.kicker}>Proposal</p><h1>Buat penawaran.</h1><p>Discovery → penerima → harga → simpan.</p></section>
    {error && <p className={styles.alert}>Belum berhasil disimpan. Periksa data lalu coba lagi.</p>}

    <form action={createProposal} className={styles.proposalForm}>
      <fieldset><legend>1. Sumber</legend><label>Discovery<select name="discovery_id" defaultValue={selectedDiscoveryId ?? ""} required><option value="" disabled>Pilih Discovery</option>{discoveries?.map((discovery) => <option value={discovery.id} key={discovery.id}>{discovery.service_ids.join(", ")} · v{discovery.version}</option>)}</select></label>{!discoveries?.length && <p>Belum ada Discovery yang disetujui.</p>}</fieldset>

      <fieldset><legend>2. Penerima</legend><label>Usaha<input name="client_name" required /></label><label>Nama<input name="recipient_name" required /></label><label>Email<input type="email" name="recipient_email" autoComplete="email" required /></label></fieldset>

      <fieldset><legend>3. Penawaran</legend><label>Paket<select name="package_id" defaultValue="digital-foundation">{PROPOSAL_PACKAGES.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><label>Harga dasar<input type="number" name="base_price" min="0" defaultValue="4900000" required /></label><label>DP %<input type="number" name="down_payment_percent" min="0" max="100" defaultValue="50" required /></label></fieldset>

      <details>
        <summary>Detail tambahan</summary>
        <fieldset><legend>Periode & perhitungan</legend><label>Tanggal terbit<input type="date" name="issue_date" defaultValue={issueDate.toISOString().slice(0, 10)} required /></label><label>Berlaku sampai<input type="date" name="valid_until" defaultValue={validUntil.toISOString().slice(0, 10)} required /></label><label>Diskon %<input type="number" name="discount_percent" min="0" max="100" defaultValue="0" required /></label><label>Pajak %<input type="number" name="tax_percent" min="0" max="100" defaultValue="0" required /></label></fieldset>
      </details>

      <button className={styles.primaryAction} type="submit" disabled={!discoveries?.length}>Simpan proposal</button>
    </form>
  </main>;
}
