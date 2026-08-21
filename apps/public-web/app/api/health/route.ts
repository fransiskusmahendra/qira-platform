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

  const email = Boolean(process.env.RESEND_API_KEY && process.env.QIRA_EMAIL_FROM);
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
