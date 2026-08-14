import assert from "node:assert/strict";
import test from "node:test";

import { classifyDiscoveryTriage } from "../src/discovery-triage.ts";

const base = { serviceId: "business-apps" as const, assessment: { impact: 4, readiness: 4, complexity: 2 } };

test("level 1 for a standard low-complexity need", () => {
  assert.equal(classifyDiscoveryTriage({ ...base, answers: { business_profile: "Laundry satu lokasi" } }).level, 1);
});

test("level 2 when integration or review is needed", () => {
  const result = classifyDiscoveryTriage({ ...base, answers: { current_process: "Perlu integrasi WhatsApp" } });
  assert.equal(result.level, 2);
  assert.equal(result.requiresAdminReview, true);
});

test("level 3 for sensitive or highly complex work", () => {
  const result = classifyDiscoveryTriage({ ...base, answers: { business_profile: "Aplikasi rekam medis untuk klinik kesehatan" } });
  assert.equal(result.level, 3);
  assert.match(result.reasons.join(" "), /kesehatan|medis/);
});
