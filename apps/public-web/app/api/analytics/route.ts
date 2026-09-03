import { NextResponse } from "next/server";
import { createAdminClient } from "../../../lib/supabase/admin";

const ALLOWED_EVENTS = new Set([
  "landing_view","story_start","story_complete","discovery_start","discovery_submit","problem_select","pricing_view","portfolio_view","lead_submit","hero_explainer_interact","solution_explore","before_after_interact","application_example_interact","homepage_cta_click","whatsapp_request_click","consultation_request_click","service_view","assessment_step_2","assessment_step_3","assessment_step_4","assessment_complete","case_study_view","process_view","guide_view","vital_lcp_good","vital_lcp_needs_improvement","vital_lcp_poor","vital_inp_good","vital_inp_needs_improvement","vital_inp_poor","vital_cls_good","vital_cls_needs_improvement","vital_cls_poor"
]);

function normalizePath(value: unknown) { if (typeof value !== "string") return "/"; const path = value.trim(); if (!path.startsWith("/") || path.length > 160) return "/"; return path.split("?")[0] || "/"; }

export async function POST(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "same-site") return NextResponse.json({ ok: false }, { status: 403 });
  let body: { event?: unknown; path?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (typeof body.event !== "string" || !ALLOWED_EVENTS.has(body.event)) return NextResponse.json({ ok: false }, { status: 400 });
  const supabase = createAdminClient();
  const { error } = await (supabase as any).from("conversion_events").insert({ event_name: body.event, path: normalizePath(body.path) });
  if (error) { console.error("conversion analytics insert failed", error.code); return NextResponse.json({ ok: false }, { status: 503 }); }
  return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store, max-age=0" } });
}
