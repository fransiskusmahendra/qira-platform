import type { Metadata } from "next";
import { ProposalPreview } from "./ProposalPreview";

export const metadata: Metadata = {
  title: "Ringkasan dari QIRA",
  description: "Ringkasan sederhana tentang masalah, saran, waktu, dan perkiraan biaya berdasarkan cerita Anda.",
  robots: { index: false, follow: false },
};

export default function ProposalPreviewPage() {
  return <ProposalPreview />;
}