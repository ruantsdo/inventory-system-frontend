import type { GetUsersParams, UserListItem } from "../../types/usersDashboard";
import { apiClient } from "../api.client";

export async function getAllUsers(_params?: GetUsersParams): Promise<UserListItem[]> {
  const { data } = await apiClient.get<UserListItem[]>("/api/users/get/all");
  return data;
}

export async function getUsersByFacilityId(facilityId: string): Promise<UserListItem[]> {
  const { data } = await apiClient.get<UserListItem[]>(
    `/api/users/get/facility-id/${facilityId}`,
  );
  return data;
}
