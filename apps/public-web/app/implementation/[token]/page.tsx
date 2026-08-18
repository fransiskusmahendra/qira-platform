import { createHash } from "node:crypto";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "../../../lib/supabase/admin";
import { ImportWorkspace } from "./ImportWorkspace";
import styles from "./implementation.module.css";

const statusLabel:Record<string,string>={awaiting_data:"Menunggu data awal",data_review:"Data sedang dilengkapi",ready_for_build:"Siap dibuat",building:"Sedang dibangun",uat:"Uji coba pelanggan",live:"Sudah aktif",revision_required:"Menunggu revisi scope"};

export default async function ImplementationPage({params}:{params:Promise<{token:string}>}){
  const {token}=await params;
  if(!/^[A-Za-z0-9_-]{20,80}$/.test(token))notFound();
  const tokenHash=createHash("sha256").update(token).digest("hex");
  const supabase=createAdminClient() as any;
  const {data:workspace}=await supabase.from("implementation_workspaces").select("id,business_name,business_type_id,blueprint_snapshot,configuration,status,public_reference,created_at").eq("access_token_hash",tokenHash).maybeSingle();
  if(!workspace)notFound();
  const {data:imports}=await supabase.from("implementation_imports").select("template_id,file_name,row_count,status,created_at").eq("workspace_id",workspace.id).order("created_at",{ascending:false});
  const blueprint=workspace.blueprint_snapshot;
  const completed=new Set((imports??[]).filter((item:any)=>item.status==="valid").map((item:any)=>item.template_id)).size;
  const total=blueprint.importTemplates?.length??0;
  return <main className={styles.page}>
    <nav className={styles.nav}><Link href="/" className={styles.brand}>QIRA<span>.</span></Link><span>{workspace.public_reference}</span></nav>
    <header className={styles.hero}><div><p>Implementation Workspace</p><h1>{workspace.business_name}</h1><span>{blueprint.name} · {statusLabel[workspace.status]??workspace.status}</span></div><aside><small>Kesiapan data</small><strong>{completed}/{total}</strong><span>template valid</span></aside></header>
    <section className={styles.generated}><div><p>Workspace yang akan dibuat</p><h2>Struktur awal sudah dibentuk dari Discovery dan blueprint usaha.</h2></div><div className={styles.generatedGrid}><article><small>Modul</small>{blueprint.modules.map((item:string)=><span key={item}>✓ {item}</span>)}</article><article><small>Pengguna</small>{blueprint.roles.map((item:string)=><span key={item}>✓ {item}</span>)}</article><article><small>Data utama</small>{blueprint.entities.map((item:string)=><span key={item}>✓ {item}</span>)}</article><article><small>Dokumen & laporan</small>{blueprint.outputs.map((item:string)=><span key={item}>✓ {item}</span>)}</article></div></section>
    <section className={styles.importSection}><div className={styles.sectionHead}><div><p>Data awal</p><h2>Unduh template, isi data yang sudah tersedia, lalu unggah kembali.</h2></div><span>CSV · maksimal 1 MB</span></div><div className={styles.instructions}><b>1</b><span>Unduh CSV kosong</span><b>2</b><span>Isi tanpa mengubah nama kolom</span><b>3</b><span>Unggah dan periksa hasil</span></div><ImportWorkspace token={token} templates={blueprint.importTemplates} imports={imports??[]}/></section>
    <section className={styles.readiness}><div><p>Setelah seluruh data valid</p><h2>QIRA meninjau konfigurasi, membuat sistem, lalu mengundang Anda ke UAT.</h2></div><ol><li className={completed===total?styles.done:""}><b>01</b><span>Data awal lengkap</span></li><li><b>02</b><span>Konfigurasi ditinjau QIRA</span></li><li><b>03</b><span>Workspace dibangun</span></li><li><b>04</b><span>UAT dan Go Live</span></li></ol></section>
    <p className={styles.security}>Tautan ini bersifat khusus untuk implementasi usaha Anda. Jangan meneruskannya kepada pihak yang tidak berwenang.</p>
  </main>;
}
