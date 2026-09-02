import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "../../../../lib/supabase/server";
import { transitionDiscovery } from "../actions";
import styles from "../../workspace.module.css";
import { downloadEvidence, recordEvidenceScan, uploadEvidence } from "./evidence-actions";

export default async function DiscoveryDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string; scan?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) redirect("/login");

  const [{ data: discovery }, { data: memberships }, { data: auditEvents }, { data: evidence }] = await Promise.all([
    supabase.from("discoveries").select("*").eq("id", id).maybeSingle(),
    supabase.from("memberships").select("role").eq("status", "active"),
    supabase.from("audit_events").select("action, reason, occurred_at").eq("resource_id", id).order("occurred_at", { ascending: false }),
    (supabase as any).from("evidence").select("id, original_name, size_bytes, scan_status, checksum_sha256, scan_provider, scan_reference, scanned_at").eq("discovery_id", id),
  ]);
  if (!discovery) notFound();

  const canReview = memberships?.some(({ role }) => role === "qira_admin" || role === "qira_consultant");
  const canRecordScan = memberships?.some(({ role }) => role === "qira_admin");
  const responses = discovery.responses && typeof discovery.responses === "object" && !Array.isArray(discovery.responses) ? discovery.responses : {};
  const visibleResponses = Object.entries(responses).filter(([key]) => !key.startsWith("_"));
  const cleanEvidence = evidence?.filter((item: any) => item.scan_status === "clean").length ?? 0;

  return <main className={styles.page}>
    <header className={styles.header}><div><Link className={styles.brand} href="/workspace">QIRA.</Link><p>Discovery</p></div><Link href="/workspace">Kembali</Link></header>
    {query.error?.startsWith("scan") && <p className={styles.alert}>Evidence belum dapat digunakan.</p>}
    {query.scan && <p className={styles.success}>Hasil pemeriksaan evidence tersimpan: {query.scan}.</p>}

    <section className={styles.detailHero}><div><p className={styles.kicker}>Discovery v{discovery.version}</p><h1>{discovery.service_ids.join(", ")}</h1><p>{visibleResponses.length} jawaban · {evidence?.length ?? 0} evidence</p></div><span className={styles.status}>{discovery.status}</span></section>

    {canReview && discovery.status === "submitted" && <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Keputusan</p><h2>Sudah cukup jelas?</h2></div></div><div className={styles.panelActions}><form action={transitionDiscovery}><input type="hidden" name="discovery_id" value={id}/><input type="hidden" name="target_status" value="approved"/><button className={styles.primaryAction} type="submit">Setujui</button></form><details><summary>Kembalikan</summary><form action={transitionDiscovery}><input type="hidden" name="discovery_id" value={id}/><input type="hidden" name="target_status" value="draft"/><label>Alasan <input name="reason" required/></label><button type="submit">Kembalikan ke draft</button></form></details></div></section>}

    {canReview && discovery.status === "approved" && <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Berikutnya</p><h2>Discovery disetujui.</h2></div><Link className={styles.primaryAction} href={`/workspace/proposals/new?discovery_id=${id}`}>Buat proposal</Link></div></section>}

    <details className={styles.panel} open={discovery.status === "submitted"}><summary>Jawaban Discovery ({visibleResponses.length})</summary>{visibleResponses.map(([key, value]) => <div className={styles.row} key={key}><strong>{key}</strong><span>{String(value)}</span><span>✓</span></div>)}</details>

    <details className={styles.panel}><summary>Skor & evidence ({cleanEvidence} clean)</summary><pre>{JSON.stringify(discovery.scores, null, 2)}</pre><h2>Evidence privat</h2><form action={uploadEvidence}><input type="hidden" name="discovery_id" value={id}/><input name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.txt" required/><button type="submit">Upload</button></form>{evidence?.map((e: any) => <div className={styles.attentionRow} key={e.id}><div><strong>{e.original_name}</strong><p>{Math.ceil(e.size_bytes / 1024)} KB · {e.scan_status}</p></div>{e.scan_status === "clean" && <form action={downloadEvidence}><input type="hidden" name="evidence_id" value={e.id}/><input type="hidden" name="discovery_id" value={id}/><button>Download</button></form>}{canRecordScan && e.scan_status !== "clean" && <form action={recordEvidenceScan}><input type="hidden" name="evidence_id" value={e.id}/><input type="hidden" name="discovery_id" value={id}/><select name="scan_status" required><option value="clean">Clean</option><option value="quarantined">Quarantined</option><option value="failed">Scan gagal</option></select><input name="scan_provider" placeholder="Penyedia scan" required/><input name="scan_reference" placeholder="Referensi" required/><button>Catat</button></form>}</div>)}</details>

    <details className={styles.panel}><summary>Audit ({auditEvents?.length ?? 0})</summary>{!auditEvents?.length && <p className={styles.empty}>Belum ada audit event.</p>}{auditEvents?.map((event) => <div className={styles.row} key={`${event.action}-${event.occurred_at}`}><strong>{event.action}</strong><span>{event.reason ?? "—"}</span><span>{new Date(event.occurred_at).toLocaleString("id-ID")}</span></div>)}</details>
  </main>;
}
