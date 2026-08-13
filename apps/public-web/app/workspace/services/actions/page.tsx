import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server";
import styles from "../../workspace.module.css";
import {updateDomainStatus,updateProjectStatus,updateSubscriptionStatus,updateTicketStatus} from "./actions";

const date=(value:string|null)=>value?new Intl.DateTimeFormat("id-ID",{dateStyle:"medium"}).format(new Date(value)):"—";
export default async function ActionCenterPage({searchParams}:{searchParams:Promise<{saved?:string;error?:string}>}){
 const supabase=await createClient();const {data:claims}=await supabase.auth.getClaims();if(!claims?.claims?.sub)redirect("/login");
 const membership=await supabase.from("memberships").select("role").eq("status","active");if(!membership.data?.some(i=>i.role==="qira_admin"||i.role==="qira_consultant"))redirect("/client");
 const horizon=new Date();horizon.setDate(horizon.getDate()+45);const horizonDate=horizon.toISOString().slice(0,10);const today=new Date().toISOString().slice(0,10);
 const [{data:projects},{data:domains},{data:subscriptions},{data:tickets}]=await Promise.all([
  (supabase as any).from("managed_projects").select("id,name,service_status,next_review_on").in("service_status",["onboarding","attention","maintenance","suspended"]).order("updated_at"),
  (supabase as any).from("project_domains").select("id,hostname,status,expires_on").lte("expires_on",horizonDate).order("expires_on"),
  (supabase as any).from("project_subscriptions").select("id,name,status,next_billing_on,amount_idr").lte("next_billing_on",horizonDate).in("status",["trial","active","past_due"]).order("next_billing_on"),
  (supabase as any).from("support_tickets").select("id,ticket_number,subject,priority,status,due_at").in("status",["open","in_progress","waiting_customer"]).order("due_at"),
 ]);
 const params=await searchParams;
 return <main className={styles.page}>
  <header className={styles.header}><div><Link className={styles.brand} href="/workspace">QIRA.</Link><p>Managed Services Action Center</p></div><Link className={styles.primaryAction} href="/workspace/services">Kembali ke Control Center</Link></header>
  <section className={styles.hero}><p className={styles.kicker}>Perlu tindakan</p><h1>Jatuh tempo dan status layanan dalam satu antrean.</h1><p>Daftar ini memprioritaskan 45 hari ke depan agar domain, subscription, dan support customer tidak terlewat.</p></section>
  {params.saved?<p className={styles.formSuccess}>Status berhasil diperbarui.</p>:null}{params.error?<p className={styles.formError}>Status belum berhasil diperbarui.</p>:null}
  <div className={styles.actionColumns}>
   <section className={styles.panel}><div className={styles.panelHeading}><h2>Project</h2><span className={styles.neutralBadge}>{projects?.length??0}</span></div>{!projects?.length?<p className={styles.empty}>Tidak ada project yang perlu perhatian.</p>:(projects??[]).map((x:any)=><form action={updateProjectStatus} className={styles.actionRow} key={x.id}><input type="hidden" name="id" value={x.id}/><div><strong>{x.name}</strong><small>{x.service_status} · review {date(x.next_review_on)}</small></div><select name="status" defaultValue={x.service_status}><option value="active">Active</option><option value="attention">Attention</option><option value="maintenance">Maintenance</option><option value="suspended">Suspended</option><option value="offboarded">Offboarded</option></select><button>Simpan</button></form>)}</section>
   <section className={styles.panel}><div className={styles.panelHeading}><h2>Domain ≤45 hari</h2><span className={styles.warningBadge}>{domains?.length??0}</span></div>{!domains?.length?<p className={styles.empty}>Tidak ada domain mendekati expiry.</p>:(domains??[]).map((x:any)=><form action={updateDomainStatus} className={styles.actionRow} key={x.id}><input type="hidden" name="id" value={x.id}/><div><strong>{x.hostname}</strong><small>{x.expires_on<today?"Sudah lewat":"Expiry"} · {date(x.expires_on)}</small></div><select name="status" defaultValue={x.status}><option value="active">Active</option><option value="expiring">Expiring</option><option value="expired">Expired</option><option value="issue">Issue</option></select><button>Simpan</button></form>)}</section>
   <section className={styles.panel}><div className={styles.panelHeading}><h2>Billing ≤45 hari</h2><span className={styles.neutralBadge}>{subscriptions?.length??0}</span></div>{!subscriptions?.length?<p className={styles.empty}>Tidak ada tagihan mendekati jatuh tempo.</p>:(subscriptions??[]).map((x:any)=><form action={updateSubscriptionStatus} className={styles.actionRow} key={x.id}><input type="hidden" name="id" value={x.id}/><div><strong>{x.name}</strong><small>{date(x.next_billing_on)} · Rp{Number(x.amount_idr).toLocaleString("id-ID")}</small></div><select name="status" defaultValue={x.status}><option value="active">Active</option><option value="past_due">Past due</option><option value="paused">Paused</option><option value="cancelled">Cancelled</option></select><button>Simpan</button></form>)}</section>
   <section className={styles.panel}><div className={styles.panelHeading}><h2>Support terbuka</h2><span className={styles.urgentBadge}>{tickets?.length??0}</span></div>{!tickets?.length?<p className={styles.empty}>Tidak ada tiket terbuka.</p>:(tickets??[]).map((x:any)=><form action={updateTicketStatus} className={styles.actionRow} key={x.id}><input type="hidden" name="id" value={x.id}/><div><strong>{x.ticket_number} · {x.subject}</strong><small>{x.priority} · due {date(x.due_at)}</small></div><select name="status" defaultValue={x.status}><option value="open">Open</option><option value="in_progress">In progress</option><option value="waiting_customer">Waiting customer</option><option value="resolved">Resolved</option><option value="closed">Closed</option></select><button>Simpan</button></form>)}</section>
  </div>
 </main>;
}
