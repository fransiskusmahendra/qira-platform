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

export interface SendClientConfirmationInput {
  discoveryId: string;
  reference: string;
  clientEmail: string;
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
    ? "QIRA Discovery Â· Email Cadangan"
    : input.triage.level === 3 ? "QIRA Manual Discovery L3" : input.triage.level === 2 ? "QIRA Review L2" : "QIRA Discovery Baru";
  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: process.env.QIRA_EMAIL_FROM ?? "QIRA <hello@qirasolution.com>",
    replyTo: process.env.QIRA_REPLY_TO ?? "hello@qirasolution.com",
    to: input.recipients,
    subject: `[${subjectPrefix}] ${input.contact.businessName} Â· ${input.reference}`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#17221b;max-width:680px;margin:auto">
      <p style="font-size:13px;letter-spacing:.08em;color:#4f6f5b">QIRA Â· DISCOVERY TRIAGE</p>
      <h1>${escapeHtml(input.triage.label)}</h1>
      <p><strong>${escapeHtml(input.contact.businessName)}</strong> Â· ${escapeHtml(input.contact.fullName)} Â· ${escapeHtml(input.contact.whatsapp)}${input.contact.email ? ` Â· ${escapeHtml(input.contact.email)}` : ""}</p>
      <p>Service: ${escapeHtml(input.serviceId)} Â· Referensi: ${escapeHtml(input.reference)}</p>
      ${input.persisted === false ? '<p style="background:#fff4d6;padding:12px;border-radius:8px"><strong>Catatan:</strong> penyimpanan database gagal. Data pelanggan diamankan melalui email ini dan perlu ditindaklanjuti secara manual.</p>' : ""}
      <h2>Alasan klasifikasi</h2><ul>${input.triage.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul>
      <h2>Ringkasan kebutuhan</h2>${details.map(([key, value]) => `<p><strong>${escapeHtml(key)}</strong><br>${escapeHtml(String(value))}</p>`).join("")}
      ${input.persisted === false ? "" : `<p><a href="${url}" style="display:inline-block;background:#173f2a;color:white;padding:12px 20px;border-radius:8px;text-decoration:none">Buka Discovery di admin</a></p>`}
    </div>`,
    text: `${input.triage.label}\n${input.contact.businessName} Â· ${input.contact.fullName}\n${input.contact.whatsapp}${input.contact.email ? ` Â· ${input.contact.email}` : ""}\n${input.triage.reasons.join("; ")}\n\n${details.map(([key, value]) => `${key}: ${String(value)}`).join("\n")}${input.persisted === false ? "\n\nPenyimpanan database gagal; tindak lanjuti data dari email ini." : `\n\n${url}`}`,
  }, { idempotencyKey: `discovery-review-${input.discoveryId}-${input.triage.level}` });

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, messageId: data?.id ?? null };
}

export async function sendClientDiscoveryConfirmationEmail(input: SendClientConfirmationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false as const, error: "RESEND_API_KEY belum tersedia." };
  if (!input.clientEmail) return { ok: false as const, error: "Email klien tidak valid." };

  const details = Object.entries(input.answers)
    .filter((entry): entry is [string, string | number] => entry[1] !== undefined);
  const proposalUrl = publicUrl(`/discovery/review?id=${input.discoveryId}`);
  const whatsappUrl = `https://wa.me/6285183042571?text=${encodeURIComponent(`Halo tim QIRA, saya sudah mengisi form kebutuhan usaha (${input.contact.businessName}) dengan nomor referensi: ${input.reference}`)}`;

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: process.env.QIRA_EMAIL_FROM ?? "QIRA <hello@qirasolution.com>",
    replyTo: process.env.QIRA_REPLY_TO ?? "hello@qirasolution.com",
    to: [input.clientEmail],
    subject: `[QIRA] Konfirmasi Pemetaan Kebutuhan Digital Â· ${input.contact.businessName} (${input.reference})`,
    html: `<div style="font-family:Arial,-apple-system,BlinkMacSystemFont,sans-serif;line-height:1.6;color:#1e293b;max-width:620px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;background:#ffffff">
      <div style="text-align:center;padding-bottom:20px;border-bottom:1px solid #f1f5f9">
        <h2 style="margin:0;color:#0f172a;font-size:22px;letter-spacing:-0.02em">QIRA</h2>
        <p style="margin:4px 0 0;font-size:13px;color:#64748b">Solusi Digital Sederhana untuk Bisnis</p>
      </div>
      <div style="padding:24px 0">
        <h3 style="margin-top:0;color:#0f172a">Halo ${escapeHtml(input.contact.fullName)},</h3>
        <p style="font-size:14.5px;color:#334155">
          Terima kasih telah menceritakan kebutuhan bisnis <strong>${escapeHtml(input.contact.businessName)}</strong> kepada tim QIRA. Kebutuhan Anda telah berhasil kami catat dengan nomor referensi:
        </p>
        <div style="background:#f8fafc;border-left:4px solid #2563eb;padding:12px 16px;margin:16px 0;border-radius:4px">
          <p style="margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.06em">Nomor Referensi</p>
          <p style="margin:2px 0 0;font-size:18px;font-weight:700;color:#0f172a">${escapeHtml(input.reference)}</p>
        </div>
        <p style="font-size:14px;color:#334155">
          <strong>Arah Solusi Rekomendasi:</strong> ${escapeHtml(input.triage.label)}
        </p>
        <div style="margin:24px 0">
          <a href="${proposalUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 22px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">Lihat Hasil Pemetaan & Proposal Anda â†’</a>
        </div>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 16px;margin:20px 0">
          <p style="margin:0 0 8px;font-size:13.5px;color:#166534;font-weight:600">Ingin konsultasi langsung dengan tim kami?</p>
          <a href="${whatsappUrl}" style="display:inline-block;background:#16a34a;color:#ffffff;padding:8px 16px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600">ðŸ’¬ Lanjut Diskusi via WhatsApp</a>
        </div>
        <h4 style="margin:20px 0 10px;font-size:14px;color:#475569">Ringkasan informasi kebutuhan yang Anda kirimkan:</h4>
        <div style="background:#f8fafc;border-radius:8px;padding:12px 16px;font-size:13px;color:#475569">
          ${details.map(([key, value]) => `<p style="margin:6px 0"><strong>${escapeHtml(key)}:</strong> ${escapeHtml(String(value))}</p>`).join("")}
        </div>
      </div>
      <div style="padding-top:16px;border-top:1px solid #f1f5f9;font-size:12px;color:#94a3b8;text-align:center">
        <p style="margin:0">Â© 2026 QIRA Â· <a href="https://www.qirasolution.com" style="color:#2563eb;text-decoration:none">qirasolution.com</a></p>
        <p style="margin:4px 0 0">Pesan ini dikirim otomatis sebagai konfirmasi konsultasi digital Anda.</p>
      </div>
    </div>`,
    text: `Halo ${input.contact.fullName},\n\nTerima kasih telah menceritakan kebutuhan bisnis ${input.contact.businessName} kepada QIRA.\n\nNomor Referensi: ${input.reference}\nArah Solusi: ${input.triage.label}\n\nLihat hasil blueprint & estimasi Anda:\n${proposalUrl}\n\nLanjut konsultasi via WhatsApp:\n${whatsappUrl}\n\nSalam,\nTim QIRA (qirasolution.com)`,
  }, { idempotencyKey: `client-confirmation-${input.discoveryId}` });

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, messageId: data?.id ?? null };
}