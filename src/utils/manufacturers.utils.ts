import type {
  CreateManufacturerPayload,
  ManufacturerOutput,
  UpdateManufacturerPayload,
} from "../types/api.contracts";
import type { ManufacturerFormValues } from "../types/manufacturers";

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

  return {
    name: form.name.trim(),
    tradeName: form.tradeName?.trim() || undefined,
    country: form.country || "BR",
    cnpj: form.cnpj ? form.cnpj.replace(/\D/g, "") : undefined,
    regulatoryCode: form.regulatoryCode?.trim() || undefined,
    website: (() => {
      const raw = form.website?.trim();
      if (!raw) return undefined;
      if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
      return `https://${raw}`;
    })(),
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

export function isManufacturerFormUnchanged(
  values: ManufacturerFormValues,
  editing: ManufacturerOutput,
): boolean {
  const currentName = values.name.trim();
  const currentTradeName = (values.tradeName || "").trim();
  const currentCountry = values.country || "BR";
  const currentCnpj = (values.cnpj || "").replace(/\D/g, "");
  const currentRegulatoryCode = (values.regulatoryCode || "").trim();
  const currentWebsite = (values.website || "").trim();
  const currentCityId = values.cityId || "";
  const currentIsActive = values.isActive !== undefined ? values.isActive : true;

  const currentZipCode = (values.zipCode || "").replace(/\D/g, "");
  const currentStreet = (values.street || "").trim();
  const currentNumber = (values.number || "").trim();
  const currentComplement = (values.complement || "").trim();
  const currentNeighborhood = (values.neighborhood || "").trim();

  const currentContactPerson = (values.contactPerson || "").trim();
  const currentEmail = (values.email || "").trim();
  const currentPhone = (values.phone || "").replace(/\D/g, "");

  const originalName = (editing.name ?? "").trim();
  const originalTradeName = (editing.tradeName ?? "").trim();
  const originalCountry = editing.country || "BR";
  const originalCnpj = (editing.cnpj ?? "").replace(/\D/g, "");
  const originalRegulatoryCode = (editing.regulatoryCode ?? "").trim();
  const originalWebsite = (editing.website ?? "").trim();
  const originalCityId = editing.cityId ?? "";
  const originalIsActive = editing.isActive ?? true;

  const originalZipCode = (editing.address?.zipCode ?? "").replace(/\D/g, "");
  const originalStreet = (editing.address?.street ?? "").trim();
  const originalNumber = (editing.address?.number ?? "").trim();
  const originalComplement = (editing.address?.complement ?? "").trim();
  const originalNeighborhood = (editing.address?.neighborhood ?? "").trim();

  const originalContactPerson = (editing.contact?.contactPerson ?? "").trim();
  const originalEmail = (editing.contact?.email ?? "").trim();
  const originalPhone = (editing.contact?.phone ?? "").replace(/\D/g, "");

  return (
    currentName === originalName &&
    currentTradeName === originalTradeName &&
    currentCountry === originalCountry &&
    currentCnpj === originalCnpj &&
    currentRegulatoryCode === originalRegulatoryCode &&
    currentWebsite === originalWebsite &&
    currentCityId === originalCityId &&
    currentIsActive === originalIsActive &&
    currentZipCode === originalZipCode &&
    currentStreet === originalStreet &&
    currentNumber === originalNumber &&
    currentComplement === originalComplement &&
    currentNeighborhood === originalNeighborhood &&
    currentContactPerson === originalContactPerson &&
    currentEmail === originalEmail &&
    currentPhone === originalPhone
  );
}
