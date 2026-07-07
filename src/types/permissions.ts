import type { AppPermissionKey, PermissionScopeMode } from "../enums/permissions";
import type { FacilityForSession } from "./api.contracts";
import type { AuthUser } from "./user";

export type ID = string;

export interface Permission {
  name: AppPermissionKey;
  displayName: string;
  description?: string | null;
  scopeMode: PermissionScopeMode;
}

export interface Role {
  id: ID;
  name: string;
  displayName: string;
  description?: string | null;
}

export interface Facility {
  id: ID;
  name: string;
  description?: string | null;
  cityId?: ID | null;
  isActive: boolean;
}

export interface SessionRole {
  roleId: ID;
  displayName?: string;
  facilities: ID[];
  permissionIds: ID[];
}

export interface ActiveContext {
  facilityId: ID | null;
  facilityName?: string | null;

  locationId?: ID | null;

  isGlobal: boolean;

  activeRoleDisplayName?: string | null;
}

export interface EffectivePermission {
  name: AppPermissionKey;

  isGlobal: boolean;

  scopeMode: PermissionScopeMode;

  allowedFacilityIds?: ID[];
}

export interface AuthSession {
  user: AuthUser;

  roles: Role[];

  sessionRoles?: SessionRole[];

  permissions: AppPermissionKey[];

  effectivePermissions: EffectivePermission[];

  facilities: FacilityForSession[];

  activeContext: ActiveContext;

  expiresAt?: string | null;
}

export interface AuthSessionResponse {
  authenticated: boolean;
  session: AuthSession | null;
}

export interface PermissionCheckInput {
  permission: AppPermissionKey;
  facilityId?: ID | null;
  locationId?: ID | null;
}

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: "missing_permission" | "scope_restricted" | "inactive_role" | "no_context";
}

export interface RoutePermissionMeta {
  permission: AppPermissionKey;
  scope?: PermissionScopeMode;
  requireActiveFacility?: boolean;
}

export interface AppAccessState {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  activeFacility: Facility | null;
  activeLocationId: ID | null;
}
