import { z } from "zod";

export const forgotPasswordSchema = z.object({
	cpf: z
		.string()
		.min(1, "CPF é obrigatório")
		.transform((val) => val.replace(/\D/g, ""))
		.refine((val) => val.length === 11, "CPF deve conter 11 dígitos"),

	email: z.email("E-mail inválido").optional().or(z.literal("")),

	birthDate: z
		.string()
		.min(1, "Data de nascimento é obrigatória")
		.refine((val) => {
			const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
			return dateRegex.test(val);
		}, "Formato inválido (DD/MM/AAAA)"),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
