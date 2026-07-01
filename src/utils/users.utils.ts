import type {
  CreateUserPayload,
  UserProfessionalDocumentPayload,
} from "../types/api.contracts";
import type { CreateUserFormState } from "../types/createUser";

export function buildUserPayload(form: CreateUserFormState): CreateUserPayload {
  const profDocs: UserProfessionalDocumentPayload[] =
    form.hasProfessionalDocument && form.documentType
      ? [{ documentType: form.documentType, documentNumber: form.documentNumber }]
      : [];

  return {
    fullName: form.fullName,
    email: form.email,
    cpf: form.cpf.replace(/\D/g, ""),
    birthDate: form.birthDate,
    phone: form.phone || undefined,
    cityId: form.cityId || undefined,
    zipCode: form.zipCode || undefined,
    streetAddress: form.streetAddress || undefined,
    number: form.addressNumber || undefined,
    additionalInfo: form.additionalInfo || undefined,
    neighborhood: form.neighborhood || undefined,
    addressCity: form.addressCity || undefined,
    state: form.addressState || undefined,
    roles: form.allocations.map((a) => ({
      roleId: a.roleId,
      facilities: a.facilityIds,
      permissionIds: a.permissionIds,
    })),
    professionalDocuments: profDocs.length > 0 ? profDocs : undefined,
  };
}
