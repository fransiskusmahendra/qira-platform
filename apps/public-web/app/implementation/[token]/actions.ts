"use server";

import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "../../../lib/supabase/admin";

export type ImportResult = { status: "idle" | "success" | "error"; message: string };

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted;
    } else if (ch === "," && !quoted) {
      row.push(cell.trim()); cell = "";
    } else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = []; cell = "";
    } else cell += ch;
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

const hash = (token: string) => createHash("sha256").update(token).digest("hex");

export async function importImplementationData(formData: FormData): Promise<ImportResult> {
  const token = String(formData.get("token") ?? "");
  const templateId = String(formData.get("templateId") ?? "").slice(0, 80);
  const file = formData.get("file");
  if (token.length < 20 || !(file instanceof File) || file.size === 0 || file.size > 1_000_000) {
    return { status: "error", message: "Pilih file contoh yang sudah diisi, maksimal 1 MB." };
  }

  const supabase = createAdminClient() as any;
  const { data: workspace } = await supabase.from("implementation_workspaces").select("id,organization_id,blueprint_snapshot,status").eq("access_token_hash", hash(token)).maybeSingle();
  if (!workspace) return { status: "error", message: "Tautan ini sudah tidak dapat digunakan. Hubungi QIRA untuk bantuan." };

  const template = workspace.blueprint_snapshot?.importTemplates?.find((item: any) => item.id === templateId);
  if (!template) return { status: "error", message: "Jenis file ini belum dikenali. Unduh kembali contoh yang tersedia di halaman ini." };

  const text = await file.text();
  const parsed = parseCsv(text.replace(/^\uFEFF/, ""));
  if (parsed.length < 2) return { status: "error", message: "File masih kosong. Isi minimal satu baris data lalu kirim kembali." };

  const headers = parsed[0].map((item) => item.trim());
  const missing = (template.columns as string[]).filter((column: string) => !headers.includes(column));
  if (missing.length) return { status: "error", message: "Format file berubah. Gunakan contoh yang diunduh dari halaman ini tanpa mengubah judul kolom." };

  const dataRows = parsed.slice(1, 1001).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
  const emptyRequired = dataRows.reduce((count, row) => count + (template.columns.some((column: string) => !String(row[column] ?? "").trim()) ? 1 : 0), 0);
  const validation = { requiredColumns: template.columns, missingColumns: missing, rowsWithEmptyRequired: emptyRequired, truncated: parsed.length > 1001 };
  const status = emptyRequired === 0 ? "valid" : "invalid";

  const { error } = await supabase.from("implementation_imports").insert({
    organization_id: workspace.organization_id,
    workspace_id: workspace.id,
    template_id: templateId,
    file_name: file.name.slice(0, 200),
    row_count: dataRows.length,
    status,
    validation,
    rows: dataRows,
  });
  if (error) return { status: "error", message: "File belum berhasil tersimpan. Silakan coba sekali lagi." };

  const { data: validImports } = await supabase.from("implementation_imports").select("template_id").eq("workspace_id", workspace.id).eq("status", "valid");
  const validIds = new Set((validImports ?? []).map((item: any) => item.template_id));
  const allReady = workspace.blueprint_snapshot.importTemplates.every((item: any) => validIds.has(item.id));
  await supabase.from("implementation_workspaces").update({ status: allReady ? "ready_for_build" : "data_review", updated_at: new Date().toISOString() }).eq("id", workspace.id);
  revalidatePath(`/implementation/${token}`);

  return status === "valid"
    ? { status: "success", message: `Sudah tersimpan. ${dataRows.length} baris data siap digunakan QIRA.` }
    : { status: "error", message: `Masih ada ${emptyRequired} baris yang belum lengkap. Lengkapi bagian yang kosong lalu kirim kembali.` };
}
