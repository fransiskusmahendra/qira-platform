import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "../../../lib/supabase/server";
import styles from "../workspace.module.css";

const EVENT_LABELS = [
  ["landing_view", "Beranda"],
  ["story_start", "Mulai cerita"],
  ["story_complete", "Cerita selesai"],
  ["discovery_start", "Masuk Discovery"],
  ["discovery_submit", "Discovery terkirim"],
] as const;

function percent(value: number, total: number) {
  return total ? `${Math.round((value / total) * 100)}%` : "—";
}

export default async function ConversionAnalyticsPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect("/login?next=/workspace/analytics");

  const { data: memberships } = await supabase.from("memberships").select("organization_id, role").eq("status", "active");
  const canView = memberships?.some((item) => item.role === "qira_admin" || item.role === "qira_consultant");
  if (!canView) redirect("/client");

  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceIso = since.toISOString();

  const [{ data: events }, { data: discoveries }, { data: proposals }, { data: decisions }] = await Promise.all([
    (supabase as any).from("conversion_events").select("event_name,occurred_at").gte("occurred_at", sinceIso).order("occurred_at", { ascending: false }),
    supabase.from("discoveries").select("id,status,created_at").gte("created_at", sinceIso),
    supabase.from("proposals").select("id,status,created_at").gte("created_at", sinceIso),
    (supabase as any).from("proposal_client_decisions").select("decision,decided_at").gte("decided_at", sinceIso),
  ]);

  const eventCount = (name: string) => events?.filter((item: any) => item.event_name === name).length ?? 0;
  const landing = eventCount("landing_view");
  const storyStart = eventCount("story_start");
  const storyComplete = eventCount("story_complete");
  const discoveryStart = eventCount("discovery_start");
  const discoverySubmit = eventCount("discovery_submit");
  const proposalCreated = proposals?.length ?? 0;
  const proposalShared = proposals?.filter((item) => item.status === "shared").length ?? 0;
  const accepted = decisions?.filter((item: any) => item.decision === "accepted").length ?? 0;
  const persistedDiscoveries = discoveries?.filter((item) => item.status === "submitted" || item.status === "approved").length ?? 0;

  const counts: Record<string, number> = {
    landing_view: landing,
    story_start: storyStart,
    story_complete: storyComplete,
    discovery_start: discoveryStart,
    discovery_submit: discoverySubmit,
  };

  return <main className={styles.page}>
    <header className={styles.header}><div><Link className={styles.brand} href="/workspace">QIRA.</Link><p>Analytics</p></div><Link href="/workspace">Kembali</Link></header>
    <section className={styles.hero}><p className={styles.kicker}>30 hari</p><h1>Apakah alurnya bekerja?</h1><p>Lihat titik yang paling banyak kehilangan calon pelanggan.</p></section>

    <section className={styles.grid}>
      <article><span>Pengunjung → mulai cerita</span><strong>{percent(storyStart, landing)}</strong><small>{landing} → {storyStart}</small></article>
      <article><span>Mulai → cerita selesai</span><strong>{percent(storyComplete, storyStart)}</strong><small>{storyStart} → {storyComplete}</small></article>
      <article><span>Discovery → proposal</span><strong>{percent(proposalCreated, persistedDiscoveries)}</strong><small>{persistedDiscoveries} → {proposalCreated}</small></article>
      <article><span>Shared → diterima</span><strong>{percent(accepted, proposalShared)}</strong><small>{proposalShared} → {accepted}</small></article>
    </section>

    <details className={styles.panel}><summary>Funnel website lengkap</summary><div className={styles.grid}>{EVENT_LABELS.map(([event, label], index) => { const previous = index === 0 ? 0 : counts[EVENT_LABELS[index - 1][0]]; return <article key={event}><span>{label}</span><strong>{counts[event]}</strong><small>{index === 0 ? "Sesi beranda" : `${percent(counts[event], previous)} dari tahap sebelumnya`}</small></article>; })}</div></details>

    <details className={styles.panel}><summary>CRM & proposal</summary><div className={styles.grid}><article><span>Discovery tersimpan</span><strong>{persistedDiscoveries}</strong></article><article><span>Proposal dibuat</span><strong>{proposalCreated}</strong></article><article><span>Proposal dibagikan</span><strong>{proposalShared}</strong></article><article><span>Proposal diterima</span><strong>{accepted}</strong></article></div></details>

    <section className={styles.panel}><p className={styles.kicker}>Cara baca</p><p className={styles.empty}>Angka terendah menunjukkan bagian pertama yang perlu diperbaiki. Ubah satu bagian, lalu lihat lagi tren 30 hari berikutnya.</p></section>
  </main>;
}
