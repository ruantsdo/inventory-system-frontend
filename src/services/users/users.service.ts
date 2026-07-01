import type { CreateUserPayload, UpdateUserPayload, UserEditData } from "../../types/api.contracts";
import type { ID } from "../../types/permissions";
import type { UserData } from "../../types/user";
import { apiClient } from "../api.client";

export async function createUser(payload: CreateUserPayload): Promise<{ id: ID; message: string }> {
  const { data } = await apiClient.post<{ id: ID; message: string }>(
    "/api/users/createNewUser",
    payload,
  );
  return data;
}

export async function getUserDataByID(targetId: ID): Promise<UserData> {
  const { data } = await apiClient.get<UserData>(`/api/users/get/byId/${targetId}`);
  return data;
}

export async function getUserDataForEdit(targetId: ID): Promise<UserEditData> {
  const { data } = await apiClient.get<UserEditData>(`/api/users/get/editData/${targetId}`);
  return data;
}

export async function updateUser(
  targetId: ID,
  payload: UpdateUserPayload,
): Promise<{ message: string }> {
  const { data } = await apiClient.put<{ message: string }>(
    `/api/users/update/${targetId}`,
    payload,
  );
  return data;
}

export async function reactivateUser(targetId: ID): Promise<{ message: string }> {
  const { data } = await apiClient.put<{ message: string }>(`/api/users/reactivate/${targetId}`);
  return data;
}

export async function deactivateUser(targetId: ID): Promise<{ message: string }> {
  const { data } = await apiClient.put<{ message: string }>(`/api/users/deactivate/${targetId}`);
  return data;
}

export async function deleteUser(targetId: ID): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/api/users/delete/${targetId}`);
  return data;
}

export async function getUserDataByCpf(cpf: string): Promise<UserData> {
  const { data } = await apiClient.get<UserData>(`/api/users/get/byCpf/${cpf}`);
  return data;
}

export async function getUserDataByEmail(email: string): Promise<UserData> {
  const { data } = await apiClient.get<UserData>(`/api/users/get/byEmail/${email}`);
  return data;
}

export async function getSelfData(): Promise<UserData> {
  const { data } = await apiClient.get<UserData>(`/api/users/get/selfData/`);
  return data;
}
