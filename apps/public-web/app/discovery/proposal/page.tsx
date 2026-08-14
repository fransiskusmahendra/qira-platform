import type { Metadata } from "next";

import { ProposalPreview } from "./ProposalPreview";

export const metadata: Metadata = {
  title: "Proposal Awal QIRA",
  description: "Proposal, concept demo, dan estimasi harga awal berdasarkan Discovery customer.",
};

export default function ProposalPreviewPage() {
  return <ProposalPreview />;
}
