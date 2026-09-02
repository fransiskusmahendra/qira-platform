import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "../../../lib/supabase/server";
import styles from "../../login/login.module.css";

export default async function AcceptInvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  if (!token) redirect("/login");

  const supabase: any = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    const next = `/invite/accept?token=${encodeURIComponent(token)}`;
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  const { error } = await supabase.rpc("accept_invitation", {
    invitation_token: token,
  });

  if (error) {
    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <Link className={styles.brand} href="/">QIRA<span>.</span></Link>
          <p className={styles.kicker}>Undangan</p>
          <h1>Tautan tidak berlaku.</h1>
          <p className={styles.copy}>Bisa jadi sudah dipakai, kedaluwarsa, atau emailnya berbeda.</p>
          <Link className={styles.secondary} href="/login">Masuk dengan akun lain →</Link>
        </section>
      </main>
    );
  }

  redirect("/workspace");
}
