import { zodResolver } from "@hookform/resolvers/zod";
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";

import { useForm } from "react-hook-form";
import { FaLock, FaPlus, FaSignInAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router";
import { withMask } from "use-mask-input";
import { ThemeToggle } from "../../components";
import { type LoginRequest, loginSchema } from "../../schemas/auth";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      cpf: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginRequest) => {
    console.log("Login Data:", data);
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
              <ThemeIcon
                size={48}
                radius="md"
                variant="light"
                className="bg-primary/10 text-primary"
              >
                <FaPlus size={20} />
              </ThemeIcon>
              <Box maw={300}>
                <Title order={3} fw={800} ta="center" className="text-text-main">
                  Sistema de Gestão
                </Title>
                <Text size="xs" ta="center" fw={500} mt={4} className="text-primary">
                  Inventário & Controle de Estoque
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

                <PasswordInput
                  required
                  withAsterisk
                  label="Senha"
                  placeholder="Digite sua senha"
                  leftSection={<FaLock size={14} />}
                  radius="md"
                  size="md"
                  {...register("password")}
                  error={errors.password?.message}
                  classNames={{
                    input: "bg-surface text-text-main border-border focus:border-primary",
                    label: "text-text-main",
                  }}
                />

                <Group justify="space-between" mt={4}>
                  <Checkbox
                    label="Lembrar-me"
                    size="sm"
                    color="green"
                    classNames={{
                      label: "text-text-secondary",
                    }}
                    {...register("rememberMe")}
                  />
                  <Anchor
                    component={Link}
                    to="/forgot-password"
                    size="sm"
                    fw={500}
                    style={{ textDecoration: "none" }}
                    className="text-primary hover:text-primary/80"
                  >
                    Esqueci minha senha
                  </Anchor>
                </Group>

                <Button
                  type="submit"
                  fullWidth
                  mt="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  rightSection={<FaSignInAlt />}
                  radius="md"
                  size="md"
                >
                  Entrar
                </Button>
              </Stack>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
