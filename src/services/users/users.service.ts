import type { CreateUserPayload } from "../../types/api.contracts";
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

