import type { StateCreator } from "zustand";
import type {
  CityOutput,
  FacilityOutput,
  PermissionOutput,
  RoleWithPermissionsOutput,
} from "../../types/api.contracts";

export interface ViaCepResponse {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

export interface ReferenceDataSlice {
  myPermissions: PermissionOutput[];
  functionalRoles: RoleWithPermissionsOutput[];
  administrativeRoles: RoleWithPermissionsOutput[];
  allRoles: RoleWithPermissionsOutput[];
  cities: CityOutput[];
  referenceDataLoading: boolean;
  referenceDataError: string | null;
  referenceDataLoaded: boolean;

  loadReferenceData: () => Promise<void>;
  getActiveFacilitiesByCity: (cityId: string) => Promise<FacilityOutput[]>;
  resetReferenceData: () => void;
}

export interface CepSlice {
  cepIsLoading: boolean;
  cepError: string | null;
  fetchCep: (cep: string) => Promise<ViaCepResponse | void>;
}

export interface PermissionsNavigationSlice {
  checkPermission: (permissionName: string) => boolean;
  handleNavigation: (path: string, permission: string) => void;
}

export interface TimingSlice {
  greeting: () => string;
  formattedDate: () => string;
}

export type UtilsState = ReferenceDataSlice &
  CepSlice &
  PermissionsNavigationSlice &
  TimingSlice;

export type ReferenceDataState = UtilsState;

export type SliceCreator<T> = StateCreator<UtilsState, [], [], T>;
