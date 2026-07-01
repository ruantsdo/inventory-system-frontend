import {
  Box,
  Checkbox,
  Divider,
  Group,
  Loader,
  MultiSelect,
  SegmentedControl,
  Select,
  Text,
  Tooltip,
} from "@mantine/core";
import { FaBuilding, FaCity, FaClipboardList } from "react-icons/fa";
import type {
  CityOutput,
  FacilityOutput,
  PermissionOutput,
  RoleCategory,
  RoleWithPermissionsOutput,
} from "../../../../types/api.contracts";

interface PermissionWithGrant {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  canGrant: boolean;
}

interface AllocationBuilderProps {
  cities: CityOutput[];
  allRoles: RoleWithPermissionsOutput[];
  myPermissions: PermissionOutput[];

  builderCityId: string | null;
  onCityChange: (cityId: string | null) => void;

  builderFacilities: FacilityOutput[];
  builderFacilitiesLoading: boolean;
  builderSelectedFacilityIds: string[];
  onFacilityIdsChange: (ids: string[]) => void;

  builderRoleId: string | null;
  onRoleChange: (roleId: string | null) => void;

  builderSelectedPermissions: string[];
  onPermissionToggle: (permId: string, checked: boolean) => void;

  roleCategory: RoleCategory;
  onRoleCategoryChange: (category: RoleCategory) => void;
}

export function AllocationBuilder({
  cities,
  allRoles,
  myPermissions,
  builderCityId,
  onCityChange,
  builderFacilities,
  builderFacilitiesLoading,
  builderSelectedFacilityIds,
  onFacilityIdsChange,
  builderRoleId,
  onRoleChange,
  builderSelectedPermissions,
  onPermissionToggle,
  roleCategory,
  onRoleCategoryChange,
}: AllocationBuilderProps) {
  const myPermissionNames = new Set(myPermissions.map((p) => p.name));

  const rolesInSelectedCategory = allRoles.filter((role) => role.category === roleCategory);

  const availableRoles = rolesInSelectedCategory.filter((role) =>
    role.permissions.some((p) => myPermissionNames.has(p.name)),
  );

  const selectedRole = allRoles.find((r) => r.id === builderRoleId) ?? null;

  const rolePermissions: PermissionWithGrant[] =
    selectedRole?.permissions.map((p) => ({
      ...p,
      canGrant: myPermissionNames.has(p.name),
    })) ?? [];

  return (
    <>
      <Box>
        <Group gap={6} mb={6}>
          <FaCity size={12} color="var(--text-secondary)" />
          <Text size="sm" fw={600} c="var(--text-main)">
            1. Selecione a Cidade
          </Text>
        </Group>
        <Select
          id="alloc-city-select"
          placeholder="Buscar cidade..."
          searchable
          clearable
          data={cities.map((c) => ({
            value: c.id,
            label: `${c.name}${c.state ? ` / ${c.state}` : ""}`,
          }))}
          value={builderCityId}
          onChange={(v) => {
            onCityChange(v);
            onFacilityIdsChange([]);
          }}
        />
      </Box>

      {builderCityId && (
        <Box>
          <Group gap={6} mb={6}>
            <FaBuilding size={12} color="var(--text-secondary)" />
            <Text size="sm" fw={600} c="var(--text-main)">
              2. Selecione a(s) Unidade(s)
            </Text>
            {builderFacilitiesLoading && <Loader size="xs" />}
          </Group>
          <MultiSelect
            id="alloc-facilities-select"
            placeholder={
              builderFacilitiesLoading ? "Carregando unidades..." : "Selecionar unidades..."
            }
            searchable
            data={builderFacilities.map((f) => ({
              value: f.id,
              label: f.name,
            }))}
            value={builderSelectedFacilityIds}
            onChange={onFacilityIdsChange}
            disabled={builderFacilitiesLoading}
          />
        </Box>
      )}

      {builderSelectedFacilityIds.length > 0 && (
        <Box>
          <Group gap={6} mb={6}>
            <FaClipboardList size={12} color="var(--text-secondary)" />
            <Text size="sm" fw={600} c="var(--text-main)">
              3. Selecione o Cargo
            </Text>
          </Group>
          <SegmentedControl
            id="alloc-role-category"
            value={roleCategory}
            onChange={(val) => {
              onRoleCategoryChange(val as RoleCategory);
              onRoleChange(null);
            }}
            data={[
              { label: "Funcional", value: "FUNCTIONAL" },
              { label: "Administrativo", value: "ADMINISTRATIVE" },
            ]}
            fullWidth
            mb="xs"
            radius="md"
          />
          <Select
            id="alloc-role-select"
            placeholder="Selecionar cargo..."
            searchable
            clearable
            data={availableRoles.map((r) => ({
              value: r.id,
              label: r.displayName,
              description: r.description ?? undefined,
            }))}
            value={builderRoleId}
            onChange={onRoleChange}
          />
          {rolesInSelectedCategory.length > availableRoles.length && (
            <Text size="xs" c="dimmed" mt={4}>
              {rolesInSelectedCategory.length - availableRoles.length} cargo(s) deste tipo oculto(s) por excederem suas
              permissões.
            </Text>
          )}
        </Box>
      )}

      {builderRoleId && rolePermissions.length > 0 && (
        <PermissionSelector
          rolePermissions={rolePermissions}
          selectedPermissions={builderSelectedPermissions}
          onPermissionToggle={onPermissionToggle}
        />
      )}
    </>
  );
}

interface PermissionSelectorProps {
  rolePermissions: PermissionWithGrant[];
  selectedPermissions: string[];
  onPermissionToggle: (permId: string, checked: boolean) => void;
}

function PermissionSelector({
  rolePermissions,
  selectedPermissions,
  onPermissionToggle,
}: PermissionSelectorProps) {
  return (
    <Box>
      <Divider my="xs" />
      <Text size="sm" fw={600} c="var(--text-main)" mb="xs">
        4. Ajustar Permissões (opcional)
      </Text>
      <Box style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {rolePermissions.map((perm) => {
          const isSelected = selectedPermissions.includes(perm.id);
          return (
            <Tooltip
              key={perm.id}
              label={
                !perm.canGrant
                  ? "Você não pode conceder esta permissão."
                  : perm.description || perm.displayName || "Nenhuma descrição disponível"
              }
              withArrow
              arrowSize={8}
              multiline
              maw={240}
              transitionProps={{ transition: "fade-up", duration: 200 }}
            >
              <Checkbox.Card
                id={`perm-card-${perm.id}`}
                checked={isSelected && perm.canGrant}
                disabled={!perm.canGrant}
                onClick={() => {
                  if (perm.canGrant) {
                    onPermissionToggle(perm.id, !isSelected);
                  }
                }}
                p="xs"
                style={{
                  width: 200,
                  minHeight: 50,
                  cursor: perm.canGrant ? "pointer" : "not-allowed",
                }}
              >
                <Group wrap="nowrap" align="flex-start" gap="xs" style={{ width: "100%" }}>
                  <Box style={{ flexShrink: 0, paddingTop: 2 }}>
                    <Checkbox.Indicator />
                  </Box>
                  <Text
                    size="sm"
                    c={perm.canGrant ? "var(--text-main)" : "dimmed"}
                    style={{
                      textDecoration: perm.canGrant ? "none" : "line-through",
                      lineHeight: 1.4,
                    }}
                  >
                    {perm.displayName}
                  </Text>
                </Group>
              </Checkbox.Card>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}
