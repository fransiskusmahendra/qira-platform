"use client";

import Link from "next/link";

import { trackConversion } from "./ConversionTracker";

export function ContextualWhatsAppCta({
  context,
  className = "primaryButton",
  children = "Mulai konsultasi",
}: {
  context: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      className={className}
      href={`/discovery?context=${encodeURIComponent(context)}`}
      onClick={() => void trackConversion("consultation_request_click")}
    >
      {children}
    </Link>
  );
}
