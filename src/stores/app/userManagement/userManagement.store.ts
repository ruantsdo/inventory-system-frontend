import { create } from "zustand";
import * as userServices from "../../../services/users";
import type { UserManagementState } from "./userManagement.types";

export const useUserManagementStore = create<UserManagementState>((set) => ({
  loading: false,
  error: null,

  createUser: async (payload) => {
    set({ loading: true, error: null });

    try {
      const result = await userServices.createUser(payload);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao cadastrar usuário.";
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getUserDataByID: async (TargetId) => {
    set({ loading: true, error: null });

    try {
      const result = await userServices.getUserDataByID(TargetId);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao buscar usuário.";
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getUserDataByCpf: async (targetCpf) => {
    set({ loading: true, error: null });

    try {
      const result = await userServices.getUserDataByCpf(targetCpf);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao buscar usuário.";
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getUserDataByEmail: async (targetEmail) => {
    set({ loading: true, error: null });

    try {
      const result = await userServices.getUserDataByEmail(targetEmail);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao buscar usuário.";
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getSelfData: async () => {
    set({ loading: true, error: null });

    try {
      const result = await userServices.getSelfData();
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao buscar usuário.";
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  resetState: () => {
    set({ loading: false, error: null });
  },
}));
