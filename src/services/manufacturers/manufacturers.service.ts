import type {
  CreateManufacturerPayload,
  ManufacturerOutput,
  PaginatedManufacturerItemsOutput,
  PaginatedManufacturersOutput,
  UpdateManufacturerPayload,
} from "../../types/api.contracts";
import { apiClient } from "../api.client";

interface ManufacturerEnvelope {
  status: string;
  manufacturer: ManufacturerOutput;
}

export async function getManufacturers(
  page = 1,
  limit = 10,
  search?: string,
): Promise<PaginatedManufacturersOutput> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set("search", search);
  const { data } = await apiClient.get<PaginatedManufacturersOutput>(
    `/api/manufacturers?${params.toString()}`,
  );
  return data;
}

export async function getManufacturerById(id: string): Promise<ManufacturerOutput> {
  const { data } = await apiClient.get<ManufacturerEnvelope>(`/api/manufacturers/${id}`);
  return data.manufacturer;
}

export async function getManufacturerItems(
  id: string,
  page = 1,
  limit = 10,
): Promise<PaginatedManufacturerItemsOutput> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const { data } = await apiClient.get<PaginatedManufacturerItemsOutput>(
    `/api/manufacturers/${id}/items?${params.toString()}`,
  );
  return data;
}

export async function createManufacturer(
  payload: CreateManufacturerPayload,
): Promise<ManufacturerOutput> {
  const { data } = await apiClient.post<ManufacturerEnvelope>("/api/manufacturers", payload);
  return data.manufacturer;
}

export async function updateManufacturer(
  id: string,
  payload: UpdateManufacturerPayload,
): Promise<ManufacturerOutput> {
  const { data } = await apiClient.put<ManufacturerEnvelope>(`/api/manufacturers/${id}`, payload);
  return data.manufacturer;
}

export async function deleteManufacturer(id: string): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/api/manufacturers/${id}`);
  return data;
}
