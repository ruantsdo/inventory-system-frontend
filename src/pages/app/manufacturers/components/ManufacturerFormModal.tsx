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
import { z } from "zod";
import { brazilianStates } from "../../../../enums";
import { getCitiesByState } from "../../../../services/geo";
import { useReferenceDataStore } from "../../../../stores/utils";
import type { ManufacturerOutput } from "../../../../types/api.contracts";
import type { ManufacturerFormValues } from "../../../../types/manufacturers";
import { resolveStateUf } from "../../../../utils";

interface ManufacturerFormModalProps {
  opened: boolean;
  onClose: () => void;
  editing: ManufacturerOutput | null;
  saving: boolean;
  onSave: (
    payload: {
      name: string;
      cnpj?: string;
      cityId?: string;
      contact?: { email?: string; phone?: string; contactPerson?: string };
    },
    id?: string,
  ) => Promise<void>;
}

const manufacturerFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  cnpj: z.string(),
  state: z.string().optional(),
  cityId: z.string().optional(),
  contactPerson: z.string(),
  email: z
    .string()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "E-mail inválido",
    }),
  phone: z.string(),
});

type FormValues = ManufacturerFormValues;

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
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(manufacturerFormSchema),
    defaultValues: {
      name: "",
      cnpj: "",
      state: "",
      cityId: "",
      contactPerson: "",
      email: "",
      phone: "",
    },
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
          name: "",
          cnpj: "",
          state: defaultUf,
          cityId: "",
          contactPerson: "",
          email: "",
          phone: "",
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

  async function onSubmit(values: FormValues) {
    const payload = {
      name: values.name.trim(),
      cnpj: values.cnpj.trim() || undefined,
      cityId: values.cityId || undefined,
      contact:
        values.contactPerson || values.email || values.phone
          ? {
              contactPerson: values.contactPerson.trim() || undefined,
              email: values.email.trim() || undefined,
              phone: values.phone.trim() || undefined,
            }
          : undefined,
    };
    await onSave(payload, editing?.id);
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
                    radius="md"
                    {...field}
                    ref={(el) => {
                      field.ref(el);
                      if (el) withMask("99.999.999/9999-99")(el);
                    }}
                    error={errors.cnpj?.message}
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
                    error={errors.phone?.message}
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
