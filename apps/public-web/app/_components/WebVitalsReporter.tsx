"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackConversion, type ConversionEvent } from "./ConversionTracker";

const handleWebVitals: Parameters<typeof useReportWebVitals>[0] = (metric) => {
  if (metric.name !== "LCP" && metric.name !== "INP" && metric.name !== "CLS") return;
  const rating = (metric.rating ?? "needs-improvement").replace("-", "_");
  const event = `vital_${metric.name.toLowerCase()}_${rating}` as ConversionEvent;
  void trackConversion(event);
};

export function WebVitalsReporter() {
  useReportWebVitals(handleWebVitals);
  return null;
}
