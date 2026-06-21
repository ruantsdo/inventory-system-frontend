import { create } from "zustand";
import { getFacilitiesByCity as fetchFacilitiesByCity } from "../../services/facilities";
import { getCities } from "../../services/geo";
import { getMyPermissions, getRoles } from "../../services/permissions";
import type { ReferenceDataState } from "./referenceData.types";

export const useReferenceDataStore = create<ReferenceDataState>((set, get) => ({
  myPermissions: [],
  allRoles: [],
  cities: [],

  referenceDataLoading: false,
  referenceDataError: null,
  referenceDataLoaded: false,

  loadReferenceData: async () => {
    if (get().referenceDataLoaded || get().referenceDataLoading) return;

    set({ referenceDataLoading: true, referenceDataError: null });

    try {
      const [perms, roles, citiesData] = await Promise.all([
        getMyPermissions(),
        getRoles(),
        getCities(),
      ]);

      set({
        myPermissions: perms,
        allRoles: roles,
        cities: citiesData,
        referenceDataLoaded: true,
      });
    } catch {
      set({
        referenceDataError: "Não foi possível carregar os dados. Verifique sua conexão.",
      });
    } finally {
      set({ referenceDataLoading: false });
    }
  },

  getFacilitiesByCity: async (cityId: string) => {
    try {
      return await fetchFacilitiesByCity(cityId);
    } catch {
      return [];
    }
  },

  reset: () => {
    set({
      myPermissions: [],
      allRoles: [],
      cities: [],
      referenceDataLoading: false,
      referenceDataError: null,
      referenceDataLoaded: false,
    });
  },
}));
