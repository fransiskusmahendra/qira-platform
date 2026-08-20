import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Contoh Penerapan",
  description: "Mulai dari cerita usaha Anda untuk melihat arah yang relevan dari QIRA.",
  robots: { index: false, follow: true },
};

export default function RecommendationPage() {
  redirect("/coba-masalah");
}
