import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "../../../lib/supabase/server";
import { updateLeadCrm } from "./actions";
import styles from "../workspace.module.css";

const stages = ["new", "contacted", "discovery", "demo", "proposal", "negotiation", "won", "lost", "archived"] as const;
const stageLabel: Record<string, string> = {
  new: "Baru",
  contacted: "Sudah dihubungi",
  discovery: "Memahami kebutuhan",
  demo: "Melihat contoh",
  proposal: "Penawaran",
  negotiation: "Bahas harga/kebutuhan",
  won: "Jadi pelanggan",
  lost: "Tidak lanjut",
  archived: "Arsip",
};
const nextStep: Record<string, string> = {
  new: "Hubungi dengan pesan singkat dan ajak mulai dari satu masalah.",
  contacted: "Tunggu respons. Follow-up ringan bila belum ada kabar.",
  discovery: "Bantu pelanggan menjelaskan kebutuhan sampai arah bantuannya jelas.",
  demo: "Tunjukkan hanya bagian yang menjawab masalah utama pelanggan.",
  proposal: "Kirim ringkasan masalah, hasil, waktu, dan harga. Jangan menambah fitur yang belum diminta.",
  negotiation: "Jawab keberatan dan pastikan hasil, waktu, harga, serta cara pembayaran dipahami.",
  won: "Pastikan kesepakatan dan pembayaran awal, lalu mulai onboarding.",
  lost: "Simpan alasan singkat agar bisa dipelajari.",
  archived: "Tidak ada tindakan aktif.",
};

const activeStatuses = new Set(["new", "contacted", "discovery", "demo", "proposal", "negotiation"]);

function wibInput(value: string | null) {
  if (!value) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value));
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}

