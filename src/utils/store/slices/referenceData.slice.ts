import { getActiveFacilitiesByCity } from "../../../services/facilities";
import { getCities } from "../../../services/geo";
import { getMyPermissions, getRoles } from "../../../services/permissions";
import type { ReferenceDataSlice, SliceCreator } from "../../types/utils.types";

export const createReferenceDataSlice: SliceCreator<ReferenceDataSlice> = (set, get) => ({
  myPermissions: [],
  functionalRoles: [],
  administrativeRoles: [],
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

      const functionalRoles = roles.filter((role) => role.category === "FUNCTIONAL");
      const administrativeRoles = roles.filter((role) => role.category === "ADMINISTRATIVE");

      set({
        myPermissions: perms,
        cities: citiesData,
        functionalRoles,
        administrativeRoles,
        allRoles: roles,
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

  getActiveFacilitiesByCity: async (cityId: string) => {
    try {
      return await getActiveFacilitiesByCity(cityId);
    } catch {
      return [];
    }
  },

  resetReferenceData: () => {
    set({
      myPermissions: [],
      functionalRoles: [],
      administrativeRoles: [],
      allRoles: [],
      cities: [],
      referenceDataLoading: false,
      referenceDataError: null,
      referenceDataLoaded: false,
    });
  },
});
