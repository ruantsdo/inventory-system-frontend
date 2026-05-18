import { create } from "zustand";
import type { UtilsState } from "./utils.types";

export const useUtilsStore = create<UtilsState>((set) => ({
  cepIsLoading: false,
  cepError: null,

  fetchCep: async (cep: string) => {
    set({ cepIsLoading: true, cepError: null });
    try {
      const raw = cep.replace(/\D/g, "");
      if (raw.length !== 8) throw new Error("CEP inválido");

      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      const data = await res.json();

      if (data.erro) throw new Error("CEP não encontrado");

      return data;
    } catch (error) {
      set({ cepError: error instanceof Error ? error.message : "Erro ao buscar CEP" });
    } finally {
      set({ cepIsLoading: false });
    }
  },
}));
