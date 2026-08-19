import { notifications } from "@mantine/notifications";
import { create } from "zustand";
import * as manufacturersService from "../../../services/manufacturers";
import type {
  CreateManufacturerPayload,
  UpdateManufacturerPayload,
} from "../../../types/api.contracts";
import type { ManufacturersState } from "./manufacturers.types";

export const useManufacturersStore = create<ManufacturersState>((set, get) => ({
  manufacturers: [],
  total: 0,
  page: 1,
  limit: 1000,
  totalPages: 0,
  search: "",
  isActive: undefined,

  selectedDetail: null,
  loadingDetail: false,

  manufacturerItems: [],
  manufacturerItemsTotal: 0,
  manufacturerItemsPage: 1,
  manufacturerItemsTotalPages: 0,
  manufacturerItemsLoading: false,

  editingManufacturer: null,
  isFormModalOpen: false,
  saving: false,

  deleting: false,

  loading: false,
  error: null,

  fetchManufacturers: async () => {
    const { page, limit, search, isActive } = get();
    set({ loading: true, error: null });
    try {
      const result = await manufacturersService.getManufacturers(page, limit, search || undefined, isActive);
      set({
        manufacturers: result.data,
        total: result.total,
        totalPages: result.totalPages,
      });
    } catch {
      set({ error: "Não foi possível carregar os fabricantes. Tente novamente." });
    } finally {
      set({ loading: false });
    }
  },

  setPage: (page) => set({ page }),

  setSearch: (search) => set({ search, page: 1 }),

  setIsActive: (isActive) => set({ isActive, page: 1 }),

  fetchManufacturerDetail: async (id: string) => {
    set({ loadingDetail: true });
    try {
      const result = await manufacturersService.getManufacturerById(id);
      set({ selectedDetail: result });
    } catch {
      set({ selectedDetail: null });
    } finally {
      set({ loadingDetail: false });
    }
  },

  clearSelectedDetail: () => set({ selectedDetail: null }),

  fetchManufacturerItems: async (id: string, page = 1) => {
    const ITEMS_PAGE_LIMIT = 20;
    set({ manufacturerItemsLoading: true, manufacturerItemsPage: page });
    try {
      const result = await manufacturersService.getManufacturerItems(id, page, ITEMS_PAGE_LIMIT);
      set({
        manufacturerItems: result.data,
        manufacturerItemsTotal: result.total,
        manufacturerItemsTotalPages: result.totalPages,
      });
    } catch {
      set({ manufacturerItems: [] });
    } finally {
      set({ manufacturerItemsLoading: false });
    }
  },

  setManufacturerItemsPage: (page) => set({ manufacturerItemsPage: page }),

  clearManufacturerItems: () =>
    set({
      manufacturerItems: [],
      manufacturerItemsTotal: 0,
      manufacturerItemsPage: 1,
      manufacturerItemsTotalPages: 0,
    }),

  openCreateModal: () => set({ isFormModalOpen: true, editingManufacturer: null }),

  openEditModal: (manufacturer) =>
    set({ isFormModalOpen: true, editingManufacturer: manufacturer }),

  closeFormModal: () => set({ isFormModalOpen: false, editingManufacturer: null }),

  saveManufacturer: async (payload, id) => {
    set({ saving: true });
    try {
      if (id) {
        await manufacturersService.updateManufacturer(id, payload as UpdateManufacturerPayload);
        notifications.show({
          title: "Fabricante atualizado",
          message: "Fabricante atualizado com sucesso.",
          color: "var(--status-success)",
        });
      } else {
        await manufacturersService.createManufacturer(payload as CreateManufacturerPayload);
        notifications.show({
          title: "Fabricante cadastrado",
          message: "Fabricante cadastrado com sucesso.",
          color: "var(--status-success)",
        });
      }
      set({ isFormModalOpen: false, editingManufacturer: null, page: 1 });
      await get().fetchManufacturers();
    } finally {
      set({ saving: false });
    }
  },

  deleteManufacturer: async (id: string) => {
    set({ deleting: true });
    try {
      await manufacturersService.deleteManufacturer(id);
      notifications.show({
        title: "Fabricante removido",
        message: "Fabricante removido com sucesso.",
        color: "var(--status-success)",
      });
      await get().fetchManufacturers();
    } finally {
      set({ deleting: false });
    }
  },
}));
