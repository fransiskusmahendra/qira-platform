import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import styles from "../workspace.module.css";

type Item = { group: string; name: string; owner: string; required: boolean; configured: boolean; detail: string; steps: string[] };

export default async function ProductionReadinessPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = String(claims?.claims?.sub ?? "");
  if (!userId) redirect("/login");
  const membership = await supabase.from("memberships").select("role").eq("user_id", userId).eq("status", "active");
  if (!membership.data?.some((x) => x.role === "qira_admin")) redirect("/client");

  const hasSupabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasPublicKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasCron = Boolean(process.env.CRON_SECRET);
  const hasBackendKey = Boolean(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);
  const hasEmailKey = Boolean(process.env.RESEND_API_KEY);
  const hasEmailFrom = Boolean(process.env.QIRA_EMAIL_FROM || process.env.EMAIL_FROM);
  const hasAdminEmail = Boolean(process.env.QIRA_ADMIN_NOTIFICATION_EMAILS || process.env.QIRA_REPLY_TO);
  const hasAppUrl = Boolean(process.env.QIRA_PUBLIC_URL || process.env.NEXT_PUBLIC_APP_URL);

  const items: Item[] = [
    { group: "Aplikasi inti", name: "Supabase project URL", owner: "Otomatis", required: true, configured: hasSupabaseUrl, detail: "Alamat project database dan Auth.", steps: ["Vercel → Project Settings → Environment Variables", "Tambahkan NEXT_PUBLIC_SUPABASE_URL untuk Production dan Preview"] },
    { group: "Aplikasi inti", name: "Supabase publishable key", owner: "Otomatis", required: true, configured: hasPublicKey, detail: "Key publik untuk login dan akses berbasis RLS.", steps: ["Supabase → Settings → API Keys", "Tambahkan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY di Vercel"] },
    { group: "Reminder", name: "CRON_SECRET", owner: "Admin", required: true, configured: hasCron, detail: "Melindungi cron operasional harian QIRA.", steps: ["Buat nilai acak minimal 32 karakter", "Tambahkan CRON_SECRET di Vercel Production", "Cron dijadwalkan oleh vercel.json setiap 08:00 WIB"] },
    { group: "Reminder", name: "Supabase backend secret", owner: "Admin", required: true, configured: hasBackendKey, detail: "Mengizinkan cron server menulis reminder tanpa sesi pengguna.", steps: ["Supabase → Settings → API Keys", "Tambahkan SUPABASE_SECRET_KEY di Vercel Production", "Jangan gunakan prefix NEXT_PUBLIC_"] },
    { group: "Email", name: "Email provider API key", owner: "Admin", required: false, configured: hasEmailKey, detail: "Mengirim notifikasi Discovery, lead, dan proposal.", steps: ["Verifikasi domain qirasolution.com", "Tambahkan RESEND_API_KEY di Vercel server environment"] },
    { group: "Email", name: "Alamat pengirim QIRA", owner: "Admin", required: false, configured: hasEmailFrom, detail: "Identitas pengirim notifikasi pelanggan.", steps: ["Set QIRA_EMAIL_FROM menjadi QIRA <hello@qirasolution.com>", "Pastikan SPF dan DKIM domain aktif"] },
    { group: "Email", name: "Penerima notifikasi internal", owner: "Admin", required: false, configured: hasAdminEmail, detail: "Tujuan email untuk lead dan keputusan proposal.", steps: ["Set QIRA_ADMIN_NOTIFICATION_EMAILS", "Pisahkan beberapa alamat dengan koma bila diperlukan"] },
    { group: "Domain", name: "Production app URL", owner: "Admin", required: false, configured: hasAppUrl, detail: "URL canonical untuk tautan email dan callback.", steps: ["Set QIRA_PUBLIC_URL=https://www.qirasolution.com", "Pastikan redirect URL Supabase Auth memakai domain production"] },
    { group: "Domain", name: "DNS", owner: "Admin", required: false, configured: false, detail: "Dicek dari registrar/Vercel, bukan dari aplikasi.", steps: ["Pastikan qirasolution.com dan www.qirasolution.com menunjuk ke Vercel", "Pastikan SPF, DKIM, dan DMARC aktif"] },
    { group: "Operasional", name: "Backup & recovery", owner: "QIRA", required: false, configured: false, detail: "Tetapkan cara backup dan pemulihan sebelum data klien bertambah.", steps: ["Gunakan backup/PITR sesuai plan Supabase atau export database berkala", "Catat pemilik akses recovery dan target RPO/RTO", "Uji restore pada lingkungan non-production"] },
    { group: "Infrastruktur", name: "Deployment non-Vercel", owner: "Saat dibutuhkan", required: false, configured: false, detail: "Disiapkan hanya bila pelanggan membutuhkan server sendiri.", steps: ["Pilih provider sesuai workload", "Gunakan deploy key terbatas", "Siapkan HTTPS, firewall, backup, monitoring, dan rollback"] },
  ];

  const required = items.filter((x) => x.required);
  const missingRequired = required.filter((x) => !x.configured);
  const configured = items.filter((x) => x.configured);
  const planned = items.filter((x) => !x.required && !x.configured);
  const ready = required.length - missingRequired.length;

  const renderItem = (item: Item) => <article className={styles.readinessItem} key={item.name}><div className={item.configured ? styles.readyDot : item.required ? styles.blockedDot : styles.pendingDot}>{item.configured ? "✓" : "•"}</div><div><p>{item.group} · {item.owner}</p><h2>{item.name}</h2><span>{item.detail}</span><details><summary>Setup</summary><ol>{item.steps.map((step) => <li key={step}>{step}</li>)}</ol></details></div><div><span className={item.configured ? styles.readyBadge : item.required ? styles.urgentBadge : styles.neutralBadge}>{item.configured ? "Ready" : item.required ? "Required" : "Planned"}</span></div></article>;

  return <main className={styles.page}>
    <header className={styles.header}><div><Link className={styles.brand} href="/workspace">QIRA.</Link><p>Readiness</p></div><Link href="/workspace">Kembali</Link></header>
    <section className={styles.hero}><p className={styles.kicker}>Production</p><h1>{missingRequired.length ? `${missingRequired.length} hal wajib belum siap.` : "Konfigurasi wajib siap."}</h1><p>Secret tidak pernah ditampilkan.</p></section>
    <section className={styles.readinessSummary}><div><strong>{ready}/{required.length}</strong><span>Wajib siap</span></div><div className={styles.readinessBar}><i style={{ width: (ready / required.length * 100) + "%" }}/></div></section>

    {missingRequired.length > 0 && <section className={styles.panel}><p className={styles.kicker}>Kerjakan sekarang</p>{missingRequired.map(renderItem)}</section>}
    <details className={styles.panel}><summary>Sudah siap ({configured.length})</summary>{configured.map(renderItem)}</details>
    <details className={styles.panel}><summary>Nanti / opsional ({planned.length})</summary>{planned.map(renderItem)}</details>
  </main>;
}
