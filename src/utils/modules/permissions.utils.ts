import type { AppPermissionKey } from "../../enums/permissions";
import type {
  ActiveContext,
  AuthSession,
  PermissionCheckInput,
  PermissionCheckResult,
} from "../../types/permissions";

export function hasPermission(session: AuthSession | null, permission: AppPermissionKey): boolean {
  if (!session) return false;

  return session.permissions.includes(permission);
}

export function hasPermissionInContext(
  session: AuthSession | null,
  input: PermissionCheckInput,
): PermissionCheckResult {
  if (!session) {
    return { allowed: false, reason: "missing_permission" };
  }

  const permission = session.effectivePermissions.find((p) => p.name === input.permission);

  if (!permission) {
    return { allowed: false, reason: "missing_permission" };
  }

  if (permission.isGlobal || permission.scopeMode === "GLOBAL") {
    return { allowed: true };
  }

  if (permission.scopeMode === "OWN") {
    return { allowed: true };
  }

  if (!input.facilityId) {
    return { allowed: false, reason: "no_context" };
  }

  const allowed = permission.allowedFacilityIds?.includes(input.facilityId) ?? false;

  return allowed ? { allowed: true } : { allowed: false, reason: "scope_restricted" };
}

export function canUseFacilityContext(session: AuthSession | null, facilityId: string): boolean {
  if (!session) return false;
  return session.effectivePermissions.some(
    (p) => p.isGlobal || p.allowedFacilityIds?.includes(facilityId),
  );
}

export function getActiveContext(session: AuthSession | null): ActiveContext {
  return (
    session?.activeContext ?? {
      facilityId: null,
      isGlobal: false,
    }
  );
}
