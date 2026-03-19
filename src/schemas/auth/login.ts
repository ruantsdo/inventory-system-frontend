import { z } from "zod";

export const loginSchema = z.object({
  credential: z
    .string()
    .min(1, "CPF obrigatório")
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length === 11, {
      message: "CPF incompleto",
    }),

  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  rememberMe: z.boolean(),
});

export type LoginRequest = z.infer<typeof loginSchema>;
