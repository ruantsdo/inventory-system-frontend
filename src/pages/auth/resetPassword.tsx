import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Container, Paper, PasswordInput, Stack, Text, Title } from "@mantine/core";

import { useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa";
import { useParams } from "react-router";
import { ThemeToggle } from "../../components";
import { type ResetPasswordRequest, resetPasswordSchema } from "../../schemas/auth";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordRequest) => {
    console.log("Reset Password Data:", data);
    console.log("Token:", token);
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
                >
                  Redefinir senha
                </Button>
              </Stack>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPasswordPage;
