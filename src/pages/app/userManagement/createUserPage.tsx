import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Group, Modal, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaCheckCircle, FaHome, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import * as usersService from "../../../services/users";
import { type CreateUserFormState, EMPTY_FORM_STATE } from "../../../types/createUser";
import { buildUserPayload } from "../../../utils";
import { UserFormWizard, userFullSchema } from "./common/UserFormWizard";

export function CreateUserPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [successModalOpened, { open: openSuccessModal, close: closeSuccessModal }] =
    useDisclosure(false);

  const methods = useForm<CreateUserFormState>({
    resolver: zodResolver(userFullSchema),
    defaultValues: EMPTY_FORM_STATE,
    mode: "onChange",
  });

  const { getValues, reset } = methods;

  async function handleSubmit() {
    const payload = buildUserPayload(getValues());
    setSubmitting(true);

    try {
      await usersService.createUser(payload);
      openSuccessModal();
    } catch {
      notifications.show({
        title: "Erro ao cadastrar",
        message: "Não foi possível cadastrar o usuário. Tente novamente.",
        color: "red",
        autoClose: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleCreateNew() {
    closeSuccessModal();
    reset(EMPTY_FORM_STATE);
    notifications.clean();
  }

  function handleGoHome() {
    closeSuccessModal();
    navigate("/");
  }

  return (
    <FormProvider {...methods}>
      <Modal
        opened={successModalOpened}
        onClose={closeSuccessModal}
        withCloseButton={false}
        centered
        radius="md"
        size="sm"
        overlayProps={{ blur: 4, backgroundOpacity: 0.4 }}
      >
        <Stack align="center" gap="md" py="lg" px="xs">
          <Box
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "color-mix(in srgb, var(--primary) 15%, transparent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaCheckCircle size={36} color="var(--primary)" />
          </Box>
          <Title order={3} ta="center" c="var(--text-main)">
            Usuário cadastrado!
          </Title>
          <Text c="var(--text-secondary)" ta="center" maw={340} size="sm">
            Um e-mail de ativação foi gerado para <strong>{getValues("email")}</strong>. O usuário
            deverá acessar o link recebido para criar sua senha e fazer login.
          </Text>
          <Group mt="sm" justify="center" gap="sm">
            <Button
              id="success-go-home-btn"
              variant="default"
              leftSection={<FaHome size={13} />}
              onClick={handleGoHome}
            >
              Voltar para Home
            </Button>
            <Button
              id="success-create-new-btn"
              color="green"
              leftSection={<FaUserPlus size={13} />}
              onClick={handleCreateNew}
            >
              Criar Novo Usuário
            </Button>
          </Group>
        </Stack>
      </Modal>

      <UserFormWizard
        mode="create"
        title="Novo Usuário"
        description="Preencha as etapas abaixo para cadastrar um novo usuário no sistema."
        icon={<FaUserPlus size={18} color="white" />}
        submitLabel="Confirmar Cadastro"
        submitIcon={<FaUserPlus size={14} />}
        submitting={submitting}
        onSubmit={handleSubmit}
        methods={methods}
      />
    </FormProvider>
  );
}
