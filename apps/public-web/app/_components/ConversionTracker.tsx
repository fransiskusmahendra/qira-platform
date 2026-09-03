"use client";

import { useEffect } from "react";

export type ConversionEvent =
  | "landing_view" | "story_start" | "story_complete" | "discovery_start" | "discovery_submit"
  | "problem_select" | "pricing_view" | "portfolio_view" | "lead_submit" | "hero_explainer_interact"
  | "solution_explore" | "before_after_interact" | "application_example_interact" | "homepage_cta_click"
  | "whatsapp_request_click" | "consultation_request_click" | "service_view" | "assessment_step_2" | "assessment_step_3"
  | "assessment_step_4" | "assessment_complete" | "case_study_view" | "process_view" | "guide_view"
  | "vital_lcp_good" | "vital_lcp_needs_improvement" | "vital_lcp_poor"
  | "vital_inp_good" | "vital_inp_needs_improvement" | "vital_inp_poor"
  | "vital_cls_good" | "vital_cls_needs_improvement" | "vital_cls_poor";

const STORAGE_PREFIX = "qira.conversion.";

function eventKey(event: ConversionEvent, path: string) {
  return event === "service_view" || event === "guide_view" ? `${STORAGE_PREFIX}${event}.${path}` : `${STORAGE_PREFIX}${event}`;
}

export async function trackConversion(event: ConversionEvent) {
  if (typeof window === "undefined") return;
  const path = window.location.pathname;
  const key = eventKey(event, path);
  try { if (window.sessionStorage.getItem(key) === "1") return; } catch {}
  try {
    const response = await fetch("/api/analytics", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ event, path }), keepalive: true });
    if (response.ok) { try { window.sessionStorage.setItem(key, "1"); } catch {} }
  } catch {}
}

export function ConversionTracker({ event }: { event: ConversionEvent }) {
  useEffect(() => { void trackConversion(event); }, [event]);
  return null;
}

export function ConversionClickTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const tracked = target.closest<HTMLElement>("[data-conversion]");
      const conversion = tracked?.dataset.conversion as ConversionEvent | undefined;
      if (conversion) void trackConversion(conversion);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
  return null;
}
