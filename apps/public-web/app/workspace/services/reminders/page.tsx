import Link from "next/link";
import {redirect} from "next/navigation";
import {createClient} from "../../../../lib/supabase/server";
import styles from "../../workspace.module.css";
import {updateReminder} from "./actions";

const date=(value:string|null)=>value?new Intl.DateTimeFormat("id-ID",{dateStyle:"medium"}).format(new Date(value)):"—";
export default async function ReminderPage({searchParams}:{searchParams:Promise<{saved?:string;error?:string}>}){
 const supabase=await createClient();const {data:claims}=await supabase.auth.getClaims();if(!claims?.claims?.sub)redirect("/login");
 const membership=await supabase.from("memberships").select("role").eq("status","active");if(!membership.data?.some(x=>x.role==="qira_admin"||x.role==="qira_consultant"))redirect("/client");
 const {data:reminders}=await (supabase as any).from("service_reminders").select("id,customer_id,project_id,reminder_type,title,body,due_on,severity,status,created_at").eq("status","open").order("due_on",{ascending:true,nullsFirst:false});
 const customerIds=[...new Set((reminders??[]).map((x:any)=>x.customer_id))];const {data:customers}=customerIds.length?await (supabase as any).from("customers").select("id,display_name").in("id",customerIds):{data:[]};
 const customerById=new Map<string,any>((customers??[]).map((x:any)=>[x.id,x]));const params=await searchParams;
 return <main className={styles.page}>
  <header className={styles.header}><div><Link className={styles.brand} href="/workspace">QIRA.</Link><p>Service Reminders</p></div><Link className={styles.primaryAction} href="/workspace/services">Kembali ke Control Center</Link></header>
  <section className={styles.hero}><p className={styles.kicker}>Pengingat otomatis harian</p><h1>Jaga layanan customer sebelum terlambat.</h1><p>QIRA memeriksa domain, tagihan, review project, dan tiket setiap hari pukul 08.00 WIB, dengan jendela 45 hari.</p></section>
  {params.saved?<p className={styles.formSuccess}>Reminder berhasil diperbarui.</p>:null}{params.error?<p className={styles.formError}>Reminder belum berhasil diperbarui.</p>:null}
  <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.kicker}>Open reminders</p><h2>Antrean tindakan</h2></div><span className={(reminders??[]).some((x:any)=>x.severity==="urgent")?styles.urgentBadge:styles.neutralBadge}>{reminders?.length??0} open</span></div>
   {!reminders?.length?<p className={styles.empty}>Belum ada reminder terbuka. Cron pertama akan membangkitkan reminder dari record yang jatuh tempo.</p>:(reminders??[]).map((x:any)=><div className={styles.reminderRow} key={x.id}><div><span className={x.severity==="urgent"?styles.urgentBadge:x.severity==="warning"?styles.warningBadge:styles.neutralBadge}>{x.severity}</span><strong>{x.title}</strong><p>{x.body}</p><small>{customerById.get(x.customer_id)?.display_name??"Customer"} · jatuh tempo {date(x.due_on)}</small></div><div><Link href={`/workspace/services/customers/${x.customer_id}`}>Buka customer</Link><form action={updateReminder}><input type="hidden" name="id" value={x.id}/><button name="status" value="resolved">Selesai</button><button name="status" value="dismissed">Abaikan</button></form></div></div>)}
  </section>
 </main>;
}
