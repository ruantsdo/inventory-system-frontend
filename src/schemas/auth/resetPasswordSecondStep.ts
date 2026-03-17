import { z } from "zod";

export const resetPasswordSecondStepSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "A nova senha deve ter no mínimo 6 caracteres")
      .refine((val) => /\d/.test(val), {
        message: "A senha deve conter pelo menos 1 número",
      }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type ResetPasswordSecondStepRequest = z.infer<typeof resetPasswordSecondStepSchema>;
