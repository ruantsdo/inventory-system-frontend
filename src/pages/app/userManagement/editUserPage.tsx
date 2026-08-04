import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Container,
  Group,
  Loader,
  Modal,
  Stack,
  Stepper,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHome,
  FaUserEdit,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import type { z } from "zod";
import { createUserStep1Schema } from "../../../schemas/userManagement/createUserFirstStep";
import { createUserStep2Schema } from "../../../schemas/userManagement/createUserSecondStep";
import { useUserManagementStore } from "../../../stores/app/userManagement";
import { type CreateUserFormState, EMPTY_FORM_STATE } from "../../../types/createUser";
import { buildUserPayload, formatBrDateToIso, useReferenceDataStore } from "../../../utils";
import { UserFirstStep } from "./common/UserFirstStep";
import { UserSecondStep } from "./common/UserSecondStep";
import { UserThirdStep } from "./common/UserThirdStep";

const editUserFullSchema = createUserStep1Schema.and(createUserStep2Schema) as z.ZodType<
  CreateUserFormState,
  CreateUserFormState
>;

export function EditUserPage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const [activeStep, setActiveStep] = useState(0);
  const [loadingUser, setLoadingUser] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [successModalOpened, { open: openSuccessModal, close: closeSuccessModal }] =
    useDisclosure(false);

  const allRoles = useReferenceDataStore((s) => s.allRoles);
  const { getUserDataForEdit, updateUser, loading: submitting } = useUserManagementStore();

  const methods = useForm<CreateUserFormState>({
    resolver: zodResolver(editUserFullSchema),
    defaultValues: EMPTY_FORM_STATE,
    mode: "onChange",
  });

  const { trigger, getValues, reset } = methods;

  useEffect(() => {
    if (!userId) return;

    setLoadingUser(true);
    setFetchError(null);

    getUserDataForEdit(userId)
      .then((data) => {
        const professionalDocuments =
          data.professionalDocuments?.map((doc) => ({
            id: `${crypto.randomUUID()}-edit`,
            documentType: doc.documentType,
            documentNumber: doc.documentNumber,
            issuer: doc.issuer || "",
            issuerState: doc.issuerState || "",
            issuedAt: doc.issuedAt ? doc.issuedAt.substring(0, 10) : "",
            expiresAt: doc.expiresAt ? doc.expiresAt.substring(0, 10) : "",
            notes: doc.notes || "",
          })) || [];
        const hasProfessionalDocument = professionalDocuments.length > 0;

        const allocations = data.roles.flatMap((r) => {
          if (!r.facilityDetails || r.facilityDetails.length === 0) {
            return [];
          }

          const cityGroups: Record<
            string,
            { cityName: string; facilityIds: string[]; facilityNames: string[] }
          > = {};

          for (const f of r.facilityDetails) {
            const cityId = f.cityId || "unknown";
            const cityName = f.cityName || "Desconhecida";
            if (!cityGroups[cityId]) {
              cityGroups[cityId] = {
                cityName,
                facilityIds: [],
                facilityNames: [],
              };
            }
            cityGroups[cityId].facilityIds.push(f.id);
            cityGroups[cityId].facilityNames.push(f.name);
          }

          const permissionIds = r.permissionDetails?.map((p) => p.id) || [];

          return Object.entries(cityGroups).map(([cityId, group]) => ({
            id: `${crypto.randomUUID()}-edit`,
            roleId: r.roleId,
            roleDisplayName: r.roleName,
            facilityIds: group.facilityIds,
            facilityNames: group.facilityNames,
            cityId: cityId === "unknown" ? "" : cityId,
            cityName: group.cityName,
            permissionIds,
          }));
        });

        reset({
          fullName: data.fullName,
          birthDate: formatBrDateToIso(data.birthDate),
          cpf: data.cpf,
          phone: data.phone || "",
          email: data.email,
          zipCode: data.zipCode || "",
          streetAddress: data.streetAddress || "",
          addressNumber: data.number || "",
          additionalInfo: data.additionalInfo || "",
          neighborhood: data.neighborhood || "",
          addressCity: data.addressCity || "",
          addressState: data.state || "",
          hasProfessionalDocument,
          documentType: "",
          documentNumber: "",
          documentIssuer: "",
          documentIssuerState: "",
          documentIssuedAt: null,
          documentExpiresAt: null,
          documentNotes: "",
          professionalDocuments,
          allocations,
        });
      })
      .catch((err) => {
        setFetchError(err instanceof Error ? err.message : "Erro ao buscar dados do usuário.");
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, [userId, getUserDataForEdit, reset]);

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
    if (!userId) return;
    const payload = buildUserPayload(getValues());

    try {
      await updateUser(userId, payload);
      openSuccessModal();
    } catch {
      notifications.show({
        title: "Erro ao atualizar",
        message: "Não foi possível atualizar o usuário. Tente novamente.",
        color: "red",
        autoClose: 5000,
      });
    }
  }

  function handleGoDashboard() {
    closeSuccessModal();
    navigate("/users/dashboard");
  }

  function handleGoHome() {
    closeSuccessModal();
    navigate("/");
  }

  if (loadingUser) {
    return (
      <Container size="lg" py="xl">
        <Stack align="center" gap="sm">
          <Loader size="xl" color="green" />
          <Text size="sm" c="dimmed">
            Carregando dados do usuário...
          </Text>
        </Stack>
      </Container>
    );
  }

  if (fetchError) {
    return (
      <Container size="lg" py="xl">
        <Alert icon={<FaExclamationTriangle />} title="Erro ao carregar usuário" color="red">
          {fetchError}
        </Alert>
      </Container>
    );
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
            Usuário atualizado!
          </Title>
          <Text c="var(--text-secondary)" ta="center" maw={340} size="sm">
            Os dados do usuário <strong>{getValues("fullName")}</strong> foram atualizados com
            sucesso no sistema.
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
              id="success-go-dashboard-btn"
              color="green"
              leftSection={<FaArrowLeft size={13} />}
              onClick={handleGoDashboard}
            >
              Voltar para Dashboard
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
            <FaUserEdit size={18} color="white" />
          </Box>
          <Box>
            <Title order={3} c="var(--text-main)">
              Editar Usuário
            </Title>
            <Text size="sm" c="var(--text-secondary)">
              Edite as etapas abaixo para atualizar o cadastro do usuário no sistema.
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
            description="Revisar e salvar"
            completedIcon={<FaCheckCircle size={14} />}
          />
        </Stepper>

        <Box mb="xl">
          {activeStep === 0 && <UserFirstStep mode="edit" />}
          {activeStep === 1 && <UserSecondStep mode="edit" />}
          {activeStep === 2 && (
            <UserThirdStep
              payload={buildUserPayload(getValues())}
              allRoles={allRoles}
              mode="edit"
            />
          )}
        </Box>

        <Group justify="space-between">
          <Button
            id="edit-user-back-btn"
            variant="default"
            leftSection={<FaArrowLeft size={12} />}
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Voltar
          </Button>

          {activeStep < 2 ? (
            <Button
              id="edit-user-next-btn"
              color="green"
              rightSection={<FaArrowRight size={12} />}
              onClick={handleNext}
            >
              Próximo
            </Button>
          ) : (
            <Button
              id="edit-user-submit-btn"
              color="green"
              leftSection={<FaUserEdit size={14} />}
              onClick={handleSubmit}
              loading={submitting}
            >
              Salvar Alterações
            </Button>
          )}
        </Group>
      </Container>
    </FormProvider>
  );
}
