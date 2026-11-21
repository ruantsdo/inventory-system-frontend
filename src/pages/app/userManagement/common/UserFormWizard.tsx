import { Box, Button, Container, Group, Stepper, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { FaArrowLeft, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import type { z } from "zod";
import { createUserStep1Schema } from "../../../../schemas/userManagement/createUserFirstStep";
import { createUserStep2Schema } from "../../../../schemas/userManagement/createUserSecondStep";
import { useReferenceDataStore } from "../../../../stores/utils";
import type { CreateUserFormState } from "../../../../types/createUser";
import { buildUserPayload } from "../../../../utils";
import { UserFirstStep } from "./UserFirstStep";
import { UserSecondStep } from "./UserSecondStep";
import { UserThirdStep } from "./UserThirdStep";

export const userFullSchema = createUserStep1Schema.and(createUserStep2Schema) as z.ZodType<
  CreateUserFormState,
  CreateUserFormState
>;

export interface UserFormWizardProps {
  mode: "create" | "edit";
  title: string;
  description: string;
  icon: React.ReactNode;
  submitLabel: string;
  submitIcon: React.ReactNode;
  submitting: boolean;
  onSubmit: () => Promise<void>;
  methods: UseFormReturn<CreateUserFormState>;
}

export function UserFormWizard({
  mode,
  title,
  description,
  icon,
  submitLabel,
  submitIcon,
  submitting,
  onSubmit,
  methods,
}: UserFormWizardProps) {
  const [activeStep, setActiveStep] = useState(0);
  const allRoles = useReferenceDataStore((s) => s.allRoles);
  const { trigger, getValues } = methods;

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

  return (
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
          {icon}
        </Box>
        <Box>
          <Title order={3} c="var(--text-main)">
            {title}
          </Title>
          <Text size="sm" c="var(--text-secondary)">
            {description}
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
          description={mode === "create" ? "Revisar e enviar" : "Revisar e salvar"}
          completedIcon={<FaCheckCircle size={14} />}
        />
      </Stepper>

      <Box mb="xl">
        {activeStep === 0 && <UserFirstStep mode={mode} />}
        {activeStep === 1 && <UserSecondStep mode={mode} />}
        {activeStep === 2 && (
          <UserThirdStep
            payload={buildUserPayload(getValues())}
            allRoles={allRoles}
            mode={mode}
          />
        )}
      </Box>

      <Group justify="space-between">
        <Button
          id={`${mode}-user-back-btn`}
          variant="default"
          leftSection={<FaArrowLeft size={12} />}
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Voltar
        </Button>

        {activeStep < 2 ? (
          <Button
            id={`${mode}-user-next-btn`}
            color="green"
            rightSection={<FaArrowRight size={12} />}
            onClick={handleNext}
          >
            Próximo
          </Button>
        ) : (
          <Button
            id={`${mode}-user-submit-btn`}
            color="green"
            leftSection={submitIcon}
            onClick={onSubmit}
            loading={submitting}
          >
            {submitLabel}
          </Button>
        )}
      </Group>
    </Container>
  );
}

