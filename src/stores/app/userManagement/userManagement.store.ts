import { create } from "zustand";
import { createUser as createUserService } from "../../../services/users";
import type { UserManagementState } from "./userManagement.types";

export const useUserManagementStore = create<UserManagementState>((set) => ({
  loading: false,
  error: null,

  createUser: async (payload) => {
    set({ loading: true, error: null });

    try {
      const result = await createUserService(payload);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao cadastrar usuário.";
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
