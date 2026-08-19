import "server-only";

import { Resend } from "resend";

import type { DiscoveryTriageResult, ServiceId } from "@qira/domain";

interface SendDiscoveryReviewEmailInput {
  discoveryId: string;
  reference: string;
  persisted?: boolean;
  recipients: string[];
  triage: DiscoveryTriageResult;
  serviceId: ServiceId;
  contact: { fullName: string; businessName: string; whatsapp: string; email: string | null };
  answers: Record<string, string | number | undefined>;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

function publicUrl(path: string) {
  const configuredBaseUrl = process.env.QIRA_PUBLIC_URL?.replace(/\/+$/, "");
  const baseUrl = configuredBaseUrl
    ?? (process.env.NODE_ENV === "production" ? "https://www.qirasolution.com" : "http://localhost:3000");
  return `${baseUrl}${path}`;
}

function adminUrl(discoveryId: string) {
  return publicUrl(`/workspace/discoveries/${discoveryId}`);
}

export async function sendDiscoveryReviewEmail(input: SendDiscoveryReviewEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false as const, error: "RESEND_API_KEY belum tersedia." };
  if (!input.recipients.length) return { ok: false as const, error: "Email admin QIRA belum ditemukan." };

  const details = Object.entries(input.answers)
    .filter((entry): entry is [string, string | number] => entry[1] !== undefined);
  const url = adminUrl(input.discoveryId);
  const subjectPrefix = input.persisted === false
    ? "QIRA Discovery · Email Cadangan"
    : input.triage.level === 3 ? "QIRA Manual Discovery L3" : input.triage.level === 2 ? "QIRA Review L2" : "QIRA Discovery Baru";
  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: process.env.QIRA_EMAIL_FROM ?? "QIRA <hello@qirasolution.com>",
    replyTo: process.env.QIRA_REPLY_TO ?? "fransiskusmahendra@gmail.com",
    to: input.recipients,
    subject: `[${subjectPrefix}] ${input.contact.businessName} · ${input.reference}`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#17221b;max-width:680px;margin:auto">
      <p style="font-size:13px;letter-spacing:.08em;color:#4f6f5b">QIRA · DISCOVERY TRIAGE</p>
      <h1>${escapeHtml(input.triage.label)}</h1>
      <p><strong>${escapeHtml(input.contact.businessName)}</strong> · ${escapeHtml(input.contact.fullName)} · ${escapeHtml(input.contact.whatsapp)}${input.contact.email ? ` · ${escapeHtml(input.contact.email)}` : ""}</p>
      <p>Service: ${escapeHtml(input.serviceId)} · Referensi: ${escapeHtml(input.reference)}</p>
      ${input.persisted === false ? '<p style="background:#fff4d6;padding:12px;border-radius:8px"><strong>Catatan:</strong> penyimpanan database gagal. Data pelanggan diamankan melalui email ini dan perlu ditindaklanjuti secara manual.</p>' : ""}
      <h2>Alasan klasifikasi</h2><ul>${input.triage.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul>
      <h2>Ringkasan kebutuhan</h2>${details.map(([key, value]) => `<p><strong>${escapeHtml(key)}</strong><br>${escapeHtml(String(value))}</p>`).join("")}
      ${input.persisted === false ? "" : `<p><a href="${url}" style="display:inline-block;background:#173f2a;color:white;padding:12px 20px;border-radius:8px;text-decoration:none">Buka Discovery di admin</a></p>`}
    </div>`,
    text: `${input.triage.label}\n${input.contact.businessName} · ${input.contact.fullName}\n${input.contact.whatsapp}${input.contact.email ? ` · ${input.contact.email}` : ""}\n${input.triage.reasons.join("; ")}\n\n${details.map(([key, value]) => `${key}: ${String(value)}`).join("\n")}${input.persisted === false ? "\n\nPenyimpanan database gagal; tindak lanjuti data dari email ini." : `\n\n${url}`}`,
  }, { idempotencyKey: `discovery-review-${input.discoveryId}-${input.triage.level}` });

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, messageId: data?.id ?? null };
}
