import type { FacilityForSession, FacilityOutput } from "../../types/api.contracts";
import { apiClient } from "../api.client";

export async function getAllFacilities(): Promise<FacilityOutput[]> {
  const { data } = await apiClient.get("/api/facilities/all");
  return data.facilities as FacilityOutput[];
}

export async function getAllActiveFacilities(): Promise<FacilityOutput[]> {
  const { data } = await apiClient.get("/api/facilities/active");
  return data.facilities as FacilityOutput[];
}

export async function getActiveFacilitiesByCity(cityId: string): Promise<FacilityOutput[]> {
  const { data } = await apiClient.get(`/api/facilities/${cityId}/active`);
  return data.facilities as FacilityOutput[];
}

export async function getAllFacilitiesForSession(): Promise<FacilityForSession[]> {
  const { data } = await apiClient.get("/api/facilities//active/session");
  return data.facilities as FacilityForSession[];
}

export async function getFacilitiesByCity(cityId: string): Promise<FacilityOutput[]> {
  const { data } = await apiClient.get(`/api/geo/cities/${cityId}/units`);
  return data.facilities as FacilityOutput[];
}

