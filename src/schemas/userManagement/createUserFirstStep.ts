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
    hasProfessionalDocument: z.boolean(),
    documentType: z.string().optional(),
    documentNumber: z.string().optional(),
    documentIssuer: z.string().optional(),
    documentIssuerState: z.string().optional(),
    documentIssuedAt: z.any().optional(),
    documentExpiresAt: z.any().optional(),
    documentNotes: z.string().optional(),
    professionalDocuments: z
      .array(
        z.object({
          id: z.string(),
          documentType: z.string().min(1, "Selecione o tipo do documento."),
          documentNumber: z.string().min(1, "Informe o número do documento."),
          issuer: z.string().optional(),
          issuerState: z.string().optional(),
          issuedAt: z.string().optional(),
          expiresAt: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .default([]),
  })
  .superRefine((data, ctx) => {
    if (data.hasProfessionalDocument) {
      if (!data.professionalDocuments || data.professionalDocuments.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["professionalDocuments"],
          message: "Adicione pelo menos um documento especial para continuar.",
        });
      }
    }
  });

export type CreateUserStep1Request = z.infer<typeof createUserStep1Schema>;
