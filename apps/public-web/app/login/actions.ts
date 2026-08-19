"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "../../lib/supabase/server";

const PRODUCTION_ORIGIN = "https://www.qirasolution.com";

export async function signInWithMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const requestedNext = String(formData.get("next") ?? "");
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//")
    ? requestedNext
    : "/workspace";
  const loginQuery = new URLSearchParams({ next });

  if (!email || !email.includes("@")) {
    loginQuery.set("error", "email");
    redirect(`/login?${loginQuery}`);
  }

  const requestOrigin = (await headers()).get("origin");
  const isProduction = process.env.VERCEL_ENV === "production";
  const origin = isProduction ? PRODUCTION_ORIGIN : (requestOrigin ?? PRODUCTION_ORIGIN);

  const confirmUrl = new URL("/auth/confirm", origin);
  confirmUrl.searchParams.set("next", next);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: confirmUrl.toString(),
      shouldCreateUser: false,
    },
  });

  if (error) {
    console.error("QIRA magic link send failed", {
      code: error.code,
      status: error.status,
      message: error.message,
    });
    loginQuery.set("error", "send");
    redirect(`/login?${loginQuery}`);
  }

  loginQuery.set("sent", "1");
  redirect(`/login?${loginQuery}`);
}
