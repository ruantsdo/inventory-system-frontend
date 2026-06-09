import type {
  CityOutput,
  CreateUserPayload,
  FacilityOutput,
  PermissionOutput,
  RoleWithPermissionsOutput,
} from "../../types/api.contracts";
import { apiClient } from "../api.client";

export async function getCities(): Promise<CityOutput[]> {
  const { data } = await apiClient.get("/api/geo/cities");
  return data.cities as CityOutput[];
}
export async function getFacilitiesByCity(cityId: string): Promise<FacilityOutput[]> {
  const { data } = await apiClient.get(`/api/geo/cities/${cityId}/units`);
  return data.facilities as FacilityOutput[];
}

export async function getMyPermissions(): Promise<PermissionOutput[]> {
  const { data } = await apiClient.get<PermissionOutput[]>("/api/permissions/currentUser");
  return data;
}

export async function getRoles(): Promise<RoleWithPermissionsOutput[]> {
  const { data } = await apiClient.get<RoleWithPermissionsOutput[]>("/api/permissions/roles/all");
  return data;
}

export async function createUser(
  payload: CreateUserPayload,
): Promise<{ id: string; message: string }> {
  const { data } = await apiClient.post<{ id: string; message: string }>(
    "/api/users/createNewUser",
    payload,
  );
  return data;
}
