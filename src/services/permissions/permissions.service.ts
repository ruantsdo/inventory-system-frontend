import type {
  PermissionOutput,
  RoleWithPermissionsOutput,
} from "../../types/api.contracts";
import { apiClient } from "../api.client";

export async function getMyPermissions(): Promise<PermissionOutput[]> {
  const { data } = await apiClient.get<PermissionOutput[]>("/api/permissions/currentUser");
  return data;
}

export async function getRoles(): Promise<RoleWithPermissionsOutput[]> {
  const { data } = await apiClient.get<RoleWithPermissionsOutput[]>("/api/permissions/roles/all");
  return data;
}
