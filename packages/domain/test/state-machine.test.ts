import assert from "node:assert/strict";
import test from "node:test";

import {
  InvalidTransitionError,
  requiresProposalReapproval,
  transitionDiscovery,
  transitionProposal,
} from "../src/index.ts";

test("Discovery follows the review workflow", () => {
  assert.equal(transitionDiscovery("draft", "submitted"), "submitted");
  assert.equal(transitionDiscovery("submitted", "approved"), "approved");
});

test("approved Discovery is immutable", () => {
  assert.throws(() => transitionDiscovery("approved", "draft"), InvalidTransitionError);
});

test("proposal cannot be shared before approval", () => {
  assert.throws(() => transitionProposal("review", "shared"), InvalidTransitionError);
  assert.equal(transitionProposal("approved", "shared"), "shared");
});

test("commercial changes require proposal reapproval", () => {
  assert.equal(requiresProposalReapproval("approved", true), "draft");
  assert.equal(requiresProposalReapproval("approved", false), "approved");
});

