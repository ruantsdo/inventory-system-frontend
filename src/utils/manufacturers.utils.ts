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

  return {
    name: form.name.trim(),
    cnpj: form.cnpj ? form.cnpj.replace(/\D/g, "") : undefined,
    cityId: form.cityId || undefined,
    contact: hasContact
      ? {
          contactPerson: contactPerson || undefined,
          email: email || undefined,
          phone: phone || undefined,
        }
      : undefined,
  };
}

export function isManufacturerFormUnchanged(
  values: ManufacturerFormValues,
  editing: ManufacturerOutput,
): boolean {
  const currentName = values.name.trim();
  const currentCnpj = values.cnpj.replace(/\D/g, "");
  const currentCityId = values.cityId || "";
  const currentContactPerson = (values.contactPerson || "").trim();
  const currentEmail = (values.email || "").trim();
  const currentPhone = (values.phone || "").replace(/\D/g, "");

  const originalName = (editing.name ?? "").trim();
  const originalCnpj = (editing.cnpj ?? "").replace(/\D/g, "");
  const originalCityId = editing.cityId ?? "";
  const originalContactPerson = (editing.contact?.contactPerson ?? "").trim();
  const originalEmail = (editing.contact?.email ?? "").trim();
  const originalPhone = (editing.contact?.phone ?? "").replace(/\D/g, "");

  return (
    currentName === originalName &&
    currentCnpj === originalCnpj &&
    currentCityId === originalCityId &&
    currentContactPerson === originalContactPerson &&
    currentEmail === originalEmail &&
    currentPhone === originalPhone
  );
}
