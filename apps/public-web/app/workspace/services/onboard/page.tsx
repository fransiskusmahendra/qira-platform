import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server";
import styles from "../../workspace.module.css";
import { onboardCustomer } from "../actions";

const packageIds=new Set(["digital-foundation","growth-engine","connected-growth","custom"]);

export default async function OnboardCustomerPage({searchParams}:{searchParams:Promise<{error?:string;leadId?:string;customerName?:string;contactName?:string;contactEmail?:string;contactWhatsapp?:string;packageId?:string}>}){
  const supabase=await createClient();
  const {data:claims}=await supabase.auth.getClaims();
  if(!claims?.claims?.sub) redirect("/login");
  const membership=await supabase.from("memberships").select("role").eq("user_id",String(claims.claims.sub)).eq("status","active");
  if(!membership.data?.some(item=>item.role==="qira_admin"||item.role==="qira_consultant")) redirect("/client");
  const params=await searchParams;
  const packageId=packageIds.has(params.packageId??"")?params.packageId!:"digital-foundation";
  const fromLead=Boolean(params.leadId&&/^[0-9a-f-]{36}$/i.test(params.leadId));

  return <main className={styles.page}>
    <header className={styles.header}><div><Link className={styles.brand} href="/workspace">QIRA.</Link><p>Customer onboarding</p></div><Link className={styles.primaryAction} href="/workspace/services">Kembali ke Control Center</Link></header>
    <section className={styles.hero}><p className={styles.kicker}>Record layanan baru</p><h1>Daftarkan customer dan project pertamanya.</h1><p>{fromLead?"Data kontak diisi otomatis dari lead yang sudah menang. Lengkapi nama project, model pengelolaan, dan recurring service sebelum menyimpan.":"Satu proses ini membuat organization customer, customer record, managed project, dan subscription awal bila diisi."}</p></section>
    <section className={styles.panel}>
      {params.error?<p className={styles.formError}>{params.error==="invalid"?"Periksa kembali data wajib dan nominal.":"Data belum berhasil disimpan. Silakan coba kembali."}</p>:null}
      <form action={onboardCustomer} className={styles.onboardForm}>
        {fromLead?<input type="hidden" name="leadId" value={params.leadId}/>:null}
        <label>Nama customer<input name="customerName" required minLength={2} maxLength={160} defaultValue={params.customerName??""} placeholder="Contoh: Laundry Bersih Jaya"/></label>
        <label>Jenis customer<select name="customerType" defaultValue="umkm"><option value="umkm">UMKM</option><option value="company">Perusahaan</option><option value="enterprise">Enterprise</option></select></label>
        <label>Nama PIC<input name="contactName" maxLength={160} defaultValue={params.contactName??""} placeholder="Nama kontak utama"/></label>
        <label>Email PIC<input name="contactEmail" type="email" maxLength={254} defaultValue={params.contactEmail??""} placeholder="nama@perusahaan.com"/></label>
        <label>WhatsApp PIC<input name="contactWhatsapp" inputMode="tel" maxLength={32} defaultValue={params.contactWhatsapp??""} placeholder="08..."/></label>
        <label>Nama project<input name="projectName" required minLength={2} maxLength={180} defaultValue={params.customerName?`Digitalisasi ${params.customerName}`:""} placeholder="Website & Sistem Laundry"/></label>
        <label>Paket<select name="packageId" defaultValue={packageId}><option value="digital-foundation">Digital Foundation</option><option value="growth-engine">Growth Engine</option><option value="connected-growth">Connected Growth</option><option value="custom">Custom</option></select></label>
        <label>Model pengelolaan<select name="managementModel" defaultValue="qira_managed"><option value="qira_managed">Managed by QIRA</option><option value="hybrid">Hybrid</option><option value="customer_managed">Customer-managed</option></select></label>
        <label>Recurring bulanan (Rp)<input name="monthlyAmount" type="number" min="0" step="1000" defaultValue="0"/></label>
        <button className={styles.primaryAction} type="submit">Simpan customer & project</button>
      </form>
    </section>
  </main>;
}
