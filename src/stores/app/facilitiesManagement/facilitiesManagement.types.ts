import type { FacilityForSession, FacilityOutput } from "../../../types/api.contracts";

export interface FacilitiesManagementState {
  loading: boolean;
  error: string | null;
  facilities: FacilityForSession[];

  getAllFacilities: () => Promise<FacilityOutput[]>;
  getAllActiveFacilities: () => Promise<FacilityOutput[]>;
  getActiveFacilitiesByCity: (cityId: string) => Promise<FacilityOutput[]>;
  getAllFacilitiesForSession: () => Promise<FacilityForSession[]>;
}
