"use client";

import { useEffect } from "react";

export type ConversionEvent =
  | "landing_view"
  | "story_start"
  | "story_complete"
  | "discovery_start"
  | "discovery_submit";

const STORAGE_PREFIX = "qira.conversion.";

function eventKey(event: ConversionEvent) {
  return `${STORAGE_PREFIX}${event}`;
}

export async function trackConversion(event: ConversionEvent) {
  if (typeof window === "undefined") return;

  const key = eventKey(event);
  try {
    if (window.sessionStorage.getItem(key) === "1") return;
  } catch {
    // Analytics must never block the customer journey when storage is unavailable.
  }

  try {
    const response = await fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event, path: window.location.pathname }),
      keepalive: true,
    });

    if (response.ok) {
      try {
        window.sessionStorage.setItem(key, "1");
      } catch {
        // Best effort only. No customer-facing behavior depends on this flag.
      }
    }
  } catch {
    // Analytics is deliberately non-blocking.
  }
}

export function ConversionTracker({ event }: { event: ConversionEvent }) {
  useEffect(() => {
    void trackConversion(event);
  }, [event]);

  return null;
}
