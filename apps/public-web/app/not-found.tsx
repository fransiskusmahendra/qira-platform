"use client";

import Link from "next/link";
import { useLanguage } from "../lib/i18n";

export default function NotFound() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  return (
    <main className="notFound shell">
      <p className="kicker">404</p>
      <h1>{isEn ? "This page doesn't exist yet." : "Halaman ini belum tersedia."}</h1>
      <Link className="primaryButton" href="/">
        {isEn ? "Back to home" : "Kembali ke beranda"}
      </Link>
    </main>
  );
}