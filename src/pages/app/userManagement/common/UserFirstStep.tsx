import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import "dayjs/locale/pt-br";
import dayjs from "dayjs";
import { useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FaAddressCard, FaFileAlt, FaTrash, FaUser } from "react-icons/fa";
import { withMask } from "use-mask-input";
import { brazilianStates, professionalDocumentTypes } from "../../../../enums";
import type { ProfessionalDocumentType } from "../../../../types/api.contracts";
import type { CreateUserFormState } from "../../../../types/createUser";
import { useUtilsStore } from "../../../../utils";

interface UserFirstStepProps {
  mode?: "create" | "edit";
}

export function UserFirstStep({ mode }: UserFirstStepProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateUserFormState>();
  const { cepIsLoading, cepError, fetchCep } = useUtilsStore();

  const cepRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCepChange = (value: string) => {
    if (cepRef.current) clearTimeout(cepRef.current);

    const raw = value.replace(/\D/g, "");
    if (raw.length === 8) {
      cepRef.current = setTimeout(async () => {
        const result = await fetchCep(raw);
        if (result) {
          setValue("streetAddress", result.logradouro ?? "", { shouldValidate: true });
          setValue("neighborhood", result.bairro ?? "", { shouldValidate: true });
          setValue("addressCity", result.localidade ?? "", { shouldValidate: true });
          setValue("addressState", result.uf ?? "", { shouldValidate: true });
        }
      }, 600);
    }
  };

  const handleToggleHasProfessionalDocument = (checked: boolean) => {
    if (!checked) {
      setValue("documentType", "");
      setValue("documentNumber", "");
      setValue("documentIssuer", "");
      setValue("documentIssuerState", "");
      setValue("documentIssuedAt", null);
      setValue("documentExpiresAt", null);
      setValue("documentNotes", "");
      setValue("professionalDocuments", []);
    }
  };

  const handleAddProfessionalDocument = () => {
    const docType = watch("documentType");
    const docNum = watch("documentNumber");
    if (!docType || !docNum || !docNum.trim()) return;

    const docs = watch("professionalDocuments") || [];
    const isDuplicate = docs.some(
      (d) => d.documentType === docType && d.documentNumber === docNum.trim(),
    );
    if (isDuplicate) return;

    const issuer = watch("documentIssuer");
    const issuerState = watch("documentIssuerState");
    const issuedAt = watch("documentIssuedAt");
    const expiresAt = watch("documentExpiresAt");
    const notes = watch("documentNotes");

    const issuedAtStr = issuedAt ? dayjs(issuedAt).format("YYYY-MM-DD") : undefined;
    const expiresAtStr = expiresAt ? dayjs(expiresAt).format("YYYY-MM-DD") : undefined;

    setValue(
      "professionalDocuments",
      [
        ...docs,
        {
          id: `${crypto.randomUUID()}-doc`,
          documentType: docType as ProfessionalDocumentType,
          documentNumber: docNum.trim(),
          issuer: issuer || undefined,
          issuerState: issuerState || undefined,
          issuedAt: issuedAtStr,
          expiresAt: expiresAtStr,
          notes: notes || undefined,
        },
      ],
      { shouldValidate: true },
    );
    setValue("documentType", "");
    setValue("documentNumber", "");
    setValue("documentIssuer", "");
    setValue("documentIssuerState", "");
    setValue("documentIssuedAt", null);
    setValue("documentExpiresAt", null);
    setValue("documentNotes", "");
  };

  const hasProfessionalDocument = watch("hasProfessionalDocument");
  const fullName = watch("fullName");

  return (
    <Stack gap="lg">
      {mode === "edit" && fullName && (
        <Card
          withBorder
          padding="sm"
          radius="md"
          style={{
            borderColor: "var(--primary)",
            background: "color-mix(in srgb, var(--primary) 8%, transparent)",
          }}
        >
          <Text size="sm" fw={600} c="var(--primary)">
            Editando o usuário {fullName}
          </Text>
        </Card>
      )}

      <Card withBorder padding="lg" radius="md">
        <Group gap="xs" mb="md">
          <Box
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaUser size={14} color="white" />
          </Box>
          <Title order={5} c="var(--text-main)">
            Dados Pessoais
          </Title>
          <Badge variant="dot" color="red" size="xs">
            Obrigatório
          </Badge>
        </Group>

        <Grid gutter="md">
          <Grid.Col span={12}>
            <TextInput
              {...register("fullName")}
              id="create-user-fullname"
              label="Nome Completo"
              placeholder="Ex: Maria da Silva Santos"
              required
              error={errors.fullName?.message}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Controller
              name="birthDate"
              control={control}
              render={({ field }) => (
                <DateInput
                  id="create-user-birthdate"
                  label="Data de Nascimento"
                  placeholder="DD/MM/AAAA"
                  required
                  locale="pt-br"
                  valueFormat="DD/MM/YYYY"
                  value={field.value ? dayjs(field.value).toDate() : null}
                  onChange={(date) => field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : "")}
                  maxDate={new Date()}
                  error={errors.birthDate?.message}
                />
              )}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Controller
              name="cpf"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  id="create-user-cpf"
                  label="CPF"
                  placeholder="000.000.000-00"
                  required
                  ref={(el) => {
                    field.ref(el);
                    if (el) withMask("999.999.999-99")(el);
                  }}
                  error={errors.cpf?.message}
                  maxLength={14}
                />
              )}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  id="create-user-phone"
                  label="Telefone"
                  placeholder="(00) 00000-0000"
                  ref={(el) => {
                    field.ref(el);
                    if (el) withMask("(99) 99999-9999")(el);
                  }}
                  error={errors.phone?.message}
                  maxLength={16}
                />
              )}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              {...register("email")}
              id="create-user-email"
              label="E-mail"
              placeholder="usuario@hospital.com.br"
              required
              type="email"
              error={errors.email?.message}
            />
          </Grid.Col>
        </Grid>
      </Card>

      <Card withBorder padding="lg" radius="md">
        <Group gap="xs" mb="md">
          <Box
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaAddressCard size={14} color="white" />
          </Box>
          <Title order={5} c="var(--text-main)">
            Endereço
          </Title>
          <Badge variant="dot" color="red" size="xs">
            Obrigatório
          </Badge>
        </Group>

        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Controller
              name="zipCode"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  id="create-user-zipcode"
                  label="CEP"
                  placeholder="00000-000"
                  required
                  ref={(el) => {
                    field.ref(el);
                    if (el) withMask("99999-999")(el);
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    handleCepChange(e.currentTarget.value);
                  }}
                  error={errors.zipCode?.message ?? cepError ?? undefined}
                  maxLength={9}
                  rightSection={cepIsLoading ? <Loader size="xs" /> : null}
                />
              )}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              {...register("streetAddress")}
              id="create-user-street"
              label="Logradouro"
              placeholder="Rua, Avenida..."
              required
              error={errors.streetAddress?.message}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 2 }}>
            <TextInput
              {...register("addressNumber")}
              id="create-user-number"
              label="Número"
              placeholder="Ex: 42"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 4 }}>
            <TextInput
              {...register("additionalInfo")}
              id="create-user-complement"
              label="Complemento"
              placeholder="Apto, Sala..."
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 4 }}>
            <TextInput
              {...register("neighborhood")}
              id="create-user-neighborhood"
              label="Bairro"
              placeholder="Bairro"
              required
              error={errors.neighborhood?.message}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 3 }}>
            <TextInput
              {...register("addressCity")}
              id="create-user-city"
              label="Cidade"
              placeholder="Cidade"
              required
              error={errors.addressCity?.message}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 1 }}>
            <Controller
              name="addressState"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id="create-user-state"
                  label="UF"
                  placeholder="UF"
                  data={[...brazilianStates]}
                  required
                  searchable
                  error={errors.addressState?.message}
                />
              )}
            />
          </Grid.Col>
        </Grid>
      </Card>

      <Card withBorder padding="lg" radius="md">
        <Group gap="xs" mb="md">
          <Box
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#8b5cf6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaFileAlt size={14} color="white" />
          </Box>
          <Title order={5} c="var(--text-main)">
            Documentação Profissional
          </Title>
          <Badge variant="dot" color="blue" size="xs">
            Opcional
          </Badge>
        </Group>

        <Stack gap="md">
          <Controller
            name="hasProfessionalDocument"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="create-user-has-doc"
                label="Possui documentação profissional especial? (CRM, COREN, OAB etc.)"
                checked={field.value}
                onChange={(e) => {
                  field.onChange(e.currentTarget.checked);
                  handleToggleHasProfessionalDocument(e.currentTarget.checked);
                }}
              />
            )}
          />

          {hasProfessionalDocument && (
            <Stack gap="md">
              <Grid gutter="sm">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Controller
                    name="documentType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        id="create-user-doc-type"
                        label="Tipo de Documento"
                        placeholder="Selecione o conselho"
                        data={[...professionalDocumentTypes]}
                        searchable
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    {...register("documentNumber")}
                    id="create-user-doc-number"
                    label="Número do Documento"
                    placeholder="Ex: 123456"
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    {...register("documentIssuer")}
                    id="create-user-doc-issuer"
                    label="Órgão Emissor"
                    placeholder="Ex: CRM-SP, COREN-RJ"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Controller
                    name="documentIssuerState"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        id="create-user-doc-issuer-state"
                        label="UF Emissora"
                        placeholder="Selecione o Estado"
                        data={[...brazilianStates]}
                        searchable
                        clearable
                      />
                    )}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Controller
                    name="documentIssuedAt"
                    control={control}
                    render={({ field }) => (
                      <DateInput
                        {...field}
                        id="create-user-doc-issued-at"
                        label="Data de Emissão"
                        placeholder="Selecione a data"
                        clearable
                        locale="pt-br"
                        valueFormat="DD/MM/YYYY"
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Controller
                    name="documentExpiresAt"
                    control={control}
                    render={({ field }) => (
                      <DateInput
                        {...field}
                        id="create-user-doc-expires-at"
                        label="Data de Validade"
                        placeholder="Selecione a data"
                        clearable
                        locale="pt-br"
                        valueFormat="DD/MM/YYYY"
                      />
                    )}
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <TextInput
                    {...register("documentNotes")}
                    id="create-user-doc-notes"
                    label="Observações"
                    placeholder="Ex: Registro temporário, especialidade, etc."
                  />
                </Grid.Col>
              </Grid>

              <Button
                id="add-doc-btn"
                color="green"
                variant="light"
                onClick={handleAddProfessionalDocument}
              >
                Adicionar Documento
              </Button>

              {(watch("professionalDocuments") || []).length > 0 && (
                <Stack gap="xs" mt="sm">
                  <Text fw={600} size="sm" c="var(--text-main)">
                    Documentos Adicionados
                  </Text>
                  {(watch("professionalDocuments") || []).map((doc) => (
                    <Card key={doc.id} withBorder padding="md" radius="md">
                      <Group justify="space-between" align="flex-start">
                        <Stack gap={4} style={{ flex: 1 }}>
                          <Group gap="xs">
                            <Badge color="violet" variant="light">
                              {doc.documentType}
                            </Badge>
                            <Text size="sm" fw={600}>
                              {doc.documentNumber}
                            </Text>
                            {doc.issuerState && (
                              <Badge color="gray" variant="outline" size="xs">
                                {doc.issuerState}
                              </Badge>
                            )}
                          </Group>
                          <Stack gap={2} mt={4}>
                            {doc.issuer && (
                              <Text size="xs" c="dimmed">
                                <strong>Emissor:</strong> {doc.issuer}
                              </Text>
                            )}
                            {doc.issuedAt && (
                              <Text size="xs" c="dimmed">
                                <strong>Emissão:</strong> {dayjs(doc.issuedAt).format("DD/MM/YYYY")}
                              </Text>
                            )}
                            {doc.expiresAt && (
                              <Text size="xs" c="dimmed">
                                <strong>Vencimento:</strong>{" "}
                                {dayjs(doc.expiresAt).format("DD/MM/YYYY")}
                              </Text>
                            )}
                            {doc.notes && (
                              <Text size="xs" c="dimmed" style={{ fontStyle: "italic" }}>
                                <strong>Observações:</strong> {doc.notes}
                              </Text>
                            )}
                          </Stack>
                        </Stack>
                        <ActionIcon
                          id={`remove-doc-${doc.id}`}
                          variant="subtle"
                          color="red"
                          size="sm"
                          onClick={() => {
                            const docs = watch("professionalDocuments") || [];
                            setValue(
                              "professionalDocuments",
                              docs.filter((d) => d.id !== doc.id),
                              { shouldValidate: true },
                            );
                          }}
                        >
                          <FaTrash size={12} />
                        </ActionIcon>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              )}

              {errors.professionalDocuments?.message && (
                <Text size="xs" c="var(--status-error)">
                  {errors.professionalDocuments.message}
                </Text>
              )}
            </Stack>
          )}
        </Stack>
      </Card>

      <Text size="xs" c="var(--text-secondary)">
        * Campos marcados como obrigatórios devem ser preenchidos para avançar.
      </Text>
    </Stack>
  );
}
