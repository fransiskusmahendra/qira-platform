import { createHash } from "node:crypto";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "../../../lib/supabase/admin";
import { ImportWorkspace } from "./ImportWorkspace";
import styles from "./implementation.module.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const statusLabel: Record<string, string> = {
  awaiting_data: "Menunggu data jika ada",
  data_review: "Data sedang kami periksa",
  ready_for_build: "Siap mulai dibuat",
  building: "Sedang kami kerjakan",
  uat: "Siap Anda coba",
  live: "Sudah siap digunakan",
  revision_required: "Sedang disesuaikan",
};

export default async function ImplementationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{20,80}$/.test(token)) notFound();

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const supabase = createAdminClient() as any;
  const { data: workspace } = await supabase
    .from("implementation_workspaces")
    .select("id,business_name,business_type_id,blueprint_snapshot,configuration,status,public_reference,created_at")
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
  const modules: string[] = blueprint.modules ?? ["Pencatatan lebih rapi", "Status pekerjaan mudah dilihat", "Ringkasan untuk pemilik"];

  return <main className={styles.page}>
    <nav className={styles.nav}>
      <Link href="/" className={styles.brand}>QIRA<span>.</span></Link>
      <span>{workspace.public_reference}</span>
    </nav>

    <header className={styles.hero}>
      <div>
        <p>Langkah berikutnya</p>
        <h1>{workspace.business_name}</h1>
        <span>{statusLabel[workspace.status] ?? "Sedang ditindaklanjuti QIRA"}</span>
      </div>
      {templates.length > 0 ? <aside>
        <small>Data yang sudah siap</small>
        <strong>{completed}/{templates.length}</strong>
        <span>bagian</span>
      </aside> : null}
    </header>

    <section className={styles.generated}>
      <div>
        <p>Yang akan kami bantu rapikan</p>
        <h2>QIRA akan mulai dari hal yang paling penting untuk pekerjaan sehari-hari Anda.</h2>
      </div>
      <div className={styles.generatedGrid}>
        {modules.slice(0, 4).map((item) => <article key={item}><small>Fokus</small><span>✓ {item}</span></article>)}
      </div>
    </section>

    {templates.length > 0 ? <section className={styles.importSection}>
      <div className={styles.sectionHead}>
        <div>
          <p>Kalau Anda sudah punya data</p>
          <h2>Kami siapkan contoh file supaya lebih mudah.</h2>
        </div>
        <span>Bisa dibuka dengan Excel</span>
      </div>
      <p>Unduh contoh, isi dengan data yang sudah Anda punya, lalu kirim kembali di sini. Kalau datanya belum siap, tidak masalah—QIRA bisa membahasnya bersama Anda.</p>
      <ImportWorkspace token={token} templates={templates} imports={imports ?? []} />
    </section> : null}

    <section className={styles.readiness}>
      <div>
        <p>Setelah ini apa yang terjadi?</p>
        <h2>Anda tidak perlu mengurus bagian teknisnya.</h2>
      </div>
      <ol>
        <li className={templates.length === 0 || completed === templates.length ? styles.done : ""}><b>01</b><span>QIRA memeriksa cerita dan data yang ada</span></li>
        <li><b>02</b><span>QIRA mulai menyiapkan hasil pertama</span></li>
        <li><b>03</b><span>Anda mencoba dan memberi masukan</span></li>
        <li><b>04</b><span>Setelah cocok, hasil siap digunakan</span></li>
      </ol>
    </section>

    <p className={styles.security}>Tautan ini khusus untuk usaha Anda. Simpan dan jangan bagikan kepada orang yang tidak berkepentingan.</p>
  </main>;
}
