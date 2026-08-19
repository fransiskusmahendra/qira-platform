import { BUSINESS_BLUEPRINTS, type BusinessBlueprint } from "./business-blueprints.ts";

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function containsWholeKeyword(normalizedInput: string, keyword: string): boolean {
  const normalizedKeyword = normalizeSearchText(keyword);
  if (!normalizedKeyword) return false;
  return ` ${normalizedInput} `.includes(` ${normalizedKeyword} `);
}

export function findBusinessBlueprint(input: string): BusinessBlueprint | undefined {
  const normalized = normalizeSearchText(input);
  if (!normalized) return undefined;

  return BUSINESS_BLUEPRINTS.find((item) =>
    item.keywords.some((keyword) => containsWholeKeyword(normalized, keyword)),
  );
}
