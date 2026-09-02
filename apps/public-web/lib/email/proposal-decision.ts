import "server-only";

import { Resend } from "resend";

interface ProposalDecisionEmailInput {
  proposalId: string;
  proposalNumber: string;
  clientName: string;
  proposalVersion: number;
  decision: "accepted" | "revision_requested";
  comment: string | null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

function recipients() {
  return (process.env.QIRA_ADMIN_NOTIFICATION_EMAILS ?? process.env.QIRA_REPLY_TO ?? "hello@qirasolution.com")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => EMAIL_PATTERN.test(item));
}

function workspaceUrl(proposalId: string) {
  const configured = process.env.QIRA_PUBLIC_URL?.replace(/\/+$/, "");
  const base = configured ?? (process.env.NODE_ENV === "production" ? "https://www.qirasolution.com" : "http://localhost:3000");
  return `${base}/workspace/proposals/${proposalId}`;
}

export async function sendProposalDecisionEmail(input: ProposalDecisionEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const targets = recipients();
  if (!apiKey) return { ok: false as const, error: "RESEND_API_KEY belum tersedia." };
  if (!targets.length) return { ok: false as const, error: "Email admin QIRA belum tersedia." };

  const accepted = input.decision === "accepted";
  const title = accepted ? "Proposal diterima" : "Klien meminta revisi";
  const url = workspaceUrl(input.proposalId);
  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: process.env.QIRA_EMAIL_FROM ?? "QIRA <hello@qirasolution.com>",
    replyTo: process.env.QIRA_REPLY_TO ?? "hello@qirasolution.com",
    to: targets,
    subject: `[QIRA] ${title} · ${input.clientName}`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#17221b;max-width:680px;margin:auto">
      <p style="font-size:13px;letter-spacing:.08em;color:#4f6f5b">QIRA · PROPOSAL</p>
      <h1>${escapeHtml(title)}</h1>
      <p><strong>${escapeHtml(input.clientName)}</strong> · ${escapeHtml(input.proposalNumber)} · v${input.proposalVersion}</p>
      ${input.comment ? `<p><strong>Catatan klien</strong><br>${escapeHtml(input.comment).replace(/\n/g, "<br>")}</p>` : ""}
      <p><a href="${url}" style="display:inline-block;background:#173f2a;color:white;padding:12px 20px;border-radius:8px;text-decoration:none">Buka proposal</a></p>
    </div>`,
    text: `${title}\n${input.clientName} · ${input.proposalNumber} · v${input.proposalVersion}${input.comment ? `\n\nCatatan: ${input.comment}` : ""}\n\n${url}`,
  }, { idempotencyKey: `proposal-decision-${input.proposalId}-v${input.proposalVersion}-${input.decision}` });

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, messageId: data?.id ?? null };
}
