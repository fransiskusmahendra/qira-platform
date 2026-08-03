import assert from "node:assert/strict";
import test from "node:test";

import { calculateCommercialTerms, createProposalPreview, PROPOSAL_PACKAGES } from "../src/index.ts";

test("proposal packages use the approved indicative prices", () => {
  assert.deepEqual(PROPOSAL_PACKAGES.map((item) => item.indicativePriceIdr), [4_900_000, 9_900_000, 17_500_000]);
});

test("payment terms split the price into 50 percent milestones", () => {
  const proposal = createProposalPreview({
    serviceId: "automation",
    packageId: "growth-engine",
    objective: "Reduce manual reconciliation",
  });
  assert.equal(proposal.paymentTerms[0].percentage, 50);
  assert.equal(proposal.paymentTerms[1].percentage, 50);
  assert.equal(proposal.paymentTerms[0].amountIdr + proposal.paymentTerms[1].amountIdr, 9_900_000);
});

test("proposal commercial status remains indicative", () => {
  const proposal = createProposalPreview({ serviceId: "discovery", packageId: "digital-foundation", objective: "" });
  assert.equal(proposal.commercialStatus, "indicative");
  assert.match(proposal.objective, /Meningkatkan/);
});

test("commercial terms apply discount before tax and preserve the total", () => {
  const terms = calculateCommercialTerms({
    basePriceIdr: 10_000_000,
    discountPercent: 10,
    taxPercent: 11,
    downPaymentPercent: 50,
  });
  assert.equal(terms.discountAmountIdr, 1_000_000);
  assert.equal(terms.subtotalIdr, 9_000_000);
  assert.equal(terms.taxAmountIdr, 990_000);
  assert.equal(terms.totalIdr, 9_990_000);
  assert.equal(terms.downPaymentAmountIdr + terms.finalPaymentAmountIdr, terms.totalIdr);
});

test("commercial terms reject invalid percentages", () => {
  assert.throws(
    () => calculateCommercialTerms({ basePriceIdr: 1, discountPercent: 101, taxPercent: 0, downPaymentPercent: 50 }),
    RangeError,
  );
});
