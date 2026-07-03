import type { CreateUserPayload, ProfessionalDocumentType, RoleWithPermissionsOutput } from "./api.contracts";

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

export interface ProfessionalDocumentEntry {
  id: string;
  documentType: ProfessionalDocumentType | "";
  documentNumber: string;
  issuer?: string;
  issuerState?: string;
  issuedAt?: string;
  expiresAt?: string;
  notes?: string;
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

  hasProfessionalDocument: boolean;
  documentType: ProfessionalDocumentType | "";
  documentNumber: string;
  documentIssuer: string;
  documentIssuerState: string;
  documentIssuedAt: Date | null;
  documentExpiresAt: Date | null;
  documentNotes: string;
  professionalDocuments: ProfessionalDocumentEntry[];

  allocations: AllocationEntry[];
}

export type FieldErrors = Partial<Record<keyof CreateUserFormState, string>>;

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
  hasProfessionalDocument: false,
  documentType: "",
  documentNumber: "",
  documentIssuer: "",
  documentIssuerState: "",
  documentIssuedAt: null,
  documentExpiresAt: null,
  documentNotes: "",
  professionalDocuments: [],
  allocations: [],
};

export interface CreateUserFinalStepProps {
  payload: CreateUserPayload;
  allRoles: RoleWithPermissionsOutput[];
}
