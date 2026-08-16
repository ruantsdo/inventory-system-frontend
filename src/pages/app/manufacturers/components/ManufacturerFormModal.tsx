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
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaIndustry } from "react-icons/fa";
import { withMask } from "use-mask-input";
import { brazilianStates } from "../../../../enums";
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

  useEffect(() => {
    if (opened) {
      if (editing) {
        const initialUf = resolveStateUf(editing.city?.state);

        reset({
          name: editing.name ?? "",
          cnpj: editing.cnpj ?? "",
          state: initialUf,
          cityId: editing.cityId ?? "",
          contactPerson: editing.contact?.contactPerson ?? "",
          email: editing.contact?.email ?? "",
          phone: editing.contact?.phone ?? "",
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
    } catch {
      // Erro já tratado pelo interceptor global do apiClient
    }
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
      size="md"
      radius="lg"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <Box>
            <Title order={6} c="var(--text-secondary)" mb="xs">
              Informações Gerais
            </Title>
            <Stack gap="sm">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextInput
                    id="manufacturer-form-name"
                    label="Nome / Razão Social"
                    placeholder="Ex: Laboratório XYZ Ltda"
                    required
                    radius="md"
                    {...field}
                    error={errors.name?.message}
                  />
                )}
              />
              <Controller
                name="cnpj"
                control={control}
                render={({ field }) => (
                  <TextInput
                    id="manufacturer-form-cnpj"
                    label="CNPJ"
                    placeholder="00.000.000/0000-00"
                    required
                    radius="md"
                    {...field}
                    ref={(el) => {
                      field.ref(el);
                      if (el) withMask("99.999.999/9999-99")(el);
                    }}
                    error={errors.cnpj?.message}
                    maxLength={18}
                  />
                )}
              />
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
                          citiesLoading
                            ? "Carregando cidades..."
                            : selectedState
                              ? "Selecione uma cidade"
                              : "Selecione o estado primeiro"
                        }
                        data={stateCities}
                        searchable
                        clearable
                        disabled={citiesLoading || !selectedState || stateCities.length === 0}
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
                      if (el) withMask("(99) 99999-9999")(el);
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
