import type { Metadata } from "next";

import { ProposalPreview } from "./ProposalPreview";

export const metadata: Metadata = {
  title: "Proposal Preview",
  description: "Proposal indikatif yang dibuat dari Discovery preview QIRA.",
};

export default function ProposalPreviewPage() {
  return <ProposalPreview />;
}

