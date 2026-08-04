import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "../../../lib/supabase/server";

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
      <main style={{ margin: "64px auto", maxWidth: 640, padding: 24 }}>
        <h1>Undangan tidak dapat diterima</h1>
        <p>Token sudah dipakai, kedaluwarsa, atau alamat email akun ini tidak cocok.</p>
        <Link href="/login">Masuk dengan akun lain</Link>
      </main>
    );
  }

  redirect("/workspace");
}
