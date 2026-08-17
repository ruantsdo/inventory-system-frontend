import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Modal,
  ScrollArea,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaIndustry } from "react-icons/fa";
import { withMask } from "use-mask-input";
import { brazilianStates, countries } from "../../../../enums";
import { manufacturerFormSchema } from "../../../../schemas/manufacturers";
import { getCitiesByState } from "../../../../services/geo";
import { useReferenceDataStore } from "../../../../stores/utils";
import type {
  CreateManufacturerPayload,
  ManufacturerOutput,
  UpdateManufacturerPayload,
} from "../../../../types/api.contracts";
import {
  EMPTY_MANUFACTURER_FORM,
  type ManufacturerFormValues,
} from "../../../../types/manufacturers";
import {
  buildManufacturerPayload,
  isManufacturerFormUnchanged,
  resolveStateUf,
} from "../../../../utils";

interface ManufacturerFormModalProps {
  opened: boolean;
  onClose: () => void;
  editing: ManufacturerOutput | null;
  saving: boolean;
  onSave: (
    payload: CreateManufacturerPayload | UpdateManufacturerPayload,
    id?: string,
  ) => Promise<void>;
}

export function ManufacturerFormModal({
  opened,
  onClose,
  editing,
  saving,
  onSave,
}: ManufacturerFormModalProps) {
  const { cities, loadReferenceData } = useReferenceDataStore();
  const [stateCities, setStateCities] = useState<{ value: string; label: string }[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  useEffect(() => {
    loadReferenceData();
  }, [loadReferenceData]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ManufacturerFormValues>({
    resolver: zodResolver(manufacturerFormSchema),
    defaultValues: EMPTY_MANUFACTURER_FORM,
    mode: "onChange",
  });

  const selectedState = watch("state");
  const selectedCountry = watch("country");
  const isBrazil = selectedCountry === "BR";

  useEffect(() => {
    if (opened) {
      if (editing) {
        const initialUf = resolveStateUf(editing.city?.state);

        reset({
          name: editing.name ?? "",
          tradeName: editing.tradeName ?? "",
          country: editing.country ?? "BR",
          cnpj: editing.cnpj ?? "",
          regulatoryCode: editing.regulatoryCode ?? "",
          website: editing.website ?? "",
          state: initialUf,
          cityId: editing.cityId ?? "",
          zipCode: editing.address?.zipCode ?? "",
          street: editing.address?.street ?? "",
          number: editing.address?.number ?? "",
          complement: editing.address?.complement ?? "",
          neighborhood: editing.address?.neighborhood ?? "",
          contactPerson: editing.contact?.contactPerson ?? "",
          email: editing.contact?.email ?? "",
          phone: editing.contact?.phone ?? "",
          isActive: editing.isActive ?? true,
        });
      } else {
        const activeCity = cities.find((c) => c.state) || cities[0];
        const defaultUf = resolveStateUf(activeCity?.state);

        reset({
          ...EMPTY_MANUFACTURER_FORM,
          state: defaultUf,
        });
      }
    }
  }, [opened, editing, reset, cities]);

  useEffect(() => {
    if (!selectedState) return;

    let isMounted = true;

    async function fetchCities(state: string) {
      setCitiesLoading(true);
      try {
        const data = await getCitiesByState(state);
        if (isMounted) {
          const options = data.map((c) => ({ value: c.id, label: c.name }));
          setStateCities(options);
        }
      } catch {
        if (isMounted) {
          setStateCities([]);
        }
      } finally {
        if (isMounted) {
          setCitiesLoading(false);
        }
      }
    }

    fetchCities(selectedState);

    return () => {
      isMounted = false;
    };
  }, [selectedState]);

  async function onSubmit(values: ManufacturerFormValues) {
    if (editing && (!isDirty || isManufacturerFormUnchanged(values, editing))) {
      onClose();
      return;
    }

    const payload = buildManufacturerPayload(values);
    try {
      await onSave(payload, editing?.id);
    } catch {}
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon
            size="md"
            radius="md"
            style={{ background: "var(--primary)" }}
            variant="filled"
          >
            <FaIndustry size={14} />
          </ThemeIcon>
          <Text fw={700} c="var(--text-main)">
            {editing ? "Editar Fabricante" : "Novo Fabricante"}
          </Text>
        </Group>
      }
      size="lg"
      radius="lg"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <Box>
            <Title order={6} c="var(--text-secondary)" mb="xs">
              Informações Cadastrais
            </Title>
            <Stack gap="sm">
              <Grid gutter="sm">
                <Grid.Col span={{ base: 12, sm: 7 }}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        id="manufacturer-form-name"
                        label="Razão Social"
                        placeholder="Ex: Laboratórios Eurofarma S.A."
                        required
                        radius="md"
                        {...field}
                        error={errors.name?.message}
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 5 }}>
                  <Controller
                    name="tradeName"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        id="manufacturer-form-tradename"
                        label="Nome Fantasia / Marca"
                        placeholder="Ex: Eurofarma"
                        radius="md"
                        {...field}
                        error={errors.tradeName?.message}
                      />
                    )}
                  />
                </Grid.Col>
              </Grid>

              <Grid gutter="sm">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Select
                        id="manufacturer-form-country"
                        label="País de Origem"
                        placeholder="Selecione o país"
                        data={[...countries]}
                        searchable
                        required
                        radius="md"
                        value={field.value || "BR"}
                        onChange={(val) => {
                          field.onChange(val ?? "BR");
                          if (val !== "BR") {
                            setValue("cnpj", "");
                            setValue("state", "");
                            setValue("cityId", "");
                          }
                        }}
                        error={errors.country?.message}
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Controller
                    name="cnpj"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        id="manufacturer-form-cnpj"
                        label={isBrazil ? "CNPJ" : "CNPJ (opcional)"}
                        placeholder="00.000.000/0000-00"
                        required={isBrazil}
                        radius="md"
                        {...field}
                        ref={(el) => {
                          field.ref(el);
                          if (el && isBrazil) withMask("99.999.999/9999-99")(el);
                        }}
                        error={errors.cnpj?.message}
                        maxLength={18}
                      />
                    )}
                  />
                </Grid.Col>
              </Grid>

              <Grid gutter="sm">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Controller
                    name="regulatoryCode"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        id="manufacturer-form-regulatory-code"
                        label="Código Regulatório / AFE"
                        placeholder="Ex: AFE 1.23456.7"
                        radius="md"
                        {...field}
                        error={errors.regulatoryCode?.message}
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Controller
                    name="website"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        id="manufacturer-form-website"
                        label="Website Oficial"
                        placeholder="https://www.fabricante.com"
                        radius="md"
                        {...field}
                        error={errors.website?.message}
                      />
                    )}
                  />
                </Grid.Col>
              </Grid>

              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="manufacturer-form-is-active"
                    label="Fabricante ativo para novas operações"
                    checked={field.value}
                    onChange={(event) => field.onChange(event.currentTarget.checked)}
                  />
                )}
              />
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Title order={6} c="var(--text-secondary)" mb="xs">
              Endereço e Localização
            </Title>
            <Stack gap="sm">
              <Grid gutter="sm">
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Controller
                    name="zipCode"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        id="manufacturer-form-zipcode"
                        label="CEP"
                        placeholder="00000-000"
                        radius="md"
                        {...field}
                        ref={(el) => {
                          field.ref(el);
                          if (el && isBrazil) withMask("99999-999")(el);
                        }}
                        error={errors.zipCode?.message}
                        maxLength={9}
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 8 }}>
                  <Controller
                    name="street"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        id="manufacturer-form-street"
                        label="Logradouro"
                        placeholder="Ex: Av. das Indústrias"
                        radius="md"
                        {...field}
                        error={errors.street?.message}
                      />
                    )}
                  />
                </Grid.Col>
              </Grid>

              <Grid gutter="sm">
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Controller
                    name="number"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        id="manufacturer-form-number"
                        label="Número"
                        placeholder="1000"
                        radius="md"
                        {...field}
                        error={errors.number?.message}
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Controller
                    name="complement"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        id="manufacturer-form-complement"
                        label="Complemento"
                        placeholder="Galpão 2"
                        radius="md"
                        {...field}
                        error={errors.complement?.message}
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Controller
                    name="neighborhood"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        id="manufacturer-form-neighborhood"
                        label="Bairro"
                        placeholder="Distrito Industrial"
                        radius="md"
                        {...field}
                        error={errors.neighborhood?.message}
                      />
                    )}
                  />
                </Grid.Col>
              </Grid>

              <Grid gutter="sm">
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Select
                        id="manufacturer-form-state"
                        label="UF"
                        placeholder="UF"
                        data={[...brazilianStates]}
                        searchable
                        clearable
                        disabled={!isBrazil}
                        radius="md"
                        nothingFoundMessage="Nenhum estado encontrado"
                        value={field.value || null}
                        onChange={(val) => {
                          field.onChange(val ?? "");
                          setValue("cityId", "");
                        }}
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 8 }}>
                  <Controller
                    name="cityId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        id="manufacturer-form-city"
                        label="Cidade"
                        placeholder={
                          !isBrazil
                            ? "Não aplicável para exterior"
                            : citiesLoading
                              ? "Carregando cidades..."
                              : selectedState
                                ? "Selecione uma cidade"
                                : "Selecione o estado primeiro"
                        }
                        data={stateCities}
                        searchable
                        clearable
                        disabled={!isBrazil || citiesLoading || !selectedState || stateCities.length === 0}
                        radius="md"
                        nothingFoundMessage="Nenhuma cidade encontrada"
                        {...field}
                        value={field.value || null}
                        onChange={(val) => field.onChange(val ?? "")}
                        error={errors.cityId?.message}
                      />
                    )}
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Title order={6} c="var(--text-secondary)" mb="xs">
              Informações de Contato
            </Title>
            <Stack gap="sm">
              <Controller
                name="contactPerson"
                control={control}
                render={({ field }) => (
                  <TextInput
                    id="manufacturer-form-contact-person"
                    label="Pessoa de Contato"
                    placeholder="Ex: João Silva"
                    radius="md"
                    {...field}
                    error={errors.contactPerson?.message}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextInput
                    id="manufacturer-form-email"
                    label="E-mail"
                    placeholder="contato@fabricante.com"
                    radius="md"
                    type="email"
                    {...field}
                    error={errors.email?.message}
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextInput
                    id="manufacturer-form-phone"
                    label="Telefone"
                    placeholder="(00) 00000-0000"
                    radius="md"
                    {...field}
                    ref={(el) => {
                      field.ref(el);
                      if (el && isBrazil) withMask("(99) 99999-9999")(el);
                    }}
                    error={errors.phone?.message}
                    maxLength={16}
                  />
                )}
              />
            </Stack>
          </Box>

          <Group justify="flex-end" mt="xs">
            <Button variant="subtle" radius="md" color="gray" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button id="manufacturer-form-submit-btn" type="submit" radius="md" loading={saving}>
              {editing ? "Salvar Alterações" : "Cadastrar Fabricante"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
