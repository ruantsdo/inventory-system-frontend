import { z } from "zod";

export const loginSchema = z.object({
	cpf: z
		.string()
		.min(1, "CPF obrigatório")
		.transform((val) => val.replace(/\D/g, ""))
		.refine((val) => val.length === 11, {
			message: "CPF incompleto",
		}),

	password: z.string().min(4, "Senha obrigatória"),
	rememberMe: z.boolean(),
});

export type LoginRequest = z.infer<typeof loginSchema>;
