import { z } from "zod";

export const resetPasswordSecondStepSchema = z
  .object({
    newPassword: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type resetPasswordSecondStepRequest = z.infer<typeof resetPasswordSecondStepSchema>;
