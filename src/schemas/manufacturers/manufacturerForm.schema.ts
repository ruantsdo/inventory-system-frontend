import { z } from "zod";

export const manufacturerFormSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório.").min(2, "Nome deve ter ao menos 2 caracteres."),
    tradeName: z.string().optional(),
    country: z.string().min(2, "País é obrigatório."),
    cnpj: z.string().optional(),
    regulatoryCode: z.string().optional(),
    website: z
      .string()
      .optional()
      .refine(
        (v) => {
          if (!v || v.trim() === "") return true;
          try {
            const urlToTest = v.startsWith("http://") || v.startsWith("https://") ? v : "https://" + v;
            new URL(urlToTest);
            return true;
          } catch {
            return false;
          }
        },
        {
          message: "Website inválido.",
        },
      ),
    state: z.string().optional(),
    cityId: z.string().optional(),
    zipCode: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    contactPerson: z.string().optional(),
    email: z
      .string()
      .optional()
      .refine((v) => !v || /^[^s@]+@[^s@]+.[^s@]+$/.test(v), {
        message: "E-mail inválido.",
      }),
    phone: z
      .string()
      .optional()
      .refine(
        (v) => {
          if (!v) return true;
          const digits = v.replace(/\D/g, "");
          return digits.length === 0 || digits.length >= 10;
        },
        {
          message: "Telefone inválido.",
        },
      ),
    isActive: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.country === "BR") {
      const cnpjDigits = (data.cnpj || "").replace(/\D/g, "");
      if (!data.cnpj || cnpjDigits.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CNPJ é obrigatório para empresas no Brasil.",
          path: ["cnpj"],
        });
      } else if (cnpjDigits.length !== 14) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CNPJ deve ter 14 dígitos.",
          path: ["cnpj"],
        });
      }
    }
  });

export type ManufacturerFormValues = z.infer<typeof manufacturerFormSchema>;
export type ManufacturerFormRequest = ManufacturerFormValues;
