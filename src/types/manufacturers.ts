import type {
  CreateManufacturerPayload,
  ManufacturerItemOutput,
  ManufacturerOutput,
  PaginatedManufacturerItemsOutput,
  PaginatedManufacturersOutput,
  UpdateManufacturerPayload,
} from "./api.contracts";

export interface ManufacturerFormValues {
  name: string;
  cnpj: string;
  state?: string;
  cityId?: string;
  contactPerson: string;
  email: string;
  phone: string;
}

export type {
  CreateManufacturerPayload,
  UpdateManufacturerPayload,
  ManufacturerOutput,
  PaginatedManufacturersOutput,
  ManufacturerItemOutput,
  PaginatedManufacturerItemsOutput,
};
