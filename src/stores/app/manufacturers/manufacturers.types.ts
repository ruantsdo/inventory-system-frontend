import type {
  CreateManufacturerPayload,
  ManufacturerItemOutput,
  ManufacturerOutput,
  UpdateManufacturerPayload,
} from "../../../types/api.contracts";

export interface ManufacturersState {
  manufacturers: ManufacturerOutput[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  search: string;

  selectedDetail: ManufacturerOutput | null;
  loadingDetail: boolean;

  manufacturerItems: ManufacturerItemOutput[];
  manufacturerItemsTotal: number;
  manufacturerItemsPage: number;
  manufacturerItemsTotalPages: number;
  manufacturerItemsLoading: boolean;

  editingManufacturer: ManufacturerOutput | null;
  isFormModalOpen: boolean;
  saving: boolean;

  deleting: boolean;

  loading: boolean;
  error: string | null;

  fetchManufacturers: () => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;

  fetchManufacturerDetail: (id: string) => Promise<void>;
  clearSelectedDetail: () => void;

  fetchManufacturerItems: (id: string, page?: number) => Promise<void>;
  setManufacturerItemsPage: (page: number) => void;
  clearManufacturerItems: () => void;

  openCreateModal: () => void;
  openEditModal: (manufacturer: ManufacturerOutput) => void;
  closeFormModal: () => void;

  saveManufacturer: (
    payload: CreateManufacturerPayload | UpdateManufacturerPayload,
    id?: string,
  ) => Promise<void>;

  deleteManufacturer: (id: string) => Promise<void>;
}

