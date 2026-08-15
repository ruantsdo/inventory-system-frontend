import type { CityOutput } from "../../types/api.contracts";
import { apiClient } from "../api.client";

export async function getCities(): Promise<CityOutput[]> {
  const { data } = await apiClient.get("/api/geo/cities");
  return data.cities as CityOutput[];
}

export async function getCitiesByState(state: string): Promise<CityOutput[]> {
  const { data } = await apiClient.get("/api/geo/cities/by-state", {
    params: { state },
  });
  return data.cities as CityOutput[];
}

export async function getStates(): Promise<string[]> {
  const { data } = await apiClient.get("/api/geo/states");
  return data.states as string[];
}
