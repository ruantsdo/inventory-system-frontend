import type { ID } from "./permissions";

export interface AuthUser {
  id: ID;
  fullName: string;
}

export type ProfessionalDocumentType =
  | "CRM"
  | "CRMV"
  | "CRO"
  | "COREN"
  | "CREFITO"
  | "CREF"
  | "CRP"
  | "CRA"
  | "CREA"
  | "CAU"
  | "OAB"
  | "RQE"
  | "OTHER";

export interface UserRolePayload {
  roleName: string;
  facilities?: string[];
  permissionNames?: string[];
}

export interface UserProfessionalDocumentPayload {
  documentType: ProfessionalDocumentType;
  documentNumber: string;
  issuerState?: string;
}

export interface UserData {
  fullName: string;
  email: string;
  cpf: string;
  birthDate: string;
  phone?: string;

  zipCode?: string;
  streetAddress?: string;
  number?: string;
  additionalInfo?: string;
  neighborhood?: string;
  addressCity?: string;
  state?: string;

  roles: UserRolePayload[];
  professionalDocuments?: UserProfessionalDocumentPayload[];
}
