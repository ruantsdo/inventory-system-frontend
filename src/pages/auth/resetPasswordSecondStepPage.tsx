import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Container, Paper, PasswordInput, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { ThemeToggle } from "../../components";
import {
  type ResetPasswordSecondStepRequest,
  resetPasswordSecondStepSchema,
} from "../../schemas/auth";
import { useAuthStore } from "../../stores/auth";

export function ResetPasswordSecondStepPage() {
  const navigate = useNavigate();
  const { resetPasswordSecondStep, confirmActivation, isLoading } = useAuthStore();
  const { token: pathToken } = useParams();
  const [searchParams] = useSearchParams();
  const token = pathToken || searchParams.get("token") || undefined;
  const [lockSubmit, setLockSubmit] = useState(false);

  const isActivation = window.location.pathname.includes("/activate");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSecondStepRequest>({
    resolver: zodResolver(resetPasswordSecondStepSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordSecondStepRequest) => {
    if (!token) {
      notifications.show({
        title: "Link inválido",
        message: isActivation
          ? "Para ativar sua conta, use o link de ativação enviado para o seu e-mail."
          : "Para redefinir sua senha, use o link de redefinição enviado para o seu e-mail.",
        color: "var(--status-warning)",
        position: "bottom-center",
        autoClose: 10000,
        withCloseButton: true,
      });

      notifications.show({
        message: isActivation
          ? "Se o problema persistir, entre em contato com o suporte."
          : "Se o problema persistir, você pode redefinir sua senha através da tela de login.",
        color: "var(--status-info)",
        position: "bottom-center",
        autoClose: 10000,
        withCloseButton: true,
      });

      return;
    }

    const success = isActivation
      ? await confirmActivation(data, token)
      : await resetPasswordSecondStep(data, token);

    if (success) {
      setLockSubmit(true);

      const notificationId = notifications.show({
        title: isActivation ? "Conta ativada!" : "Senha redefinida!",
        message: "Vamos redirecioná-lo para a página de login.",
        color: "var(--status-success)",
        position: "bottom-center",
        autoClose: false,
      });

      setTimeout(() => {
        navigate("/login");

        notifications.update({
          id: notificationId,
          title: isActivation ? "Conta pronta!" : "Senha atualizada!",
          message: isActivation
            ? "Agora você já pode fazer login na sua conta!"
            : "Agora você pode fazer login com sua nova senha!",
          color: "var(--status-success)",
          position: "bottom-center",
          autoClose: 10000,
        });
      }, 5000);
    }
  };

  return (
    <Box className="bg-background h-screen w-screen relative">
      <Box pos="absolute" top={20} right={20}>
        <ThemeToggle iconOnly />
      </Box>

      <Container
        size="xs"
        h="100vh"
        display="flex"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <Paper shadow="lg" radius="lg" w="100%" withBorder className="bg-surface border-border">
          <Box p="xl">
            <Stack align="center" mb="lg">
              <Box maw={300}>
                <Title order={3} fw={800} ta="center" className="text-text-main">
                  {isActivation ? "Ativar conta" : "Redefinir senha"}
                </Title>
                <Text size="xs" ta="center" fw={500} mt={4} className="text-primary">
                  {isActivation ? "Escolha sua senha de acesso" : "Informe sua nova senha"}
                </Text>
              </Box>
            </Stack>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack gap="md">
                <PasswordInput
                  required
                  withAsterisk
                  label="Nova senha"
                  placeholder="Digite sua nova senha"
                  leftSection={<FaLock size={14} />}
                  radius="md"
                  size="md"
                  {...register("newPassword")}
                  error={errors.newPassword?.message}
                  classNames={{
                    input: "bg-surface text-text-main border-border focus:border-primary",
                    label: "text-text-main",
                  }}
                />

                <PasswordInput
                  required
                  withAsterisk
                  label="Confirmar senha"
                  placeholder="Digite sua senha novamente"
                  leftSection={<FaLock size={14} />}
                  radius="md"
                  size="md"
                  {...register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                  classNames={{
                    input: "bg-surface text-text-main border-border focus:border-primary",
                    label: "text-text-main",
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  mt="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  radius="md"
                  size="md"
                  loading={isLoading}
                  disabled={lockSubmit}
                >
                  {isLoading
                    ? "Aguarde..."
                    : lockSubmit
                      ? isActivation
                        ? "Conta ativada!"
                        : "Senha redefinida!"
                      : isActivation
                        ? "Ativar conta"
                        : "Redefinir senha"}
                </Button>
              </Stack>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
