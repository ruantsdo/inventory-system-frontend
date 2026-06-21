import { create } from "zustand";
import {
  getActiveFacilitiesByCity,
  getAllActiveFacilities,
  getAllFacilities,
  getAllFacilitiesForSession,
} from "../../../services/facilities/facilites.service";
import type { FacilitiesManagementState } from "./facilitiesManagement.types";

export const useFacilitiesManagementStore = create<FacilitiesManagementState>((set) => ({
  loading: false,
  error: null,
  facilities: [],

  getAllFacilities: async () => {
    set({ loading: true, error: null });

    try {
      const result = await getAllFacilities();
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao buscar todas as unidades";
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getAllActiveFacilities: async () => {
    set({ loading: true, error: null });

    try {
      const result = await getAllActiveFacilities();
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao buscar todas as unidades ativas";
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getActiveFacilitiesByCity: async (cityId: string) => {
    set({ loading: true, error: null });

    try {
      const result = await getActiveFacilitiesByCity(cityId);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao buscar unidades ativas por cidade";
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getAllFacilitiesForSession: async () => {
    set({ loading: true, error: null });

    try {
      const result = await getAllFacilitiesForSession();
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao buscar todas as unidades para sessão";
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
