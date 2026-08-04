export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired";

export interface InvitationAcceptanceInput {
  status: InvitationStatus;
  invitedEmail: string;
  signedInEmail: string | null | undefined;
  expiresAt: Date | string;
  now?: Date;
}

export function canAcceptInvitation({
  status,
  invitedEmail,
  signedInEmail,
  expiresAt,
  now = new Date(),
}: InvitationAcceptanceInput): boolean {
  if (status !== "pending" || !signedInEmail) return false;
  if (invitedEmail.trim().toLowerCase() !== signedInEmail.trim().toLowerCase()) return false;

  const expiry = expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
  return !Number.isNaN(expiry.getTime()) && expiry.getTime() > now.getTime();
}