function wibDateTime(value: string | null) {
  if (!value) return "Belum dijadwalkan";
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value)) + " WIB";
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

  const { data: leads } = await supabase
    .from("public_leads")
    .select("id,full_name,business_name,whatsapp,email,package_interest,business_need,budget_range,lead_temperature,status,next_follow_up_at,last_contacted_at,internal_notes,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const now = new Date();
  const todayKey = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const endOfToday = new Date(`${todayKey}T23:59:59+07:00`);
  const active = (leads ?? []).filter((item: any) => activeStatuses.has(item.status));
  const dueToday = active
    .filter((item: any) => item.next_follow_up_at && new Date(item.next_follow_up_at) <= endOfToday)
    .sort((a: any, b: any) => new Date(a.next_follow_up_at).getTime() - new Date(b.next_follow_up_at).getTime());
  const overdueCount = dueToday.filter((item: any) => new Date(item.next_follow_up_at) < now).length;
  const nextUpcoming = active
    .filter((item: any) => item.next_follow_up_at && new Date(item.next_follow_up_at) > endOfToday)
    .sort((a: any, b: any) => new Date(a.next_follow_up_at).getTime() - new Date(b.next_follow_up_at).getTime())[0];

  return <main className={styles.page}>
    <header className={styles.header}>
      <div><Link className={styles.brand} href="/workspace">QIRA.</Link><p>Penjualan & follow-up</p></div>
      <div className={styles.panelActions}><Link href="/workspace/sales">Panduan jualan</Link><Link className={styles.primaryAction} href="/workspace">Workspace utama</Link></div>
    </header>

    <section className={styles.hero}>
      <p className={styles.kicker}>Yang perlu dikerjakan</p>
      <h1>Siapa yang perlu dihubungi hari ini?</h1>
      <p>Fokus pada langkah berikutnya. Tidak perlu membaca seluruh data CRM untuk tahu apa yang harus dilakukan.</p>
    </section>

    <section className={styles.panel}>
      <div className={styles.panelHeading}>
        <div><p className={styles.kicker}>Hari ini</p><h2>{dueToday.length ? `${dueToday.length} calon pelanggan perlu ditindaklanjuti` : "Tidak ada follow-up yang jatuh tempo hari ini"}</h2></div>
        <span className={overdueCount ? styles.urgentBadge : styles.neutralBadge}>{overdueCount ? `${overdueCount} terlambat` : "Aman"}</span>
      </div>
      {!dueToday.length ? <p className={styles.empty}>{nextUpcoming ? `Follow-up berikutnya: ${nextUpcoming.business_name} · ${wibDateTime(nextUpcoming.next_follow_up_at)}` : "Belum ada follow-up berikutnya yang dijadwalkan."}</p> : dueToday.map((lead: any) => <div className={styles.attentionRow} key={`due-${lead.id}`}>
        <div><strong>{lead.business_name} · {lead.full_name}</strong><p>{nextStep[lead.status] ?? "Tentukan langkah berikutnya."}</p><small>Jadwal: {wibDateTime(lead.next_follow_up_at)}</small></div>
        <div className={styles.panelActions}><a href={whatsappHref(lead.whatsapp)} target="_blank" rel="noreferrer">Buka WhatsApp ↗</a><a href={`#lead-${lead.id}`}>Buka catatan</a></div>
      </div>)}
    </section>

    <section className={styles.businessMetrics}>
      <article><span>Lead aktif</span><strong>{active.length}</strong></article>
      <article><span>Follow-up hari ini</span><strong>{dueToday.length}</strong></article>
      <article><span>Hot lead aktif</span><strong>{active.filter((item: any) => item.lead_temperature === "hot").length}</strong></article>
      <article><span>Sudah jadi pelanggan</span><strong>{(leads ?? []).filter((item: any) => item.status === "won").length}</strong></article>
    </section>

    <section className={styles.pipeline}>{stages.slice(0, 7).map((stage) => <article key={stage}><span>{stageLabel[stage]}</span><strong>{(leads ?? []).filter((item: any) => item.status === stage).length}</strong></article>)}</section>

    <section className={styles.panel}>
      <div className={styles.panelHeading}><div><p className={styles.kicker}>Semua calon pelanggan</p><h2>Catatan dan langkah berikutnya</h2></div><Link href="/workspace/sales">Buka template pesan & penawaran →</Link></div>
      {!leads?.length ? <p className={styles.empty}>Belum ada calon pelanggan.</p> : (leads ?? []).map((lead: any) => {
        const onboardingParams = new URLSearchParams({
          leadId: lead.id,
          customerName: lead.business_name ?? "",
          contactName: lead.full_name ?? "",
          contactEmail: lead.email ?? "",
          contactWhatsapp: lead.whatsapp ?? "",
          packageId: lead.package_interest ?? "digital-foundation",
        });
        return <article className={styles.leadCard} id={`lead-${lead.id}`} key={lead.id}>
          <div className={styles.leadSummary}>
            <div><strong>{lead.business_name}</strong><p>{lead.full_name} · <a href={whatsappHref(lead.whatsapp)} target="_blank" rel="noreferrer">{lead.whatsapp} ↗</a></p></div>
            <span className={lead.lead_temperature === "hot" ? styles.urgentBadge : styles.neutralBadge}>{stageLabel[lead.status] ?? lead.status}</span>
          </div>
          <p className={styles.leadNeed}>{lead.business_need}</p>
          <small>Langkah: {nextStep[lead.status] ?? "Tentukan langkah berikutnya."}</small>
          <small> · Kontak terakhir: {wibDateTime(lead.last_contacted_at)} · Follow-up: {wibDateTime(lead.next_follow_up_at)}</small>
          <form action={updateLeadCrm} className={styles.crmForm}>
            <input type="hidden" name="lead_id" value={lead.id}/>
            <label>Tahap<select name="status" defaultValue={lead.status}>{stages.map((stage) => <option value={stage} key={stage}>{stageLabel[stage]}</option>)}</select></label>
            <label>Follow-up berikutnya (WIB)<input type="datetime-local" name="next_follow_up_at" defaultValue={wibInput(lead.next_follow_up_at)}/></label>
            <label className={styles.notesField}>Catatan internal<textarea name="internal_notes" rows={3} maxLength={4000} defaultValue={lead.internal_notes ?? ""} placeholder="Apa yang dibahas, respons calon pelanggan, dan langkah berikutnya..."/></label>
            <button type="submit">Simpan</button>
          </form>
          {lead.status === "won" ? <p><Link className={styles.primaryAction} href={`/workspace/services/onboard?${onboardingParams.toString()}`}>Mulai onboarding pelanggan →</Link></p> : null}
        </article>;
      })}
    </section>
  </main>;
}
