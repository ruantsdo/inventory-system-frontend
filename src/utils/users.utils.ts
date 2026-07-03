import type {
  CreateUserPayload,
  ProfessionalDocumentType,
  UserProfessionalDocumentPayload,
} from "../types/api.contracts";
import type { CreateUserFormState } from "../types/createUser";

export function buildUserPayload(form: CreateUserFormState): CreateUserPayload {
  const profDocs: UserProfessionalDocumentPayload[] = form.hasProfessionalDocument
    ? form.professionalDocuments.map((doc) => ({
        documentType: doc.documentType as ProfessionalDocumentType,
        documentNumber: doc.documentNumber,
        issuer: doc.issuer || undefined,
        issuerState: doc.issuerState || undefined,
        issuedAt: doc.issuedAt || undefined,
        expiresAt: doc.expiresAt || undefined,
        notes: doc.notes || undefined,
      }))
    : [];

  return {
    fullName: form.fullName,
    email: form.email,
    cpf: form.cpf.replace(/\D/g, ""),
    birthDate: form.birthDate,
    phone: form.phone || undefined,
    zipCode: form.zipCode,
    streetAddress: form.streetAddress,
    number: form.addressNumber || undefined,
    additionalInfo: form.additionalInfo || undefined,
    neighborhood: form.neighborhood,
    addressCity: form.addressCity,
    state: form.addressState,
    roles: form.allocations.map((a) => ({
      roleId: a.roleId,
      facilities: a.facilityIds,
      permissionIds: a.permissionIds,
    })),
    professionalDocuments: profDocs.length > 0 ? profDocs : undefined,
  };
}
