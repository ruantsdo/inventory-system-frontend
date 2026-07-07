import type { CityOutput } from "../../types/api.contracts";
import { apiClient } from "../api.client";

export async function getCities(): Promise<CityOutput[]> {
  const { data } = await apiClient.get("/api/geo/cities");
  return data.cities as CityOutput[];
}
