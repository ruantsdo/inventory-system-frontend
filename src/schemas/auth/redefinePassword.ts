import { z } from "zod";

export const redefinePasswordSchema = z
  .object({
    newPassword: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres"),

    confirmPassword: z.string().min(1, "Confirme sua senha"),

    confirmCode: z.string().min(4, "Informe o código de verificação"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RedefinePasswordRequest = z.infer<typeof redefinePasswordSchema>;
