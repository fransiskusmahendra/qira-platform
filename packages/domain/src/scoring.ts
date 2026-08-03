export type ScoreType = "opportunity" | "readiness" | "complexity";

export interface ScoreResult {
  type: ScoreType;
  value: number;
  factors: Readonly<Record<string, number>>;
  rulesetVersion: string;
}

export const SCORE_RULESET_VERSION = "2026-08-03.1";

function validateFactors(factors: Readonly<Record<string, number>>): void {
  const values = Object.values(factors);
  if (values.length === 0) {
    throw new RangeError("At least one scoring factor is required");
  }

  if (values.some((value) => !Number.isInteger(value) || value < 0 || value > 5)) {
    throw new RangeError("Scoring factors must be integers from 0 to 5");
  }
}

export function calculateEqualWeightScore(
  type: ScoreType,
  factors: Readonly<Record<string, number>>,
): ScoreResult {
  validateFactors(factors);
  const values = Object.values(factors);
  const average = values.reduce((total, value) => total + value, 0) / values.length;

  return {
    type,
    value: Math.round((average / 5) * 100),
    factors: { ...factors },
    rulesetVersion: SCORE_RULESET_VERSION,
  };
}

export function calculateDiscoveryScores(input: {
  opportunity: Readonly<Record<string, number>>;
  readiness: Readonly<Record<string, number>>;
  complexity: Readonly<Record<string, number>>;
}): readonly ScoreResult[] {
  return [
    calculateEqualWeightScore("opportunity", input.opportunity),
    calculateEqualWeightScore("readiness", input.readiness),
    calculateEqualWeightScore("complexity", input.complexity),
  ];
}

