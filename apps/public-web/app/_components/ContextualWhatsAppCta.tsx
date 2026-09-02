"use client";

import Link from "next/link";

import { trackConversion } from "./ConversionTracker";

export function ContextualWhatsAppCta({
  context,
  className = "primaryButton",
  children = "Minta dihubungi via WhatsApp",
}: {
  context: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      className={className}
      href={`/discovery?context=${encodeURIComponent(context)}`}
      onClick={() => void trackConversion("whatsapp_request_click")}
    >
      {children}
    </Link>
  );
}
