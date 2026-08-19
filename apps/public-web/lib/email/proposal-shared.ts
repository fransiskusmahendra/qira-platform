import "server-only";

import { Resend } from "resend";

interface SendProposalSharedEmailInput {
  proposalId: string;
  proposalNumber: string;
  clientName: string;
  recipientName: string;
  recipientEmail: string;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function publicUrl(path: string) {
  const configuredBaseUrl = process.env.QIRA_PUBLIC_URL?.replace(/\/+$/, "");
  const baseUrl = configuredBaseUrl
    ?? (process.env.NODE_ENV === "production" ? "https://qirasolution.com" : "http://localhost:3000");
  return `${baseUrl}${path}`;
}

function proposalUrl(proposalId: string) {
  return publicUrl(`/client/proposals/${proposalId}`);
}

export async function sendProposalSharedEmail(input: SendProposalSharedEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false as const, error: "RESEND_API_KEY belum tersedia." };

  const resend = new Resend(apiKey);
  const url = proposalUrl(input.proposalId);
  const recipientName = escapeHtml(input.recipientName);
  const clientName = escapeHtml(input.clientName);
  const proposalNumber = escapeHtml(input.proposalNumber);
  const { data, error } = await resend.emails.send({
    from: process.env.QIRA_EMAIL_FROM ?? "QIRA <hello@qirasolution.com>",
    replyTo: process.env.QIRA_REPLY_TO ?? "fransiskusmahendra@gmail.com",
    to: [input.recipientEmail],
    subject: `Proposal ${input.proposalNumber} dari QIRA`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#17221b;max-width:640px;margin:auto">
      <p style="font-size:13px;letter-spacing:.08em;color:#4f6f5b">QIRA · YOUR BUSINESS, UNDERSTOOD.</p>
      <h1 style="font-size:26px">Proposal Anda telah tersedia</h1>
      <p>Halo ${recipientName},</p>
      <p>Proposal <strong>${proposalNumber}</strong> untuk <strong>${clientName}</strong> telah dibagikan oleh tim QIRA.</p>
      <p><a href="${url}" style="display:inline-block;background:#173f2a;color:white;padding:12px 20px;border-radius:8px;text-decoration:none">Lihat proposal</a></p>
      <p style="font-size:13px;color:#65746b">Jika Anda tidak mengharapkan email ini, abaikan pesan ini atau hubungi tim QIRA.</p>
    </div>`,
    text: `Halo ${input.recipientName}, proposal ${input.proposalNumber} untuk ${input.clientName} telah tersedia: ${url}`,
  }, { idempotencyKey: `proposal-shared-${input.proposalId}` });

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, messageId: data?.id ?? null };
}
