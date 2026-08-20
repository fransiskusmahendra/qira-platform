"use client";

import { useState } from "react";
import styles from "./sales.module.css";

export function CopyTemplate({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return <div className={styles.copyBox}>
    <pre>{text}</pre>
    <button type="button" onClick={copy}>{copied ? "Sudah disalin" : "Salin pesan"}</button>
  </div>;
}
