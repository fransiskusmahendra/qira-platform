import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateDiscoveryScores,
  calculateEqualWeightScore,
  findMissingRequiredAnswers,
  getDiscoveryQuestionnaire,
  SCORE_RULESET_VERSION,
} from "../src/index.ts";

test("questionnaire combines common and service-specific questions", () => {
  const questionnaire = getDiscoveryQuestionnaire("automation");
  assert.equal(questionnaire.serviceId, "automation");
  assert.ok(questionnaire.questions.some((question) => question.id === "business_goal"));
  assert.ok(questionnaire.questions.some((question) => question.id === "business_profile"));
  assert.ok(questionnaire.questions.some((question) => question.id === "handoff_count"));
});

test("required answer validation returns stable question ids", () => {
  const questionnaire = getDiscoveryQuestionnaire("discovery");
  const missing = findMissingRequiredAnswers(questionnaire, { business_goal: "Grow sales" });
  assert.ok(missing.includes("current_process"));
  assert.ok(missing.includes("business_profile"));
  assert.ok(missing.includes("decision_needed"));
  assert.equal(missing.includes("budget_range"), false);
});

test("equal factor weights produce reproducible normalized scores", () => {
  const factors = { impact: 5, frequency: 4, urgency: 3 };
  const first = calculateEqualWeightScore("opportunity", factors);
  const second = calculateEqualWeightScore("opportunity", factors);
  assert.deepEqual(first, second);
  assert.equal(first.value, 80);
  assert.equal(first.rulesetVersion, SCORE_RULESET_VERSION);
});

test("invalid scoring input is rejected", () => {
  assert.throws(() => calculateEqualWeightScore("readiness", { data: 6 }), RangeError);
  assert.throws(() => calculateEqualWeightScore("readiness", {}), RangeError);
});

test("all three Discovery scores are returned", () => {
  const scores = calculateDiscoveryScores({
    opportunity: { impact: 5 },
    readiness: { processClarity: 3 },
    complexity: { integrationCount: 4 },
  });
  assert.deepEqual(scores.map((score) => score.type), ["opportunity", "readiness", "complexity"]);
});
