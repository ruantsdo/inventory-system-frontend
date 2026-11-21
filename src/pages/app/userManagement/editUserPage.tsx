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
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaHome,
  FaList,
  FaUserEdit,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import * as usersService from "../../../services/users";
import { type CreateUserFormState, EMPTY_FORM_STATE } from "../../../types/createUser";
import { buildUserPayload, formatBrDateToIso } from "../../../utils";
import { UserFormWizard, userFullSchema } from "./common/UserFormWizard";

export function EditUserPage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [successModalOpened, { open: openSuccessModal, close: closeSuccessModal }] =
    useDisclosure(false);

  const methods = useForm<CreateUserFormState>({
    resolver: zodResolver(userFullSchema),
    defaultValues: EMPTY_FORM_STATE,
    mode: "onChange",
  });

  const { getValues, reset } = methods;

  useEffect(() => {
    if (!userId) return;

    setLoadingUser(true);
    setFetchError(null);

    usersService
      .getUserDataForEdit(userId)
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
          fullName: data.fullName || "",
          birthDate: data.birthDate ? formatBrDateToIso(data.birthDate) : "",
          cpf: data.cpf || "",
          phone: data.phone || "",
          email: data.email || "",
          zipCode: data.zipCode || "",
          streetAddress: data.streetAddress || "",
          addressNumber: data.number || "",
          additionalInfo: data.additionalInfo || "",
          neighborhood: data.neighborhood || "",
          addressCity: data.addressCity || "",
          addressState: data.state || "",
          hasProfessionalDocument,
          documentType: professionalDocuments[0]?.documentType || "CRM",
          documentNumber: professionalDocuments[0]?.documentNumber || "",
          professionalDocuments,
          allocations,
        });
      })
      .catch((err) => {
        setFetchError(
          err instanceof Error ? err.message : "Não foi possível carregar os dados do usuário."
        );
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, [userId, reset]);

  async function handleSubmit() {
    if (!userId) return;
    const payload = buildUserPayload(getValues());
    setSubmitting(true);

    try {
      await usersService.updateUser(userId, payload);
      openSuccessModal();
    } catch {
      notifications.show({
        title: "Erro ao atualizar",
        message: "Não foi possível atualizar o usuário. Tente novamente.",
        color: "red",
        autoClose: 5000,
      });
    } finally {
      setSubmitting(false);
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
              leftSection={<FaList size={13} />}
              onClick={handleGoDashboard}
            >
              Ir para o Dashboard
            </Button>
          </Group>
        </Stack>
      </Modal>

      <UserFormWizard
        mode="edit"
        title="Editar Usuário"
        description="Edite as etapas abaixo para atualizar o cadastro do usuário no sistema."
        icon={<FaUserEdit size={18} color="white" />}
        submitLabel="Salvar Alterações"
        submitIcon={<FaUserEdit size={14} />}
        submitting={submitting}
        onSubmit={handleSubmit}
        methods={methods}
      />
    </FormProvider>
  );
}
