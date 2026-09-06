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
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const href = waNumber
    ? `https://wa.me/${waNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Halo tim QIRA, saya ingin konsultasi terkait ${context}...`
      )}`
    : `/discovery?context=${encodeURIComponent(context)}`;

  return (
    <Link
      className={className}
      href={href}
      target={waNumber ? "_blank" : undefined}
      rel={waNumber ? "noreferrer noopener" : undefined}
      onClick={() => void trackConversion("consultation_request_click")}
    >
      {children}
    </Link>
  );
}
