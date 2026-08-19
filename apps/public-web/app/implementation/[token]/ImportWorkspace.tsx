"use client";

import { useState, useTransition } from "react";
import { importImplementationData, type ImportResult } from "./actions";
import styles from "./implementation.module.css";

type Template = { id: string; name: string; description: string; columns: string[] };
type ImportRecord = { template_id: string; file_name: string; row_count: number; status: string; created_at: string };

function csvHref(columns: string[]) {
  return `data:text/csv;charset=utf-8,${encodeURIComponent(columns.join(",") + "\n")}`;
}

export function ImportWorkspace({ token, templates, imports }: { token: string; templates: Template[]; imports: ImportRecord[] }) {
  const [result, setResult] = useState<Record<string, ImportResult>>({});
  const [pending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>, templateId: string) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.set("token", token);
    data.set("templateId", templateId);
    startTransition(async () => {
      const response = await importImplementationData(data);
      setResult((current) => ({ ...current, [templateId]: response }));
    });
  }

  return <div className={styles.templateGrid}>{templates.map((template) => {
    const latest = imports.find((item) => item.template_id === template.id);
    const stateText = latest?.status === "valid" ? "Sudah siap" : latest ? "Perlu dicek lagi" : "Belum dikirim";
    return <article className={styles.templateCard} key={template.id}>
      <div className={styles.templateTop}>
        <div><small>File yang dibutuhkan</small><h3>{template.name}</h3></div>
        <span className={latest?.status === "valid" ? styles.valid : latest ? styles.invalid : ""}>{stateText}</span>
      </div>
      <p>{template.description}</p>
      {latest ? <p className={styles.latest}>Terakhir dikirim: {latest.file_name} · {latest.row_count} baris</p> : null}
      <div className={styles.templateActions}>
        <a href={csvHref(template.columns)} download={`qira-${template.id}.csv`}>Unduh contoh untuk Excel</a>
        <form onSubmit={(event) => submit(event, template.id)}>
          <input name="file" type="file" accept=".csv,text/csv" required />
          <button disabled={pending} type="submit">{pending ? "Memeriksa…" : "Kirim file"}</button>
        </form>
      </div>
      {result[template.id] ? <p className={result[template.id].status === "success" ? styles.success : styles.error}>{result[template.id].message}</p> : null}
    </article>;
  })}</div>;
}
