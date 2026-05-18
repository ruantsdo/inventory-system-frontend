import type {
  CityOutput,
  FacilityOutput,
  PermissionOutput,
  RoleWithPermissionsOutput,
} from "../../types/api.contracts";

export interface ReferenceDataState {
  myPermissions: PermissionOutput[];
  allRoles: RoleWithPermissionsOutput[];
  cities: CityOutput[];

  referenceDataLoading: boolean;
  referenceDataError: string | null;
  referenceDataLoaded: boolean;

  loadReferenceData: () => Promise<void>;
  getFacilitiesByCity: (cityId: string) => Promise<FacilityOutput[]>;
  reset: () => void;
}
