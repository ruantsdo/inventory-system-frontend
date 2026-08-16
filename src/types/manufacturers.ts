import type { ManufacturerFormValues } from "../schemas/manufacturers";
import type {
  CreateManufacturerPayload,
  ManufacturerItemOutput,
  ManufacturerOutput,
  PaginatedManufacturerItemsOutput,
  PaginatedManufacturersOutput,
  UpdateManufacturerPayload,
} from "./api.contracts";

export const EMPTY_MANUFACTURER_FORM: ManufacturerFormValues = {
  name: "",
  cnpj: "",
  state: "",
  cityId: "",
  contactPerson: "",
  email: "",
  phone: "",
};

export type {
  ManufacturerFormValues,
  CreateManufacturerPayload,
  UpdateManufacturerPayload,
  ManufacturerOutput,
  PaginatedManufacturersOutput,
  ManufacturerItemOutput,
  PaginatedManufacturerItemsOutput,
};
