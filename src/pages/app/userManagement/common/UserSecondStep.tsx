import { Box, Button, Card, Group, Loader, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useId, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaEdit, FaPlus, FaShieldAlt, FaTimesCircle } from "react-icons/fa";
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
  const [editingAllocId, setEditingAllocId] = useState<string | null>(null);
  const skipAutoSelectRef = useRef(false);

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
    if (skipAutoSelectRef.current) {
      skipAutoSelectRef.current = false;
      return;
    }
    const role = allRoles.find((r) => r.id === builderRoleId);
    if (!role) return;

    const myPermissionNames = new Set(myPermissions.map((p) => p.name));
    const canGrantFunctionalRoles = myPermissionNames.has("users.grant_functional_roles");
    const isFunctionalBypass = canGrantFunctionalRoles && role.category === "FUNCTIONAL";

    const autoSelected = isFunctionalBypass
      ? role.permissions.map((p) => p.id)
      : role.permissions.filter((p) => myPermissionNames.has(p.name)).map((p) => p.id);

    setBuilderSelectedPermissions(autoSelected);
  }, [builderRoleId, allRoles, myPermissions]);

  const canAddAllocation =
    builderCityId !== null && builderSelectedFacilityIds.length > 0 && builderRoleId !== null;

  function handleAddAllocation() {
    if (!canAddAllocation || !builderCityId || !builderRoleId) return;

    const city = cities.find((c) => c.id === builderCityId);
    const role = allRoles.find((r) => r.id === builderRoleId);
    if (!city || !role) return;

    const duplicateFacilityNames = builderFacilities
      .filter((f) => {
        const isSelected = builderSelectedFacilityIds.includes(f.id);
        if (!isSelected) return false;
        return allocations.some(
          (a) =>
            a.id !== editingAllocId && a.roleId === builderRoleId && a.facilityIds.includes(f.id),
        );
      })
      .map((f) => f.name);

    if (duplicateFacilityNames.length > 0) {
      notifications.show({
        title: "Alocação Duplicada",
        message: `O cargo "${role.displayName}" já está alocado para a(s) unidade(s) "${duplicateFacilityNames.join(
          ", ",
        )}" neste perfil de usuário.`,
        color: "yellow",
        autoClose: 10000,
      });
      return;
    }

    const selectedFacilityNames = builderFacilities
      .filter((f) => builderSelectedFacilityIds.includes(f.id))
      .map((f) => f.name);

    if (editingAllocId) {
      const updatedAllocations = allocations.map((a) => {
        if (a.id === editingAllocId) {
          return {
            ...a,
            roleId: builderRoleId,
            roleDisplayName: role.displayName,
            facilityIds: builderSelectedFacilityIds,
            facilityNames: selectedFacilityNames,
            cityId: builderCityId,
            cityName: `${city.name}${city.state ? ` / ${city.state}` : ""}`,
            permissionIds: builderSelectedPermissions,
          };
        }
        return a;
      });
      setValue("allocations", updatedAllocations, { shouldValidate: true });
      setEditingAllocId(null);
    } else {
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
    }

    setBuilderCityId(null);
    setBuilderSelectedFacilityIds([]);
    setBuilderRoleId(null);
    setBuilderSelectedPermissions([]);
    setRoleCategory("FUNCTIONAL");
  }

  function handleEditAllocation(id: string) {
    const alloc = allocations.find((a) => a.id === id);
    if (!alloc) return;

    setEditingAllocId(id);
    skipAutoSelectRef.current = true;

    const role = allRoles.find((r) => r.id === alloc.roleId);
    if (role) {
      setRoleCategory(role.category as RoleCategory);
    }

    setBuilderCityId(alloc.cityId);
    setBuilderSelectedFacilityIds(alloc.facilityIds);
    setBuilderRoleId(alloc.roleId);
    setBuilderSelectedPermissions(alloc.permissionIds);
  }

  function handleCancelEdit() {
    setEditingAllocId(null);
    setBuilderCityId(null);
    setBuilderSelectedFacilityIds([]);
    setBuilderRoleId(null);
    setBuilderSelectedPermissions([]);
    setRoleCategory("FUNCTIONAL");
  }

  function handleRemoveAllocation(id: string) {
    if (editingAllocId === id) {
      handleCancelEdit();
    }
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
            {myPermissions.some((p) => p.name === "users.grant_functional_roles")
              ? "Você pode atribuir qualquer cargo funcional. Para cargos administrativos, apenas permissões que você possui podem ser concedidas."
              : "Você só pode atribuir permissões que você possui. Permissões que excedem as suas ficam desabilitadas."}
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
              background: editingAllocId ? "var(--info-blue, #228be6)" : "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {editingAllocId ? (
              <FaEdit size={14} color="white" />
            ) : (
              <FaPlus size={14} color="white" />
            )}
          </Box>
          <Title order={5} c="var(--text-main)">
            {editingAllocId ? "Editar Alocação" : "Nova Alocação"}
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

          {editingAllocId ? (
            <Group gap="sm" mt="sm">
              <Button
                id="alloc-save-btn"
                leftSection={<FaEdit size={12} />}
                color="blue"
                disabled={!canAddAllocation}
                onClick={handleAddAllocation}
              >
                Salvar Alterações
              </Button>
              <Button
                id="alloc-cancel-btn"
                variant="subtle"
                color="gray"
                onClick={handleCancelEdit}
              >
                Cancelar
              </Button>
            </Group>
          ) : (
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
          )}
        </Stack>
      </Card>

      {allocations.length > 0 && (
        <AllocationList
          allocations={allocations}
          allRoles={allRoles}
          onRemove={handleRemoveAllocation}
          onEdit={handleEditAllocation}
        />
      )}

      {allocations.length === 0 && <EmptyAllocationsPlaceholder />}
    </Stack>
  );
}
