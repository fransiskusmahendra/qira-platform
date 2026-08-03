import assert from "node:assert/strict";
import test from "node:test";

import { findService, SERVICE_CATALOG } from "../src/index.ts";

test("service ids are unique", () => {
  const ids = SERVICE_CATALOG.map((service) => service.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("findService returns a known offering", () => {
  assert.equal(findService("discovery")?.name, "AI & Digital Discovery");
});

test("findService rejects an unknown offering", () => {
  assert.equal(findService("unknown"), undefined);
});

