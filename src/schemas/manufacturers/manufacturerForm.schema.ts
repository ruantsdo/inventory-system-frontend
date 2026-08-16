import { z } from "zod";

export const manufacturerFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório.").min(2, "Nome deve ter ao menos 2 caracteres."),
  cnpj: z
    .string()
    .min(1, "CNPJ é obrigatório.")
    .refine((v) => v.replace(/\D/g, "").length === 14, {
      message: "CNPJ inválido.",
    }),
  state: z.string().optional(),
  cityId: z.string().optional(),
  contactPerson: z.string(),
  email: z.string().refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
    message: "E-mail inválido.",
  }),
  phone: z.string().refine(
    (v) => {
      if (!v) return true;
      const digits = v.replace(/\D/g, "");
      return digits.length === 0 || digits.length >= 10;
    },
    {
      message: "Telefone inválido.",
    },
  ),
});

export type ManufacturerFormValues = z.infer<typeof manufacturerFormSchema>;
export type ManufacturerFormRequest = ManufacturerFormValues;
