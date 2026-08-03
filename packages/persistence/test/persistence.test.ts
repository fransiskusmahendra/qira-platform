import assert from "node:assert/strict";
import test from "node:test";

import { TenantAccessDeniedError, type TenantContext } from "@qira/domain";
import { InMemoryPersistence, type DiscoveryRecord } from "../src/index.ts";

const orgA: TenantContext = {
  actorId: "user-a",
  organizationId: "org-a",
  role: "prospect_member",
};
const orgB: TenantContext = {
  actorId: "user-b",
  organizationId: "org-b",
  role: "prospect_member",
};
const discovery: DiscoveryRecord = {
  id: "discovery-1",
  organizationId: "org-a",
  serviceIds: ["automation"],
  status: "draft",
  version: 1,
  responses: { business_goal: "Reduce manual work" },
  scores: [],
  createdAt: "2026-08-03T00:00:00.000Z",
  updatedAt: "2026-08-03T00:00:00.000Z",
};

test("repository reads records inside tenant boundary", async () => {
  const repository = new InMemoryPersistence();
  await repository.save(orgA, discovery);
  assert.deepEqual(await repository.findById(orgA, discovery.id), discovery);
});

test("repository rejects cross-tenant identifier access", async () => {
  const repository = new InMemoryPersistence();
  await repository.save(orgA, discovery);
  await assert.rejects(
    () => repository.findById(orgB, discovery.id),
    TenantAccessDeniedError,
  );
});

test("tenant listing does not return another tenant records", async () => {
  const repository = new InMemoryPersistence();
  await repository.save(orgA, discovery);
  assert.deepEqual(await repository.list(orgB), []);
});

test("audit history requires matching tenant context", async () => {
  const repository = new InMemoryPersistence();
  await repository.append({
    id: "event-1",
    occurredAt: "2026-08-03T00:00:00.000Z",
    actorId: orgA.actorId,
    organizationId: orgA.organizationId,
    action: "discovery.created",
    resourceType: "discovery",
    resourceId: discovery.id,
    result: "success",
  });
  assert.equal((await repository.listForOrganization(orgA, "org-a")).length, 1);
  await assert.rejects(
    () => repository.listForOrganization(orgB, "org-a"),
    TenantAccessDeniedError,
  );
});

