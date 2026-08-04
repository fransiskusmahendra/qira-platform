import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

import { calculateCommercialTerms } from "@qira/domain";
import type { Json } from "../../../../../lib/supabase/database.types";
import { buildProposalPdf } from "../../../../../lib/proposal-pdf";
import { createClient } from "../../../../../lib/supabase/server";

function objectValue(value: Json) {
  return value && !Array.isArray(value) && typeof value === "object" ? value as Record<string, Json | undefined> : {};
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) return NextResponse.redirect(new URL("/login", _request.url));

  const { data: proposal } = await supabase.from("proposals").select("*").eq("id", id).maybeSingle();
  if (!proposal || !["approved", "shared"].includes(proposal.status) || !proposal.discovery_snapshot_id) return new NextResponse("Proposal belum approved", { status: 409 });
  const { data: snapshot } = await supabase.from("discovery_snapshots").select("snapshot, checksum_sha256").eq("id", proposal.discovery_snapshot_id).maybeSingle();
  if (!snapshot) return new NextResponse("Approved Discovery snapshot tidak ditemukan", { status: 409 });

  const terms = objectValue(proposal.commercial_terms);
  const calculated = calculateCommercialTerms({
    basePriceIdr: Number(terms.basePriceIdr), discountPercent: Number(terms.discountPercent),
    taxPercent: Number(terms.taxPercent), downPaymentPercent: Number(terms.downPaymentPercent),
  });
  const discovery = objectValue(snapshot.snapshot);
  const responses = objectValue(discovery.responses ?? null);
  const summary = Object.entries(responses).filter(([key]) => !key.startsWith("_")).slice(0, 4).map(([key, value]) => `${key}: ${String(value)}`).join(". ") || "Discovery approved menjadi dasar ruang lingkup proposal ini.";
  const bytes = await buildProposalPdf({
    proposalNumber: proposal.proposal_number, clientName: proposal.client_name, recipientName: proposal.recipient_name,
    issueDate: proposal.issue_date, validUntil: proposal.valid_until, version: proposal.version,
    commercial: { basePriceIdr: calculated.basePriceIdr, discountPercent: calculated.discountPercent, taxPercent: calculated.taxPercent, downPaymentPercent: calculated.downPaymentPercent, totalIdr: calculated.totalIdr },
    discoverySummary: summary, discoveryChecksum: snapshot.checksum_sha256,
  });
  const checksum = createHash("sha256").update(bytes).digest("hex");
  const { error } = await supabase.rpc("record_proposal_export", { target_proposal_id: id, pdf_checksum_sha256: checksum });
  if (error) return new NextResponse("Metadata export gagal disimpan", { status: 500 });
  return new NextResponse(Buffer.from(bytes), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${proposal.proposal_number.replace(/[^a-zA-Z0-9-]/g, "-")}.pdf"`, "X-QIRA-SHA256": checksum, "Cache-Control": "private, no-store" } });
}
