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

  getUserDataByID: async (targetId) => {
    set({ loading: true, error: null });

    try {
      const result = await userServices.getUserDataByID(targetId);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao buscar usuário.";
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getUserDataForEdit: async (targetId) => {
    set({ loading: true, error: null });

    try {
      const result = await userServices.getUserDataForEdit(targetId);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao buscar usuário.";
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateUser: async (targetId, payload) => {
    set({ loading: true, error: null });

    try {
      const result = await userServices.updateUser(targetId, payload);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar usuário.";
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteUser: async (targetId) => {
    set({ loading: true, error: null });

    try {
      const result = await userServices.deleteUser(targetId);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao deletar usuário.";
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  reactivateUser: async (targetId) => {
    set({ loading: true, error: null });

    try {
      const result = await userServices.reactivateUser(targetId);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao reativar usuário.";
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deactivateUser: async (targetId) => {
    set({ loading: true, error: null });

    try {
      const result = await userServices.deactivateUser(targetId);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao desativar usuário.";
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
