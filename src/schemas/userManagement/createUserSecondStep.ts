import { z } from "zod";

export const createUserStep2Schema = z.object({
  allocations: z
    .array(
      z.object({
        id: z.string(),
        roleId: z.string().min(1, "Cargo é obrigatório."),
        roleDisplayName: z.string(),
        facilityIds: z.array(z.string()).min(1, "Selecione pelo menos uma unidade."),
        facilityNames: z.array(z.string()),
        cityId: z.string().min(1, "Cidade é obrigatória."),
        cityName: z.string(),
        permissionIds: z.array(z.string()),
      })
    )
    .min(1, "Adicione pelo menos uma alocação para o usuário."),
});

export type CreateUserStep2Request = z.infer<typeof createUserStep2Schema>;
