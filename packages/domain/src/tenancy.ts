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

