import type { Metadata } from "next";

import { DiscoveryReview } from "./DiscoveryReview";

export const metadata: Metadata = {
  title: "Review Discovery",
  description: "Review lokal hasil Discovery sebelum penyimpanan dan pengiriman diaktifkan.",
};

export default function DiscoveryReviewPage() {
  return <DiscoveryReview />;
}

