import assert from "node:assert/strict";
import test from "node:test";

import { TenantAccessDeniedError, type TenantContext } from "@qira/domain";
import {
  InMemoryPersistence,
  type DiscoveryRecord,
  type ProposalRecord,
  type ProposalVersionRecord,
} from "../src/index.ts";

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

const consultant: TenantContext = {
  actorId: "consultant-a",
  organizationId: "org-a",
  role: "qira_consultant",
};
const proposal: ProposalRecord = {
  id: "proposal-1",
  organizationId: "org-a",
  discoveryId: discovery.id,
  proposalNumber: "PROP/QIRA/2026/08/001",
  status: "review",
  version: 1,
  clientName: "Ugra Taraka Sigra",
  recipientName: "Marcel Pragiwaksana",
  issueDate: "2026-08-03",
  validUntil: "2026-09-02",
  commercialTerms: {
    packageId: "digital-foundation",
    basePriceIdr: 4_900_000,
    discountPercent: 0,
    taxPercent: 0,
    downPaymentPercent: 50,
  },
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

test("only QIRA roles can save and approve a proposal", async () => {
  const repository = new InMemoryPersistence();
  await assert.rejects(() => repository.saveProposal(orgA, proposal), TenantAccessDeniedError);
  await repository.saveProposal(consultant, proposal);
  const approved = await repository.approveProposal(
    consultant,
    proposal.id,
    "2026-08-03T01:00:00.000Z",
  );
  assert.equal(approved.status, "approved");
  assert.equal(approved.approvedBy, consultant.actorId);
  assert.equal((await repository.listForOrganization(consultant, "org-a"))[0]?.action, "proposal.approved");
});

test("proposal access remains isolated by tenant", async () => {
  const repository = new InMemoryPersistence();
  await repository.saveProposal(consultant, proposal);
  await assert.rejects(
    () => repository.findProposalById({ ...consultant, organizationId: "org-b" }, proposal.id),
    TenantAccessDeniedError,
  );
});

test("proposal versions are immutable and ordered", async () => {
  const repository = new InMemoryPersistence();
  await repository.saveProposal(consultant, proposal);
  const firstVersion: ProposalVersionRecord = {
    id: "proposal-version-1",
    proposalId: proposal.id,
    organizationId: proposal.organizationId,
    version: 1,
    snapshot: proposal,
    createdBy: consultant.actorId,
    createdAt: proposal.createdAt,
  };
  await repository.saveProposalVersion(consultant, firstVersion);
  assert.equal((await repository.listProposalVersions(consultant, proposal.id))[0]?.id, firstVersion.id);
  await assert.rejects(
    () => repository.saveProposalVersion(consultant, { ...firstVersion, id: "replacement" }),
    /immutable/,
  );
});

test("proposal cannot be approved before review", async () => {
  const repository = new InMemoryPersistence();
  await repository.saveProposal(consultant, { ...proposal, status: "draft" });
  await assert.rejects(
    () => repository.approveProposal(consultant, proposal.id, "2026-08-03T01:00:00.000Z"),
    /must be in review/,
  );
});
