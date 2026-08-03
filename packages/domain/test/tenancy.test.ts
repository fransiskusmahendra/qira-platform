import assert from "node:assert/strict";
import test from "node:test";

import { assertTenantAccess, canAccessTenantResource, TenantAccessDeniedError } from "../src/index.ts";

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

