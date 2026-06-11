import { z } from "zod";

export const createUserStep1Schema = z
  .object({
    fullName: z.string().min(1, "Nome completo é obrigatório."),
    birthDate: z.string().min(1, "Data de nascimento é obrigatória."),
    cpf: z.string().refine((v) => v.replace(/\D/g, "").length === 11, { message: "CPF inválido." }),
    email: z.email("E-mail inválido."),
    zipCode: z.string().min(1, "CEP é obrigatório."),
    streetAddress: z.string().min(1, "Logradouro é obrigatório."),
    neighborhood: z.string().min(1, "Bairro é obrigatório."),
    addressCity: z.string().min(1, "Cidade é obrigatória."),
    addressState: z.string().min(1, "UF é obrigatória."),
    phone: z.string(),
    addressNumber: z.string(),
    additionalInfo: z.string(),
    cityId: z.string(),
    hasProfessionalDocument: z.boolean(),
    documentType: z.string() as z.ZodType<import("../../types/api.contracts").ProfessionalDocumentType | "">,
    documentNumber: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.hasProfessionalDocument) {
      if (!data.documentType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["documentType"],
          message: "Selecione o tipo de documento.",
        });
      }
      if (!data.documentNumber.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["documentNumber"],
          message: "Informe o número do documento.",
        });
      }
    }
  });

export type CreateUserStep1Request = z.infer<typeof createUserStep1Schema>;
