import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "../../../lib/supabase/server";
import { updateLeadCrm } from "./actions";
import styles from "../workspace.module.css";

const stages = ["new", "contacted", "discovery", "demo", "proposal", "negotiation", "won", "lost", "archived"] as const;
const stageLabel: Record<string, string> = {
  new: "Baru",
  contacted: "Dihubungi",
  discovery: "Discovery",
  demo: "Demo",
  proposal: "Proposal",
  negotiation: "Negosiasi",
  won: "Pelanggan",
  lost: "Tidak lanjut",
  archived: "Arsip",
};
const nextStep: Record<string, string> = {
  new: "Hubungi dan tanyakan satu masalah utama.",
  contacted: "Tunggu respons atau jadwalkan follow-up.",
  discovery: "Pastikan masalah dan hasil yang diinginkan jelas.",
  demo: "Tunjukkan hanya bagian yang relevan.",
  proposal: "Kirim arah, waktu, harga, dan pembayaran.",
  negotiation: "Pastikan kebutuhan dan harga dipahami.",
  won: "Mulai onboarding.",
  lost: "Simpan alasan singkat.",
  archived: "Tidak ada tindakan aktif.",
};
const activeStatuses = new Set(["new", "contacted", "discovery", "demo", "proposal", "negotiation"]);

