import type { Metadata } from "next";

import { ProposalPreview } from "./ProposalPreview";

export const metadata: Metadata = {
  title: "Ringkasan dari QIRA",
  description: "Ringkasan sederhana tentang masalah, saran, waktu, dan perkiraan biaya berdasarkan cerita Anda.",
};

export default function ProposalPreviewPage() {
  return <ProposalPreview />;
}
