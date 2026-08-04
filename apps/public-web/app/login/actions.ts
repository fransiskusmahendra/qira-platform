"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "../../lib/supabase/server";

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

  const origin = (await headers()).get("origin");
  if (!origin) {
    loginQuery.set("error", "origin");
    redirect(`/login?${loginQuery}`);
  }

  const confirmUrl = new URL("/auth/confirm", origin);
  confirmUrl.searchParams.set("next", next);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: confirmUrl.toString() },
  });

  if (error) {
    loginQuery.set("error", "send");
    redirect(`/login?${loginQuery}`);
  }
  loginQuery.set("sent", "1");
  redirect(`/login?${loginQuery}`);
}
