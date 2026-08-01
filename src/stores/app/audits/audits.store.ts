import { create } from "zustand";
import * as auditsService from "../../../services/audits";
import type { AuditOutput, DetailAuditOutput } from "../../../types/api.contracts";
import type { AuditFilterType, AuditsState } from "./audits.types";

export const useAuditsStore = create<AuditsState>((set, get) => ({
  audits: [],
  page: 1,
  pageSize: 1000,
  filterType: "none",
  filterValue: "",
  selectedDetail: null,
  loading: false,
  loadingDetail: false,
  error: null,

  fetchAudits: async () => {
    const { page, filterType, filterValue } = get();
    set({ loading: true, error: null });

    try {
      let result: AuditOutput[];

      if (filterType === "action") {
        result = await auditsService.getAuditsByAction(page, filterValue);
      } else if (filterType === "category") {
        result = await auditsService.getAuditsByCategory(page, filterValue);
      } else if (filterType === "severity") {
        result = await auditsService.getAuditsBySeverity(page, filterValue);
      } else {
        result = await auditsService.getAudits(page);
      }

      set({ audits: result });
    } catch {
      set({ error: "Não foi possível carregar os registros de auditoria. Tente novamente." });
    } finally {
      set({ loading: false });
    }
  },

  setPage: (page) => {
    set({ page });
  },

  setFilter: (type: AuditFilterType, value: string) => {
    set({ filterType: type, filterValue: value, page: 1 });
  },

  clearFilters: () => {
    set({ filterType: "none", filterValue: "", page: 1 });
  },

  fetchAuditDetail: async (id: string) => {
    set({ loadingDetail: true });

    try {
      const result: DetailAuditOutput = await auditsService.getAuditDetail(id);
      set({ selectedDetail: result });
    } catch {
      set({ selectedDetail: null });
    } finally {
      set({ loadingDetail: false });
    }
  },

  clearSelectedDetail: () => {
    set({ selectedDetail: null });
  },
}));
