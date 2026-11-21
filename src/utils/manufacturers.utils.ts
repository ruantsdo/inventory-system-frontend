import type {
  CreateManufacturerPayload,
  ManufacturerOutput,
  UpdateManufacturerPayload,
} from "../types/api.contracts";
import type { ManufacturerFormValues } from "../types/manufacturers";

function normalizeWebsite(raw?: string | null): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}

export function buildManufacturerPayload(
  form: ManufacturerFormValues,
): CreateManufacturerPayload | UpdateManufacturerPayload {
  const contactPerson = form.contactPerson?.trim();
  const email = form.email?.trim();
  const phone = form.phone?.trim();
  const hasContact = Boolean(contactPerson || email || phone);

  const zipCode = form.zipCode?.trim();
  const street = form.street?.trim();
  const number = form.number?.trim();
  const complement = form.complement?.trim();
  const neighborhood = form.neighborhood?.trim();
  const hasAddress = Boolean(zipCode || street || number || complement || neighborhood);

  const website = normalizeWebsite(form.website);

  return {
    name: form.name.trim(),
    tradeName: form.tradeName?.trim() || undefined,
    country: form.country || "BR",
    cnpj: form.cnpj ? form.cnpj.replace(/\D/g, "") : undefined,
    regulatoryCode: form.regulatoryCode?.trim() || undefined,
    website: website || undefined,
    cityId: form.cityId || undefined,
    isActive: form.isActive !== undefined ? form.isActive : true,
    contact: hasContact
      ? {
          contactPerson: contactPerson || undefined,
          email: email || undefined,
          phone: phone || undefined,
        }
      : undefined,
    address: hasAddress
      ? {
          zipCode: zipCode || undefined,
          street: street || undefined,
          number: number || undefined,
          complement: complement || undefined,
          neighborhood: neighborhood || undefined,
        }
      : undefined,
  };
}

function normalizeManufacturerFields(data: {
  name?: string | null;
  tradeName?: string | null;
  country?: string | null;
  cnpj?: string | null;
  regulatoryCode?: string | null;
  website?: string | null;
  cityId?: string | null;
  isActive?: boolean | null;
  zipCode?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
}) {
  return {
    name: (data.name ?? "").trim(),
    tradeName: (data.tradeName ?? "").trim(),
    country: data.country || "BR",
    cnpj: (data.cnpj ?? "").replace(/\D/g, ""),
    regulatoryCode: (data.regulatoryCode ?? "").trim(),
    website: normalizeWebsite(data.website),
    cityId: data.cityId ?? "",
    isActive: data.isActive !== undefined && data.isActive !== null ? data.isActive : true,
    zipCode: (data.zipCode ?? "").replace(/\D/g, ""),
    street: (data.street ?? "").trim(),
    number: (data.number ?? "").trim(),
    complement: (data.complement ?? "").trim(),
    neighborhood: (data.neighborhood ?? "").trim(),
    contactPerson: (data.contactPerson ?? "").trim(),
    email: (data.email ?? "").trim(),
    phone: (data.phone ?? "").replace(/\D/g, ""),
  };
}

export function isManufacturerFormUnchanged(
  values: ManufacturerFormValues,
  editing: ManufacturerOutput,
): boolean {
  const v = normalizeManufacturerFields(values);
  const e = normalizeManufacturerFields({
    name: editing.name,
    tradeName: editing.tradeName,
    country: editing.country,
    cnpj: editing.cnpj,
    regulatoryCode: editing.regulatoryCode,
    website: editing.website,
    cityId: editing.cityId,
    isActive: editing.isActive,
    zipCode: editing.address?.zipCode,
    street: editing.address?.street,
    number: editing.address?.number,
    complement: editing.address?.complement,
    neighborhood: editing.address?.neighborhood,
    contactPerson: editing.contact?.contactPerson,
    email: editing.contact?.email,
    phone: editing.contact?.phone,
  });

  return JSON.stringify(v) === JSON.stringify(e);
}
