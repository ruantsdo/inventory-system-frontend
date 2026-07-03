import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Container, Group, Modal, Stack, Stepper, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaHome, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import type { z } from "zod";
import { createUserStep1Schema } from "../../../schemas/userManagement/createUserFirstStep";
import { createUserStep2Schema } from "../../../schemas/userManagement/createUserSecondStep";
import { useUserManagementStore } from "../../../stores/app/userManagement";
import { useReferenceDataStore } from "../../../stores/utils";
import { type CreateUserFormState, EMPTY_FORM_STATE } from "../../../types/createUser";
import { buildUserPayload } from "../../../utils";
import { UserFirstStep } from "./common/UserFirstStep";
import { UserSecondStep } from "./common/UserSecondStep";
import { UserThirdStep } from "./common/UserThirdStep";

const createUserFullSchema = createUserStep1Schema.and(createUserStep2Schema) as z.ZodType<
  CreateUserFormState,
  CreateUserFormState
>;

export function CreateUserPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [successModalOpened, { open: openSuccessModal, close: closeSuccessModal }] =
    useDisclosure(false);

  const allRoles = useReferenceDataStore((s) => s.allRoles);
  const { createUser, loading: submitting } = useUserManagementStore();

  const methods = useForm<CreateUserFormState>({
    resolver: zodResolver(createUserFullSchema),
    defaultValues: EMPTY_FORM_STATE,
    mode: "onChange",
  });

  const { trigger, getValues, reset } = methods;

  async function handleNext() {
    if (activeStep === 0) {
      const isValid = await trigger([
        "fullName",
        "birthDate",
        "cpf",
        "phone",
        "email",
        "zipCode",
        "streetAddress",
        "addressNumber",
        "additionalInfo",
        "neighborhood",
        "addressCity",
        "addressState",
        "hasProfessionalDocument",
        "documentType",
        "documentNumber",
        "professionalDocuments",
      ]);
      if (!isValid) return;
    } else if (activeStep === 1) {
      const isValid = await trigger(["allocations"]);
      if (!isValid) {
        const err = methods.formState.errors.allocations;
        if (err?.message) {
          notifications.show({
            title: "Atenção",
            message: err.message as string,
            color: "yellow",
            autoClose: 4000,
          });
        } else if (Array.isArray(err)) {
          notifications.show({
            title: "Atenção",
            message: "Existem alocações inválidas.",
            color: "yellow",
            autoClose: 4000,
          });
        }
        return;
      }
    }
    setActiveStep((s) => s + 1);
  }

  function handleBack() {
    setActiveStep((s) => s - 1);
  }

  async function handleSubmit() {
    const payload = buildUserPayload(getValues());

    try {
      await createUser(payload);
      openSuccessModal();
    } catch {
      notifications.show({
        title: "Erro ao cadastrar",
        message: "Não foi possível cadastrar o usuário. Tente novamente.",
        color: "red",
        autoClose: 5000,
      });
    }
  }

  function handleCreateNew() {
    closeSuccessModal();
    reset(EMPTY_FORM_STATE);
    setActiveStep(0);
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

      <Container size="lg">
        <Group gap="sm" mb="xl">
          <Box
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaUserPlus size={18} color="white" />
          </Box>
          <Box>
            <Title order={3} c="var(--text-main)">
              Novo Usuário
            </Title>
            <Text size="sm" c="var(--text-secondary)">
              Preencha as etapas abaixo para cadastrar um novo usuário no sistema.
            </Text>
          </Box>
        </Group>

        <Stepper
          active={activeStep}
          color="green"
          size="sm"
          mb="xl"
          styles={{
            stepLabel: { fontWeight: 600 },
            stepDescription: { fontSize: 11 },
          }}
        >
          <Stepper.Step
            label="Informações Básicas"
            description="Dados pessoais e endereço"
            completedIcon={<FaCheckCircle size={14} />}
          />
          <Stepper.Step
            label="Permissões"
            description="Cargos e unidades"
            completedIcon={<FaCheckCircle size={14} />}
          />
          <Stepper.Step
            label="Confirmação"
            description="Revisar e enviar"
            completedIcon={<FaCheckCircle size={14} />}
          />
        </Stepper>

        <Box mb="xl">
          {activeStep === 0 && <UserFirstStep mode="create" />}
          {activeStep === 1 && <UserSecondStep mode="create" />}
          {activeStep === 2 && (
            <UserThirdStep
              payload={buildUserPayload(getValues())}
              allRoles={allRoles}
              mode="create"
            />
          )}
        </Box>

        <Group justify="space-between">
          <Button
            id="create-user-back-btn"
            variant="default"
            leftSection={<FaArrowLeft size={12} />}
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Voltar
          </Button>

          {activeStep < 2 ? (
            <Button
              id="create-user-next-btn"
              color="green"
              rightSection={<FaArrowRight size={12} />}
              onClick={handleNext}
            >
              Próximo
            </Button>
          ) : (
            <Button
              id="create-user-submit-btn"
              color="green"
              leftSection={<FaUserPlus size={14} />}
              onClick={handleSubmit}
              loading={submitting}
            >
              Confirmar Cadastro
            </Button>
          )}
        </Group>
      </Container>
    </FormProvider>
  );
}
