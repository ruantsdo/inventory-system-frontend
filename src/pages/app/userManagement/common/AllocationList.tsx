import { ActionIcon, Badge, Card, Group, Stack, Text } from "@mantine/core";
import { FaBuilding, FaClipboardList, FaTrash } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import type { RoleWithPermissionsOutput } from "../../../../types/api.contracts";
import type { AllocationEntry } from "../../../../types/createUser";

interface AllocationListProps {
  allocations: AllocationEntry[];
  allRoles: RoleWithPermissionsOutput[];
  onRemove: (id: string) => void;
}

export function AllocationList({ allocations, allRoles, onRemove }: AllocationListProps) {
  return (
    <Stack gap="sm">
      <Text fw={600} size="sm" c="var(--text-main)">
        Alocações Configuradas ({allocations.length})
      </Text>
      {allocations.map((alloc) => (
        <Card key={alloc.id} withBorder padding="md" radius="md">
          <Group justify="space-between" align="flex-start">
            <Stack gap={6} style={{ flex: 1 }}>
              <Group gap="xs">
                <Badge
                  color="green"
                  variant="light"
                  leftSection={<FaClipboardList size={10} />}
                >
                  {alloc.roleDisplayName}
                </Badge>
                <Group gap={4} wrap="wrap">
                  {alloc.facilityNames.map((name) => (
                    <Badge
                      key={name}
                      size="sm"
                      color="teal"
                      variant="outline"
                      leftSection={<FaBuilding size={10} />}
                    >
                      {name}
                    </Badge>
                  ))}
                </Group>
                <Badge
                  color="blue"
                  variant="light"
                  size="sm"
                  leftSection={<FaLocationCrosshairs size={10} />}
                >
                  {alloc.cityName}
                </Badge>
              </Group>

              <Text size="sm" c="dimmed">
                Permissões:{" "}
                {alloc.permissionIds.length > 0
                  ? allRoles
                      .find((role) => role.id === alloc.roleId)
                      ?.permissions.filter((p) => alloc.permissionIds.includes(p.id))
                      .map((p) => p.displayName)
                      .join(", ")
                  : "Nenhuma permissão selecionada"}
              </Text>
            </Stack>
            <ActionIcon
              id={`remove-alloc-${alloc.id}`}
              variant="subtle"
              color="red"
              size="sm"
              onClick={() => onRemove(alloc.id)}
            >
              <FaTrash size={12} />
            </ActionIcon>
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
