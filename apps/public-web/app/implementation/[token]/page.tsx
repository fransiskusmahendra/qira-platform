import { createHash } from "node:crypto";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "../../../lib/supabase/admin";
import { ImportWorkspace } from "./ImportWorkspace";
import styles from "./implementation.module.css";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const statusLabel: Record<string, string> = {
  awaiting_data: "Siap lanjut",
  data_review: "Data dicek",
  ready_for_build: "Siap dibuat",
  building: "Sedang dibuat",
  uat: "Siap dicoba",
  live: "Sudah live",
  revision_required: "Sedang disesuaikan",
};

export default async function ImplementationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{20,80}$/.test(token)) notFound();

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const supabase = createAdminClient() as any;
  const { data: workspace } = await supabase
    .from("implementation_workspaces")
    .select("id,business_name,blueprint_snapshot,status,public_reference")
    .eq("access_token_hash", tokenHash)
    .maybeSingle();
  if (!workspace) notFound();

  const { data: imports } = await supabase
    .from("implementation_imports")
    .select("template_id,file_name,row_count,status,created_at")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  const blueprint = workspace.blueprint_snapshot ?? {};
  const templates = blueprint.importTemplates ?? [];
  const completed = new Set((imports ?? []).filter((item: any) => item.status === "valid").map((item: any) => item.template_id)).size;
  const modules: string[] = blueprint.modules ?? ["Pencatatan lebih rapi", "Status mudah dilihat", "Ringkasan pemilik"];

  return <main className={styles.page}>
    <nav className={styles.nav}>
      <Link href="/" className={styles.brand}>QIRA<span>.</span></Link>
      <span>{workspace.public_reference}</span>
    </nav>

    <header className={styles.hero}>
      <div>
        <p>Langkah berikutnya</p>
        <h1>{workspace.business_name}</h1>
        <span>{statusLabel[workspace.status] ?? "Sedang ditindaklanjuti"}</span>
      </div>
      {templates.length > 0 ? <aside>
        <small>Data siap</small>
        <strong>{completed}/{templates.length}</strong>
      </aside> : null}
    </header>

    <section className={styles.generated}>
      <div>
        <p>Fokus</p>
        <h2>Yang akan QIRA rapikan.</h2>
      </div>
      <div className={styles.generatedGrid}>
        {modules.slice(0, 4).map((item) => <article key={item}><span>✓ {item}</span></article>)}
      </div>
    </section>

    {templates.length > 0 ? <details className={styles.dataDetails}>
      <summary>
        <div><small>Opsional</small><strong>Punya data? Upload di sini.</strong></div>
        <span>{completed}/{templates.length} siap</span>
      </summary>
      <div className={styles.importSection}>
        <ImportWorkspace token={token} templates={templates} imports={imports ?? []} />
      </div>
    </details> : null}

    <section className={styles.readiness}>
      <div>
        <p>Proses</p>
        <h2>Cek → Buat → Coba → Pakai.</h2>
      </div>
      <ol>
        <li className={templates.length === 0 || completed === templates.length ? styles.done : ""}><b>01</b><span>Cek</span></li>
        <li><b>02</b><span>Buat</span></li>
        <li><b>03</b><span>Coba</span></li>
        <li><b>04</b><span>Pakai</span></li>
      </ol>
    </section>

    <p className={styles.security}>Tautan khusus usaha Anda. Jangan dibagikan.</p>
  </main>;
}
