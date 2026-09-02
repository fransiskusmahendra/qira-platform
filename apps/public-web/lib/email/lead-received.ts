import "server-only";

import { Resend } from "resend";

interface LeadEmailInput {
  fullName: string;
  businessName: string;
  whatsapp: string;
  email: string | null;
  businessNeed: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

function adminRecipients() {
  return (process.env.QIRA_ADMIN_NOTIFICATION_EMAILS ?? process.env.QIRA_REPLY_TO ?? "hello@qirasolution.com")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => EMAIL_PATTERN.test(item));
}

function workspaceUrl() {
  const configured = process.env.QIRA_PUBLIC_URL?.replace(/\/+$/, "");
  const base = configured ?? (process.env.NODE_ENV === "production" ? "https://www.qirasolution.com" : "http://localhost:3000");
  return `${base}/workspace/leads`;
}

export async function sendLeadReceivedEmail(input: LeadEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipients = adminRecipients();
  if (!apiKey) return { ok: false as const, error: "RESEND_API_KEY belum tersedia." };
  if (!recipients.length) return { ok: false as const, error: "Email admin QIRA belum tersedia." };

  const resend = new Resend(apiKey);
  const url = workspaceUrl();
  const needHtml = escapeHtml(input.businessNeed).replace(/\n/g, "<br>");
  const { data, error } = await resend.emails.send({
    from: process.env.QIRA_EMAIL_FROM ?? "QIRA <hello@qirasolution.com>",
    replyTo: process.env.QIRA_REPLY_TO ?? "hello@qirasolution.com",
    to: recipients,
    subject: `[QIRA Lead Baru] ${input.businessName}`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#17221b;max-width:680px;margin:auto">
      <p style="font-size:13px;letter-spacing:.08em;color:#4f6f5b">QIRA · LEAD BARU</p>
      <h1>${escapeHtml(input.businessName)}</h1>
      <p>${escapeHtml(input.fullName)} · ${escapeHtml(input.whatsapp)}${input.email ? ` · ${escapeHtml(input.email)}` : ""}</p>
      <h2>Kebutuhan</h2><p>${needHtml}</p>
      <p><a href="${url}" style="display:inline-block;background:#173f2a;color:white;padding:12px 20px;border-radius:8px;text-decoration:none">Buka Leads</a></p>
    </div>`,
    text: `Lead baru QIRA\n${input.businessName}\n${input.fullName} · ${input.whatsapp}${input.email ? ` · ${input.email}` : ""}\n\n${input.businessNeed}\n\n${url}`,
  });

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, messageId: data?.id ?? null };
}