function wibInput(value: string | null) {
  if (!value) return "";
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(value));
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}
function wibDateTime(value: string | null) {
  if (!value) return "Belum dijadwalkan";
  return new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) + " WIB";
}
function whatsappHref(whatsapp: string | null) {
  const digits = String(whatsapp ?? "").replace(/\D/g, "").replace(/^0/, "62");
  return digits ? `https://wa.me/${digits}` : "#";
}

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/login");
  const { data: memberships } = await supabase.from("memberships").select("role").eq("status", "active");
  if (!memberships?.some((item) => item.role === "qira_admin" || item.role === "qira_consultant")) redirect("/client");

  const { data: leads } = await (supabase as any).from("public_leads")
    .select("id,full_name,business_name,whatsapp,email,package_interest,business_need,lead_temperature,status,next_follow_up_at,last_contacted_at,internal_notes,created_at")
    .order("created_at", { ascending: false }).limit(100);

  const now = new Date();
  const todayKey = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const endOfToday = new Date(`${todayKey}T23:59:59+07:00`);
  const active = (leads ?? []).filter((item: any) => activeStatuses.has(item.status));
  const dueToday = active.filter((item: any) => item.next_follow_up_at && new Date(item.next_follow_up_at) <= endOfToday)
    .sort((a: any, b: any) => new Date(a.next_follow_up_at).getTime() - new Date(b.next_follow_up_at).getTime());
  const overdueCount = dueToday.filter((item: any) => new Date(item.next_follow_up_at) < now).length;
  const nextUpcoming = active.filter((item: any) => item.next_follow_up_at && new Date(item.next_follow_up_at) > endOfToday)
    .sort((a: any, b: any) => new Date(a.next_follow_up_at).getTime() - new Date(b.next_follow_up_at).getTime())[0];

  return <main className={styles.page}>
    <header className={styles.header}>
      <div><Link className={styles.brand} href="/workspace">QIRA.</Link><p>Leads</p></div>
      <div className={styles.panelActions}><Link href="/workspace/sales">Panduan jualan</Link><Link className={styles.primaryAction} href="/workspace">Workspace</Link></div>
    </header>

    <section className={styles.hero}>
      <p className={styles.kicker}>Hari ini</p>
      <h1>Siapa yang perlu dihubungi?</h1>
      <p>Kerjakan follow-up dulu. Detail CRM dibuka hanya saat diperlukan.</p>
    </section>

    <section className={styles.panel}>
      <div className={styles.panelHeading}><div><p className={styles.kicker}>Follow-up</p><h2>{dueToday.length ? `${dueToday.length} perlu dihubungi` : "Tidak ada yang jatuh tempo"}</h2></div><span className={overdueCount ? styles.urgentBadge : styles.neutralBadge}>{overdueCount ? `${overdueCount} terlambat` : "Aman"}</span></div>
      {!dueToday.length ? <p className={styles.empty}>{nextUpcoming ? `Berikutnya: ${nextUpcoming.business_name} · ${wibDateTime(nextUpcoming.next_follow_up_at)}` : "Belum ada follow-up terjadwal."}</p> : dueToday.map((lead: any) => <div className={styles.attentionRow} key={`due-${lead.id}`}>
        <div><strong>{lead.business_name}</strong><p>{nextStep[lead.status]}</p><small>{wibDateTime(lead.next_follow_up_at)}</small></div>
        <div className={styles.panelActions}><a href={whatsappHref(lead.whatsapp)} target="_blank" rel="noreferrer">WhatsApp ↗</a><a href={`#lead-${lead.id}`}>Catatan</a></div>
      </div>)}
    </section>

    <section className={styles.businessMetrics}>
      <article><span>Aktif</span><strong>{active.length}</strong><small>Masih berjalan</small></article>
      <article><span>Hot lead</span><strong>{active.filter((item: any) => item.lead_temperature === "hot").length}</strong><small>Prioritas</small></article>
      <article><span>Pelanggan</span><strong>{(leads ?? []).filter((item: any) => item.status === "won").length}</strong><small>Won</small></article>
    </section>

    <section className={styles.panel}>
      <div className={styles.panelHeading}><div><p className={styles.kicker}>Semua leads</p><h2>Buka hanya saat perlu edit</h2></div><Link href="/workspace/sales">Template pesan →</Link></div>
      {!leads?.length ? <p className={styles.empty}>Belum ada lead.</p> : (leads ?? []).map((lead: any) => {
        const onboardingParams = new URLSearchParams({ leadId: lead.id, customerName: lead.business_name ?? "", contactName: lead.full_name ?? "", contactEmail: lead.email ?? "", contactWhatsapp: lead.whatsapp ?? "", packageId: lead.package_interest ?? "digital-foundation" });
        return <details className={styles.leadCard} id={`lead-${lead.id}`} key={lead.id}>
          <summary className={styles.leadSummary}><div><strong>{lead.business_name}</strong><p>{lead.full_name} · {wibDateTime(lead.next_follow_up_at)}</p></div><span className={lead.lead_temperature === "hot" ? styles.urgentBadge : styles.neutralBadge}>{stageLabel[lead.status] ?? lead.status}</span></summary>
          <p className={styles.leadNeed}>{lead.business_need}</p>
          <p><a href={whatsappHref(lead.whatsapp)} target="_blank" rel="noreferrer">{lead.whatsapp} ↗</a></p>
          <small>Berikutnya: {nextStep[lead.status] ?? "Tentukan langkah berikutnya."}</small>
          <form action={updateLeadCrm} className={styles.crmForm}>
            <input type="hidden" name="lead_id" value={lead.id}/>
            <label>Tahap<select name="status" defaultValue={lead.status}>{stages.map((stage) => <option value={stage} key={stage}>{stageLabel[stage]}</option>)}</select></label>
            <label>Follow-up (WIB)<input type="datetime-local" name="next_follow_up_at" defaultValue={wibInput(lead.next_follow_up_at)}/></label>
            <label className={styles.notesField}>Catatan<textarea name="internal_notes" rows={3} maxLength={4000} defaultValue={lead.internal_notes ?? ""} placeholder="Respons dan langkah berikutnya"/></label>
            <button type="submit">Simpan</button>
          </form>
          {lead.status === "won" && <p><Link className={styles.primaryAction} href={`/workspace/services/onboard?${onboardingParams.toString()}`}>Onboard pelanggan →</Link></p>}
        </details>;
      })}
    </section>
  </main>;
}
