import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

import { calculateCommercialTerms } from "@qira/domain";
import type { Json } from "../../../../../lib/supabase/database.types";
import { buildProposalPdf } from "../../../../../lib/proposal-pdf";
import { createClient } from "../../../../../lib/supabase/server";

function objectValue(value: Json) {
  return value && !Array.isArray(value) && typeof value === "object"
    ? value as Record<string, Json | undefined>
    : {};
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) {
    const next = `/client/proposals/${encodeURIComponent(id)}`;
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, request.url));
  }

  const { data: proposal } = await supabase
    .from("proposals")
    .select("id,organization_id,proposal_number,client_name,recipient_name,issue_date,valid_until,status,version,commercial_terms")
    .eq("id", id)
    .eq("status", "shared")
    .maybeSingle();

  if (!proposal) return new NextResponse("Dokumen tidak ditemukan", { status: 404 });

  const terms = objectValue(proposal.commercial_terms);
  const commercial = calculateCommercialTerms({
    basePriceIdr: Number(terms.basePriceIdr),
    discountPercent: Number(terms.discountPercent),
    taxPercent: Number(terms.taxPercent),
    downPaymentPercent: Number(terms.downPaymentPercent),
  });
  const bytes = await buildProposalPdf({
    proposalNumber: proposal.proposal_number,
    clientName: proposal.client_name,
    recipientName: proposal.recipient_name,
    issueDate: proposal.issue_date,
    validUntil: proposal.valid_until,
    version: proposal.version,
    commercial: {
      basePriceIdr: commercial.basePriceIdr,
      discountPercent: commercial.discountPercent,
      taxPercent: commercial.taxPercent,
      downPaymentPercent: commercial.downPaymentPercent,
      totalIdr: commercial.totalIdr,
    },
    discoverySummary: "Penawaran ini merangkum kebutuhan yang sudah dibahas bersama QIRA serta biaya yang disiapkan untuk pekerjaan tersebut.",
  });
  const checksum = createHash("sha256").update(bytes).digest("hex");
  const { error: eventError } = await (supabase as any).from("proposal_client_events").insert({
    proposal_id: proposal.id,
    organization_id: proposal.organization_id,
    proposal_version: proposal.version,
    event_type: "pdf_downloaded",
    checksum_sha256: checksum,
    actor_id: claimsData.claims.sub,
  });
  if (eventError) return new NextResponse("Unduhan belum dapat diproses. Silakan coba lagi.", { status: 500 });
  const filename = proposal.proposal_number.replace(/[^a-zA-Z0-9-]/g, "-");

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}.pdf"`,
      "X-QIRA-SHA256": checksum,
      "Cache-Control": "private, no-store",
    },
  });
}
