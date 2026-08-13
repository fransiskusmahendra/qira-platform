import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server";
import styles from "../../workspace.module.css";
import { onboardCustomer } from "../actions";

export default async function OnboardCustomerPage({searchParams}:{searchParams:Promise<{error?:string}>}){
  const supabase=await createClient();
  const {data:claims}=await supabase.auth.getClaims();
  if(!claims?.claims?.sub) redirect("/login");
  const membership=await supabase.from("memberships").select("role").eq("status","active");
  if(!membership.data?.some(item=>item.role==="qira_admin"||item.role==="qira_consultant")) redirect("/client");
  const {error}=await searchParams;

  return <main className={styles.page}>
    <header className={styles.header}><div><Link className={styles.brand} href="/workspace">QIRA.</Link><p>Customer onboarding</p></div><Link className={styles.primaryAction} href="/workspace/services">Kembali ke Control Center</Link></header>
    <section className={styles.hero}><p className={styles.kicker}>Record layanan baru</p><h1>Daftarkan customer dan project pertamanya.</h1><p>Satu proses ini membuat organization customer, customer record, managed project, dan subscription awal bila diisi.</p></section>
    <section className={styles.panel}>
      {error?<p className={styles.formError}>{error==="invalid"?"Periksa kembali data wajib dan nominal.":"Data belum berhasil disimpan. Silakan coba kembali."}</p>:null}
      <form action={onboardCustomer} className={styles.onboardForm}>
        <label>Nama customer<input name="customerName" required minLength={2} maxLength={160} placeholder="Contoh: Laundry Bersih Jaya"/></label>
        <label>Jenis customer<select name="customerType" defaultValue="umkm"><option value="umkm">UMKM</option><option value="company">Perusahaan</option><option value="enterprise">Enterprise</option></select></label>
        <label>Nama PIC<input name="contactName" maxLength={160} placeholder="Nama kontak utama"/></label>
        <label>Email PIC<input name="contactEmail" type="email" maxLength={254} placeholder="nama@perusahaan.com"/></label>
        <label>WhatsApp PIC<input name="contactWhatsapp" inputMode="tel" maxLength={32} placeholder="08..."/></label>
        <label>Nama project<input name="projectName" required minLength={2} maxLength={180} placeholder="Website & Sistem Laundry"/></label>
        <label>Paket<select name="packageId" defaultValue="digital-foundation"><option value="digital-foundation">Digital Foundation</option><option value="growth-engine">Growth Engine</option><option value="connected-growth">Connected Growth</option><option value="custom">Custom</option></select></label>
        <label>Model pengelolaan<select name="managementModel" defaultValue="qira_managed"><option value="qira_managed">Managed by QIRA</option><option value="hybrid">Hybrid</option><option value="customer_managed">Customer-managed</option></select></label>
        <label>Recurring bulanan (Rp)<input name="monthlyAmount" type="number" min="0" step="1000" defaultValue="0"/></label>
        <button className={styles.primaryAction} type="submit">Simpan customer & project</button>
      </form>
    </section>
  </main>;
}
