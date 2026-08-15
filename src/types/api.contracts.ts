import type { ID } from "./permissions";

export interface CityOutput {
  id: ID;
  name: string;
  state: string | null;
  country: string;
}

export interface FacilityOutput {
  id: ID;
  name: string;
  description: string | null;
  cnes: string | null;
  phone: string | null;
  isActive: boolean;
}

export interface FacilityForSession {
  id: ID;
  name: string;
  isDefault?: boolean;
}

export type PermissionScopeMode = "GLOBAL" | "FACILITY" | "OWN";

export type UserRoleScopeMode = "GLOBAL" | "FACILITY_SET";

export interface PermissionOutput {
  id: ID;
  name: string;
  displayName: string;
  description: string | null;
  scopeMode: PermissionScopeMode;
}

export interface RoleWithPermissionsOutput {
  id: ID;
  name: string;
  displayName: string;
  description: string | null;
  category: string;
  governanceLevel: string;
  permissions: PermissionOutput[];
}

export type RoleCategory = "FUNCTIONAL" | "ADMINISTRATIVE";

export type GovernanceLevel = "ROOT" | "SUPER_ADMIN" | "SYSTEM_ADMIN" | "MANAGER";

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
  roleId: ID;
  facilities: ID[];
  permissionIds: ID[];
}

export interface UserProfessionalDocumentPayload {
  documentType: ProfessionalDocumentType;
  documentNumber: string;
  issuer?: string;
  issuerState?: string;
  issuedAt?: string;
  expiresAt?: string;
  notes?: string;
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  cpf: string;
  birthDate: string;
  phone?: string | undefined;

  zipCode: string;
  streetAddress: string;
  number?: string | undefined;
  additionalInfo?: string | undefined;
  neighborhood: string;
  addressCity: string;
  state: string;

  roles: UserRolePayload[];
  professionalDocuments?: UserProfessionalDocumentPayload[] | undefined;
}

export interface ResendActivationPayload {
  cpf: string;
  email: string;
  birthDate: string;
}

export interface ConfirmActivationPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface MessageResponse {
  message: string;
}

export interface CreateUserResponse {
  id: ID;
  message: string;
}

export interface UpdateUserPayload {
  fullName: string;
  email: string;
  cpf: string;
  birthDate: string;
  phone?: string | undefined;

  zipCode: string;
  streetAddress: string;
  number?: string | undefined;
  additionalInfo?: string | undefined;
  neighborhood: string;
  addressCity: string;
  state: string;

  roles: UserRolePayload[];
  professionalDocuments?: UserProfessionalDocumentPayload[] | undefined;
}

export interface UserRoleEditDetail {
  roleId: string;
  roleName: string;
  facilities: string[];
  permissionNames?: string[] | undefined;
  facilityDetails?:
    | { id: string; name: string; cityId?: string | undefined; cityName?: string | undefined }[]
    | undefined;
  permissionDetails?: { id: string; name: string; displayName: string }[] | undefined;
}

export interface UserEditData {
  fullName: string;
  email: string;
  cpf: string;
  birthDate: string;
  phone?: string | undefined;

  zipCode?: string | undefined;
  streetAddress?: string | undefined;
  number?: string | undefined;
  additionalInfo?: string | undefined;
  neighborhood?: string | undefined;
  addressCity?: string | undefined;
  state?: string | undefined;

  roles: UserRoleEditDetail[];
  professionalDocuments?: UserProfessionalDocumentPayload[] | undefined;
}

// AUDITS
export interface AuditOutput {
  id: string;
  origin: string;
  createdAt: string;
  action: string;
  category: string;
  severity: string;
  facilityName: string;
  performedByUserName: string;
}

export interface DetailAuditOutput extends AuditOutput {
  schemaVersion: string;
  entity: string;
  entityId: string;
  entityName: string;
  performedByUserId: string;
  performedByUserEmail: string;
  performedByRole: string;
  facilityId: string;

  ip: string;
  userAgent: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
}

// MANUFACTURERS

export interface ManufacturerContactPayload {
  email?: string | undefined;
  phone?: string | undefined;
  contactPerson?: string | undefined;
}

export interface CreateManufacturerPayload {
  name: string;
  cnpj?: string | undefined;
  contact?: ManufacturerContactPayload | undefined;
  cityId?: string | undefined;
}

export interface UpdateManufacturerPayload {
  name?: string | undefined;
  cnpj?: string | undefined;
  contact?: ManufacturerContactPayload | undefined;
  cityId?: string | undefined;
}

export interface ManufacturerOutput {
  id: ID;
  name: string;
  cnpj: string | null;
  contact: ManufacturerContactPayload | null;
  cityId: string | null;
  city?: { id: ID; name: string; state: string | null } | null;
  createdByUserId?: string | null;
  updatedByUserId?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: { items: number; batches: number };
}

export interface PaginatedManufacturersOutput {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: ManufacturerOutput[];
}

export interface ManufacturerItemOutput {
  id: ID;
  identifier: string;
  gtin: string | null;
  name: string;
  description: string | null;
  unitOfMeasurement: string;
  unitSize?: number | string | null | undefined;
  isActive: boolean;
  itemTypeId: string | null;
  itemType?: { id: ID; slug: string; title: string } | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PaginatedManufacturerItemsOutput {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: ManufacturerItemOutput[];
}

