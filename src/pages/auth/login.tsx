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
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaLock, FaPlus, FaSignInAlt, FaUser } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import { withMask } from "use-mask-input";
import { ThemeToggle } from "../../components";
import { type LoginRequest, loginSchema } from "../../schemas/auth";
import { selectIsAuthenticated, selectIsLoading, useAuthStore } from "../../stores/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore(selectIsLoading);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const getSavedRememberMe = () => {
    try {
      const raw = localStorage.getItem("rememberMe");
      if (!raw) return null;

      try {
        const parsed = JSON.parse(raw);
        if (parsed.credential) return parsed;
      } catch {}

      const bytes = CryptoJS.AES.decrypt(
        raw,
        import.meta.env.VITE_STORAGE_SECRET || "inventory-system-secret-key",
      );
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedText) return null;
      return JSON.parse(decryptedText);
    } catch {
      localStorage.removeItem("rememberMe");
      return null;
    }
  };

  const savedData = getSavedRememberMe();
  const [isAutofilled, setIsAutofilled] = useState(!!savedData?.credential);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      credential: savedData?.credential ?? "",
      password: "",
      rememberMe: savedData?.rememberMe ?? false,
    },
  });

  const onSubmit = (data: LoginRequest) => {
    login(data);
  };

  const maskAutofilledCpf = (cpf: string) => {
    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) return cpf;
    return `${cleanCpf.slice(0, 2)}X.XXX.XXX-${cleanCpf.slice(-2)}`;
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
                  Inventário &amp; Controle de Estoque
                </Text>
              </Box>
            </Stack>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack gap="md">
                <Controller
                  name="credential"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      required
                      withAsterisk
                      label="CPF"
                      placeholder="000.000.000-00"
                      leftSection={<FaUser size={14} />}
                      radius="md"
                      size="md"
                      {...field}
                      value={
                        isAutofilled ? maskAutofilledCpf(savedData?.credential || "") : field.value
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (isAutofilled) {
                          setIsAutofilled(false);
                          const firstTwo = savedData?.credential?.substring(0, 2) || "";
                          const typedChar = (e.nativeEvent as InputEvent)?.data?.replace(/\D/g, "") || "";
                          field.onChange(firstTwo + typedChar);
                        } else {
                          field.onChange(e);
                        }
                      }}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (isAutofilled && (e.key === "Backspace" || e.key === "Delete")) {
                          setIsAutofilled(false);
                          field.onChange(savedData?.credential?.substring(0, 2) || "");
                          e.preventDefault();
                        }
                      }}
                      ref={(element: HTMLInputElement | null) => {
                        field.ref(element);

                        if (element && !isAutofilled) {
                          withMask("999.999.999-99")(element);
                        }
                      }}
                      classNames={{
                        input: "bg-surface text-text-main border-border focus:border-primary",
                        label: "text-text-main",
                      }}
                      error={errors.credential?.message}
                    />
                  )}
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
                    to="/auth/reset-password-first-step"
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
                  loading={isLoading}
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
}

