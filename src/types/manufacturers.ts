import type { ManufacturerFormValues } from "../schemas/manufacturers";
import type {
  CreateManufacturerPayload,
  ManufacturerAddressPayload,
  ManufacturerContactPayload,
  ManufacturerItemOutput,
  ManufacturerOutput,
  PaginatedManufacturerItemsOutput,
  PaginatedManufacturersOutput,
  UpdateManufacturerPayload,
} from "./api.contracts";

export const EMPTY_MANUFACTURER_FORM: ManufacturerFormValues = {
  name: "",
  tradeName: "",
  country: "BR",
  cnpj: "",
  regulatoryCode: "",
  website: "",
  state: "",
  cityId: "",
  zipCode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  contactPerson: "",
  email: "",
  phone: "",
  isActive: true,
};

export type {
  ManufacturerFormValues,
  ManufacturerAddressPayload,
  ManufacturerContactPayload,
  CreateManufacturerPayload,
  UpdateManufacturerPayload,
  ManufacturerOutput,
  PaginatedManufacturersOutput,
  ManufacturerItemOutput,
  PaginatedManufacturerItemsOutput,
};
