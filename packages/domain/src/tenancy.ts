export type WorkspaceRole =
  | "prospect_member"
  | "client_viewer"
  | "client_member"
  | "qira_consultant"
  | "qira_admin";

export interface TenantContext {
  actorId: string;
  organizationId: string;
  role: WorkspaceRole;
  supportReason?: string;
}

export interface TenantResource {
  organizationId: string;
}

export class TenantAccessDeniedError extends Error {
  constructor() {
    super("Tenant access denied");
    this.name = "TenantAccessDeniedError";
  }
}

export type ProposalPermission = "proposal.read" | "proposal.write" | "proposal.approve";

const ROLE_PERMISSIONS: Readonly<Record<WorkspaceRole, readonly ProposalPermission[]>> = {
  prospect_member: ["proposal.read"],
  client_viewer: ["proposal.read"],
  client_member: ["proposal.read"],
  qira_consultant: ["proposal.read", "proposal.write", "proposal.approve"],
  qira_admin: ["proposal.read", "proposal.write", "proposal.approve"],
};

export function hasProposalPermission(
  context: TenantContext,
  permission: ProposalPermission,
): boolean {
  return ROLE_PERMISSIONS[context.role].includes(permission);
}

export function assertProposalPermission(
  context: TenantContext,
  permission: ProposalPermission,
): void {
  if (!hasProposalPermission(context, permission)) {
    throw new TenantAccessDeniedError();
  }
}

export function canAccessTenantResource(
  context: TenantContext,
  resource: TenantResource,
): boolean {
  if (context.organizationId === resource.organizationId) {
    return true;
  }

  return context.role === "qira_admin" && Boolean(context.supportReason?.trim());
}

export function assertTenantAccess(
  context: TenantContext,
  resource: TenantResource,
): void {
  if (!canAccessTenantResource(context, resource)) {
    throw new TenantAccessDeniedError();
  }
}
