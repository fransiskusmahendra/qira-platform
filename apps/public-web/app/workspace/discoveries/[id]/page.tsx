import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "../../../../lib/supabase/server";
import { transitionDiscovery } from "../actions";
import styles from "../../workspace.module.css";
import { downloadEvidence, uploadEvidence } from "./evidence-actions";

export default async function DiscoveryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) redirect("/login");

  const [{ data: discovery }, { data: memberships }, { data: auditEvents }, { data: evidence }] = await Promise.all([
    supabase.from("discoveries").select("*").eq("id", id).maybeSingle(),
    supabase.from("memberships").select("role").eq("status", "active"),
    supabase.from("audit_events").select("action, reason, occurred_at").eq("resource_id", id).order("occurred_at", { ascending: false }),
    (supabase as any).from("evidence").select("id, original_name, size_bytes, scan_status, checksum_sha256").eq("discovery_id", id),
  ]);
  if (!discovery) notFound();
  const canReview = memberships?.some(({ role }) => role === "qira_admin" || role === "qira_consultant");
  const responses = discovery.responses && typeof discovery.responses === "object" && !Array.isArray(discovery.responses)
    ? discovery.responses
    : {};
  const visibleResponses = Object.entries(responses).filter(([key]) => !key.startsWith("_"));

  return <main className={styles.page}>
    <header className={styles.header}><div><span className={styles.brand}>QIRA.</span><p>Discovery review</p></div><Link href="/workspace">Kembali</Link></header>
    <section className={styles.hero}><p className={styles.kicker}>Versi {discovery.version}</p><h1>{discovery.service_ids.join(", ")}</h1><p>Status: <strong>{discovery.status}</strong></p></section>
    <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Jawaban</p><h2>Evidence terstruktur</h2></div></div>
      {visibleResponses.map(([key, value]) => <div className={styles.row} key={key}><strong>{key}</strong><span>{String(value)}</span><span>tersimpan</span></div>)}
    </section>
    <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Skor</p><h2>Ruleset deterministik</h2></div></div><pre>{JSON.stringify(discovery.scores, null, 2)}</pre></section>
    {canReview && discovery.status === "submitted" && <section className={styles.panel}>
      <div className={styles.panelHeading}><div><p className={styles.kicker}>Keputusan</p><h2>Review consultant</h2></div></div>
      <form action={transitionDiscovery}><input type="hidden" name="discovery_id" value={id}/><input type="hidden" name="target_status" value="approved"/><button className={styles.primaryAction} type="submit">Setujui Discovery</button></form>
      <form action={transitionDiscovery}><input type="hidden" name="discovery_id" value={id}/><input type="hidden" name="target_status" value="draft"/><label>Alasan dikembalikan <input name="reason" required/></label><button type="submit">Kembalikan ke draft</button></form>
    </section>}
    {canReview && discovery.status === "approved" && <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Handoff</p><h2>Approved snapshot terkunci</h2></div><Link className={styles.primaryAction} href={`/workspace/proposals/new?discovery_id=${id}`}>Buat proposal</Link></div><p>Proposal baru akan menyimpan referensi ke Discovery dan versi snapshot yang disetujui.</p></section>}
    <section className={styles.panel}><h2>Evidence privat</h2><form action={uploadEvidence}><input type="hidden" name="discovery_id" value={id}/><input name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.txt" required/><button type="submit">Upload evidence</button></form>{evidence?.map((e:any)=><form action={downloadEvidence} className={styles.row} key={e.id}><input type="hidden" name="evidence_id" value={e.id}/><strong>{e.original_name}</strong><span>{Math.ceil(e.size_bytes/1024)} KB · {e.scan_status}</span><button>Download 60 detik</button></form>)}</section>
    <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Audit</p><h2>Riwayat keputusan</h2></div></div>
      {!auditEvents?.length && <p className={styles.empty}>Belum ada audit event yang dapat dilihat.</p>}
      {auditEvents?.map((event) => <div className={styles.row} key={`${event.action}-${event.occurred_at}`}><strong>{event.action}</strong><span>{event.reason ?? "—"}</span><span>{new Date(event.occurred_at).toLocaleString("id-ID")}</span></div>)}
    </section>
  </main>;
}
