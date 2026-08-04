import assert from "node:assert/strict";
import test from "node:test";

import { canAcceptInvitation } from "../src/invitation.ts";

const now = new Date("2026-08-04T00:00:00.000Z");

test("allows a valid pending invitation for the signed-in email", () => {
  assert.equal(
    canAcceptInvitation({
      status: "pending",
      invitedEmail: "Client@Example.com",
      signedInEmail: "client@example.com",
      expiresAt: "2026-08-05T00:00:00.000Z",
      now,
    }),
    true,
  );
});

test("rejects an expired invitation", () => {
  assert.equal(
    canAcceptInvitation({
      status: "pending",
      invitedEmail: "client@example.com",
      signedInEmail: "client@example.com",
      expiresAt: now,
      now,
    }),
    false,
  );
});

test("rejects an invitation that was already accepted", () => {
  assert.equal(
    canAcceptInvitation({
      status: "accepted",
      invitedEmail: "client@example.com",
      signedInEmail: "client@example.com",
      expiresAt: "2026-08-05T00:00:00.000Z",
      now,
    }),
    false,
  );
});

test("rejects a different signed-in email or missing identity", () => {
  const base = {
    status: "pending" as const,
    invitedEmail: "client@example.com",
    expiresAt: "2026-08-05T00:00:00.000Z",
    now,
  };

  assert.equal(canAcceptInvitation({ ...base, signedInEmail: "other@example.com" }), false);
  assert.equal(canAcceptInvitation({ ...base, signedInEmail: null }), false);
});
