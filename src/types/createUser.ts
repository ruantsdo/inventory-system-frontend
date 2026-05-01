import type { ProfessionalDocumentType } from "./api.contracts";

export interface AllocationEntry {
  id: string;
  roleId: string;
  roleDisplayName: string;
  facilityIds: string[];
  facilityNames: string[];
  cityId: string;
  cityName: string;

  permissionIds: string[];
}

export interface CreateUserFormState {
  fullName: string;
  birthDate: string;
  cpf: string;
  phone: string;
  email: string;

  zipCode: string;
  streetAddress: string;
  addressNumber: string;
  additionalInfo: string;
  neighborhood: string;
  addressCity: string;
  addressState: string;

  cityId: string;

  hasProfessionalDocument: boolean;
  documentType: ProfessionalDocumentType | "";
  documentNumber: string;

  allocations: AllocationEntry[];
}

export const EMPTY_FORM_STATE: CreateUserFormState = {
  fullName: "",
  birthDate: "",
  cpf: "",
  phone: "",
  email: "",
  zipCode: "",
  streetAddress: "",
  addressNumber: "",
  additionalInfo: "",
  neighborhood: "",
  addressCity: "",
  addressState: "",
  cityId: "",
  hasProfessionalDocument: false,
  documentType: "",
  documentNumber: "",
  allocations: [],
};
