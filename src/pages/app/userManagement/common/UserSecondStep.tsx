import { Box, Button, Card, Group, Loader, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useId, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaPlus, FaShieldAlt, FaTimesCircle } from "react-icons/fa";
import { useReferenceDataStore } from "../../../../stores/utils";
import type { FacilityOutput, RoleCategory } from "../../../../types/api.contracts";
import type { AllocationEntry, CreateUserFormState } from "../../../../types/createUser";
import { AllocationBuilder } from "./AllocationBuilder";
import { AllocationList } from "./AllocationList";
import { EmptyAllocationsPlaceholder } from "./EmptyAllocationsPlaceholder";

interface UserSecondStepProps {
  mode?: "create" | "edit";
}

export function UserSecondStep({ mode }: UserSecondStepProps) {
  const { watch, setValue } = useFormContext<CreateUserFormState>();
  const allocations = watch("allocations");
  const fullName = watch("fullName");
  const uniqueId = useId();

  const {
    myPermissions,
    allRoles,
    cities,
    referenceDataLoading,
    referenceDataError,
    loadReferenceData,
    getActiveFacilitiesByCity,
  } = useReferenceDataStore();

  const [roleCategory, setRoleCategory] = useState<RoleCategory>("FUNCTIONAL");

  const [builderCityId, setBuilderCityId] = useState<string | null>(null);
  const [builderFacilities, setBuilderFacilities] = useState<FacilityOutput[]>([]);
  const [builderFacilitiesLoading, setBuilderFacilitiesLoading] = useState(false);
  const [builderSelectedFacilityIds, setBuilderSelectedFacilityIds] = useState<string[]>([]);
  const [builderRoleId, setBuilderRoleId] = useState<string | null>(null);
  const [builderSelectedPermissions, setBuilderSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    loadReferenceData();
  }, [loadReferenceData]);

  useEffect(() => {
    if (referenceDataError) {
      notifications.show({
        title: "Erro ao obter dados do servidor",
        message: "Verifique sua conexão com a internet.",
        color: "red",
        autoClose: 5000,
      });
    }
  }, [referenceDataError]);

  useEffect(() => {
    if (!builderCityId) {
      setBuilderFacilities([]);
      setBuilderSelectedFacilityIds([]);
      return;
    }
    setBuilderFacilitiesLoading(true);
    getActiveFacilitiesByCity(builderCityId)
      .then(setBuilderFacilities)
      .finally(() => setBuilderFacilitiesLoading(false));
  }, [builderCityId, getActiveFacilitiesByCity]);

  useEffect(() => {
    if (!builderRoleId) {
      setBuilderSelectedPermissions([]);
      return;
    }
    const role = allRoles.find((r) => r.id === builderRoleId);
    if (!role) return;

    const myPermissionNames = new Set(myPermissions.map((p) => p.name));
    const autoSelected = role.permissions
      .filter((p) => myPermissionNames.has(p.name))
      .map((p) => p.id);

    setBuilderSelectedPermissions(autoSelected);
  }, [builderRoleId, allRoles, myPermissions]);

  const canAddAllocation =
    builderCityId !== null && builderSelectedFacilityIds.length > 0 && builderRoleId !== null;

  function handleAddAllocation() {
    if (!canAddAllocation || !builderCityId || !builderRoleId) return;

    const city = cities.find((c) => c.id === builderCityId);
    const role = allRoles.find((r) => r.id === builderRoleId);
    if (!city || !role) return;

    const selectedFacilityNames = builderFacilities
      .filter((f) => builderSelectedFacilityIds.includes(f.id))
      .map((f) => f.name);

    const newAllocation: AllocationEntry = {
      id: `${crypto.randomUUID()}-${uniqueId}`,
      roleId: builderRoleId,
      roleDisplayName: role.displayName,
      facilityIds: builderSelectedFacilityIds,
      facilityNames: selectedFacilityNames,
      cityId: builderCityId,
      cityName: `${city.name}${city.state ? ` / ${city.state}` : ""}`,
      permissionIds: builderSelectedPermissions,
    };

    setValue("allocations", [...allocations, newAllocation], { shouldValidate: true });

    setBuilderCityId(null);
    setBuilderSelectedFacilityIds([]);
    setBuilderRoleId(null);
    setBuilderSelectedPermissions([]);
    setRoleCategory("FUNCTIONAL");
  }

  function handleRemoveAllocation(id: string) {
    setValue(
      "allocations",
      allocations.filter((a) => a.id !== id),
      { shouldValidate: true },
    );
  }

  function handlePermissionToggle(permId: string, checked: boolean) {
    if (checked) {
      setBuilderSelectedPermissions((prev) => [...prev, permId]);
    } else {
      setBuilderSelectedPermissions((prev) => prev.filter((id) => id !== permId));
    }
  }

  if (referenceDataLoading) {
    return (
      <Box style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
        <Stack align="center" gap="sm">
          <Loader color="green" size="lg" />
          <Text size="sm" c="dimmed">
            Carregando cargos e permissões...
          </Text>
        </Stack>
      </Box>
    );
  }

  if (referenceDataError) {
    return (
      <Card withBorder padding="lg" radius="md" style={{ borderColor: "var(--status-error)" }}>
        <Group gap="xs">
          <FaTimesCircle color="var(--status-error)" />
          <Text c="var(--status-error)" fw={600}>
            {referenceDataError}
          </Text>
        </Group>
      </Card>
    );
  }

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

      <Card
        withBorder
        padding="sm"
        radius="md"
        style={{
          borderColor: "var(--secondary)",
          background: "color-mix(in srgb, var(--secondary) 8%, transparent)",
        }}
      >
        <Group gap="xs">
          <FaShieldAlt color="var(--secondary)" size={14} />
          <Text size="sm" c="var(--secondary)" fw={500}>
            Você só pode atribuir permissões que você possui. Permissões que excedem as suas ficam
            desabilitadas.
          </Text>
        </Group>
      </Card>

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
            <FaPlus size={14} color="white" />
          </Box>
          <Title order={5} c="var(--text-main)">
            Nova Alocação
          </Title>
        </Group>

        <Stack gap="md">
          <AllocationBuilder
            cities={cities}
            allRoles={allRoles}
            myPermissions={myPermissions}
            builderCityId={builderCityId}
            onCityChange={setBuilderCityId}
            builderFacilities={builderFacilities}
            builderFacilitiesLoading={builderFacilitiesLoading}
            builderSelectedFacilityIds={builderSelectedFacilityIds}
            onFacilityIdsChange={setBuilderSelectedFacilityIds}
            builderRoleId={builderRoleId}
            onRoleChange={setBuilderRoleId}
            builderSelectedPermissions={builderSelectedPermissions}
            onPermissionToggle={handlePermissionToggle}
            roleCategory={roleCategory}
            onRoleCategoryChange={setRoleCategory}
          />

          <Button
            id="alloc-add-btn"
            leftSection={<FaPlus size={12} />}
            color="green"
            variant="light"
            disabled={!canAddAllocation}
            onClick={handleAddAllocation}
            mt="sm"
          >
            Adicionar Alocação
          </Button>
        </Stack>
      </Card>

      {allocations.length > 0 && (
        <AllocationList
          allocations={allocations}
          allRoles={allRoles}
          onRemove={handleRemoveAllocation}
        />
      )}

      {allocations.length === 0 && <EmptyAllocationsPlaceholder />}
    </Stack>
  );
}
