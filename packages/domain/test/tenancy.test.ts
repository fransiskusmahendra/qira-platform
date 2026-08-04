import assert from "node:assert/strict";
import test from "node:test";

import { assertTenantAccess, canAccessTenantResource, canRevokeMembership, TenantAccessDeniedError } from "../src/index.ts";

const member = { actorId: "user-1", organizationId: "org-a", role: "prospect_member" as const };

test("member can access a resource in the same tenant", () => {
  assert.equal(canAccessTenantResource(member, { organizationId: "org-a" }), true);
});

test("member cannot access another tenant", () => {
  assert.equal(canAccessTenantResource(member, { organizationId: "org-b" }), false);
  assert.throws(
    () => assertTenantAccess(member, { organizationId: "org-b" }),
    TenantAccessDeniedError,
  );
});

test("admin cross-tenant support access requires a reason", () => {
  const admin = { actorId: "admin-1", organizationId: "qira", role: "qira_admin" as const };
  assert.equal(canAccessTenantResource(admin, { organizationId: "org-a" }), false);
  assert.equal(
    canAccessTenantResource({ ...admin, supportReason: "Investigate ticket QIRA-12" }, { organizationId: "org-a" }),
    true,
  );
});

test("only a same-tenant admin can revoke another active member", () => {
  const admin = { actorId: "admin-1", organizationId: "org-a", role: "qira_admin" as const };
  const target = { userId: "member-1", organizationId: "org-a", status: "active" as const };
  assert.equal(canRevokeMembership(admin, target), true);
  assert.equal(canRevokeMembership({ ...admin, actorId: target.userId }, target), false);
  assert.equal(canRevokeMembership({ ...admin, role: "qira_consultant" }, target), false);
  assert.equal(canRevokeMembership(admin, { ...target, organizationId: "org-b" }), false);
  assert.equal(canRevokeMembership(admin, { ...target, status: "suspended" }), false);
});
