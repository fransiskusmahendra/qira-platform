import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { updateLeadCrm } from "./actions";
import styles from "../workspace.module.css";

const stages=["new","contacted","discovery","demo","proposal","negotiation","won","lost","archived"] as const;
const stageLabel:Record<string,string>={new:"Baru",contacted:"Dihubungi",discovery:"Discovery",demo:"Demo",proposal:"Proposal",negotiation:"Negosiasi",won:"Menang",lost:"Kalah",archived:"Arsip"};

export default async function LeadsPage(){
  const supabase=await createClient();
  const {data:claims}=await supabase.auth.getClaims();if(!claims?.claims?.sub) redirect("/login");
  const {data:memberships}=await supabase.from("memberships").select("role").eq("status","active");
  if(!memberships?.some(item=>item.role==="qira_admin"||item.role==="qira_consultant")) redirect("/client");
  const {data:leads}=await supabase.from("public_leads").select("id,full_name,business_name,whatsapp,email,package_interest,business_need,budget_range,lead_temperature,status,next_follow_up_at,last_contacted_at,internal_notes,created_at").order("created_at",{ascending:false}).limit(100);
  const now=new Date();
  const due=(leads??[]).filter((item:any)=>item.next_follow_up_at&&new Date(item.next_follow_up_at)<=now&&!["won","lost","archived"].includes(item.status));
  const active=(leads??[]).filter((item:any)=>!["won","lost","archived"].includes(item.status));
  return <main className={styles.page}>
    <header className={styles.header}><div><Link className={styles.brand} href="/workspace">QIRA.</Link><p>Lead CRM & Follow-up</p></div><Link className={styles.primaryAction} href="/workspace">Workspace utama</Link></header>
    <section className={styles.hero}><p className={styles.kicker}>Sales pipeline</p><h1>Setiap lead memiliki tahap dan tindak lanjut berikutnya.</h1><p>Gunakan CRM ini sejak calon pelanggan mencoba demo sampai project dinyatakan menang atau kalah.</p></section>
    <section className={styles.businessMetrics}><article><span>Total lead</span><strong>{leads?.length??0}</strong></article><article><span>Pipeline aktif</span><strong>{active.length}</strong></article><article><span>Follow-up jatuh tempo</span><strong>{due.length}</strong></article><article><span>Hot lead aktif</span><strong>{active.filter((item:any)=>item.lead_temperature==="hot").length}</strong></article></section>
    <section className={styles.pipeline}>{stages.slice(0,7).map(stage=><article key={stage}><span>{stageLabel[stage]}</span><strong>{(leads??[]).filter((item:any)=>item.status===stage).length}</strong></article>)}</section>
    <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Lead records</p><h2>Data dan pengingat follow-up</h2></div><span className={due.length?styles.urgentBadge:styles.neutralBadge}>{due.length} due</span></div>
      {!leads?.length?<p className={styles.empty}>Belum ada lead publik.</p>:(leads??[]).map((lead:any)=><article className={styles.leadCard} key={lead.id}>
        <div className={styles.leadSummary}><div><strong>{lead.business_name}</strong><p>{lead.full_name} · <a href={`https://wa.me/${lead.whatsapp.replace(/\D/g,"").replace(/^0/,"62")}`} target="_blank" rel="noreferrer">{lead.whatsapp} ↗</a></p></div><span className={lead.lead_temperature==="hot"?styles.urgentBadge:styles.neutralBadge}>{lead.lead_temperature}</span></div>
        <p className={styles.leadNeed}>{lead.business_need}</p><small>{lead.package_interest} · {lead.budget_range} · masuk {new Date(lead.created_at).toLocaleDateString("id-ID")}</small>
        <form action={updateLeadCrm} className={styles.crmForm}><input type="hidden" name="lead_id" value={lead.id}/><label>Tahap<select name="status" defaultValue={lead.status}>{stages.map(stage=><option value={stage} key={stage}>{stageLabel[stage]}</option>)}</select></label><label>Follow-up berikutnya<input type="datetime-local" name="next_follow_up_at" defaultValue={lead.next_follow_up_at?new Date(lead.next_follow_up_at).toISOString().slice(0,16):""}/></label><label className={styles.notesField}>Catatan internal<textarea name="internal_notes" rows={2} maxLength={4000} defaultValue={lead.internal_notes??""} placeholder="Hasil kontak, kebutuhan, keberatan, atau langkah berikutnya..."/></label><button type="submit">Simpan CRM</button></form>
      </article>)}
    </section>
  </main>;
}
