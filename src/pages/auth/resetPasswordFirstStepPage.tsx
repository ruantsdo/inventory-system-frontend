import { zodResolver } from "@hookform/resolvers/zod";
import {
  Anchor,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCalendar, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router";
import { withMask } from "use-mask-input";
import { ThemeToggle } from "../../components";
import {
  type ResetPasswordFirstStepRequest,
  resetPasswordFirstStepSchema,
} from "../../schemas/auth";
import { useAuthStore } from "../../stores/auth";

const ResetPasswordFirstStepPage = () => {
  const { resetPasswordFirstStep, isLoading } = useAuthStore();
  const [lockSubmit, setLockSubmit] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFirstStepRequest>({
    resolver: zodResolver(resetPasswordFirstStepSchema),
    defaultValues: {
      cpf: "",
      email: "",
      birthDate: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFirstStepRequest) => {
    const success: boolean = await resetPasswordFirstStep(data);

    if (success) {
      setLockSubmit(true);
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
                  Redefinição de senha
                </Title>
                <Text size="md" ta="center" fw={500} mt={4} className="text-primary">
                  Confirme seus dados para prosseguir
                </Text>
              </Box>
            </Stack>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack gap="md">
                <TextInput
                  required
                  withAsterisk
                  label="CPF"
                  placeholder="000.000.000-00"
                  leftSection={<FaUser size={14} />}
                  radius="md"
                  size="md"
                  {...register("cpf")}
                  ref={(element) => {
                    register("cpf").ref(element);

                    if (element) {
                      withMask("999.999.999-99")(element);
                    }
                  }}
                  classNames={{
                    input: "bg-surface text-text-main border-border focus:border-primary",
                    label: "text-text-main",
                  }}
                  error={errors.cpf?.message}
                />

                <TextInput
                  required
                  withAsterisk
                  label="Email"
                  placeholder="seuemail@email.com"
                  leftSection={<MdEmail size={14} />}
                  radius="md"
                  size="md"
                  {...register("email")}
                  classNames={{
                    input: "bg-surface text-text-main border-border focus:border-primary",
                    label: "text-text-main",
                  }}
                  error={errors.email?.message}
                />

                <TextInput
                  required
                  withAsterisk
                  label="Data de Nascimento"
                  placeholder="00/00/0000"
                  leftSection={<FaCalendar size={14} />}
                  radius="md"
                  size="md"
                  {...register("birthDate")}
                  ref={(element) => {
                    register("birthDate").ref(element);

                    if (element) {
                      withMask("99/99/9999")(element);
                    }
                  }}
                  classNames={{
                    input: "bg-surface text-text-main border-border focus:border-primary",
                    label: "text-text-main",
                  }}
                  error={errors.birthDate?.message}
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
                      ? "Link de redefinição enviado!"
                      : "Solicitar redefinição de senha"}
                </Button>

                <Anchor
                  component={Link}
                  to="/login"
                  size="sm"
                  fw={500}
                  ta="center"
                  style={{ textDecoration: "none" }}
                  className="text-primary hover:text-primary/80"
                >
                  Voltar para o login
                </Anchor>
              </Stack>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPasswordFirstStepPage;
