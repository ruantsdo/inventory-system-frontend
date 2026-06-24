import type { CreateUserPayload } from "../../types/api.contracts";
import type { UserData } from "../../types/user";
import { apiClient } from "../api.client";

export async function createUser(
  payload: CreateUserPayload,
): Promise<{ id: string; message: string }> {
  const { data } = await apiClient.post<{ id: string; message: string }>(
    "/api/users/createNewUser",
    payload,
  );
  return data;
}

export async function getUserDataByID(id: string): Promise<UserData> {
  const { data } = await apiClient.get<UserData>(`/api/users/get/byId/${id}`);
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
