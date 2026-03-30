export type PermissionScopeMode = "GLOBAL" | "FACILITY" | "OWN";

export type UserRoleScopeMode = "GLOBAL" | "FACILITY_SET";

export type PermissionKey =
  | "users.view"
  | "users.create"
  | "users.update"
  | "users.delete"
  | "roles.view"
  | "roles.manage"
  | "permissions.view"
  | "permissions.manage"
  | "facilities.view"
  | "facilities.manage"
  | "locations.view"
  | "locations.manage"
  | "items.view"
  | "items.create"
  | "items.update"
  | "items.delete"
  | "items.adjust"
  | "batches.view"
  | "batches.create"
  | "batches.update"
  | "inventory.view"
  | "inventory.adjust"
  | "inventory.transfer"
  | "requests.view"
  | "requests.create"
  | "requests.approve"
  | "requests.reject"
  | "requests.fulfill"
  | "controlled.authorize"
  | "reports.view";

export type AppPermissionKey = PermissionKey;
