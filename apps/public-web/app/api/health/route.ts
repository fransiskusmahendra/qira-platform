import { NextResponse } from "next/server";

import { createAdminClient } from "../../../lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let database = false;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("organizations").select("id").limit(1);
    database = !error;
  } catch {
    database = false;
  }

  // QIRA_EMAIL_FROM is optional because the mailer has a verified qirasolution.com fallback sender.
  // The Resend API key is the actual required dependency for outbound email capability.
  const email = Boolean(process.env.RESEND_API_KEY);
  const ok = database && email;

  return NextResponse.json(
    {
      ok,
      service: "qira-public-web",
      dependencies: { database, email },
      timestamp: new Date().toISOString(),
    },
    {
      status: ok ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
