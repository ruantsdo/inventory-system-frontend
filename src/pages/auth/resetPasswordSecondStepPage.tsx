import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Container, Paper, PasswordInput, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { ThemeToggle } from "../../components";
import {
  type ResetPasswordSecondStepRequest,
  resetPasswordSecondStepSchema,
} from "../../schemas/auth";
import { useAuthStore } from "../../stores/auth";

const ResetPasswordSecondStepPage = () => {
  const navigate = useNavigate();
  const { resetPasswordSecondStep, isLoading } = useAuthStore();
  const { token } = useParams();
  const [lockSubmit, setLockSubmit] = useState(false);

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
        message: "Para redefinir sua senha, use o link de redefinição enviado para o seu e-mail.",
        color: "var(--status-error)",
        position: "bottom-center",
        autoClose: false,
        withCloseButton: true,
      });

      return;
    }

    const success = await resetPasswordSecondStep(data, token);

    if (success) {
      setLockSubmit(true);

      const resetPasswordNotificationId = notifications.show({
        title: "Senha redefinida!",
        message: "Vamos redirecioná-lo para a página de login.",
        color: "var(--status-success)",
        position: "bottom-center",
        autoClose: false,
      });

      setTimeout(() => {
        navigate("/login");

        notifications.update({
          id: resetPasswordNotificationId,
          title: "Senha atualizada!",
          message: "Agora você pode fazer login com sua nova senha!",
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
                  Redefinir senha
                </Title>
                <Text size="xs" ta="center" fw={500} mt={4} className="text-primary">
                  Informe sua nova senha
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
                  {isLoading ? "Aguarde..." : lockSubmit ? "Senha redefinida!" : "Redefinir senha"}
                </Button>
              </Stack>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPasswordSecondStepPage;
