import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Group,
  Paper,
  Skeleton,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { useUtilsStore } from "../../../../../stores/utils";
import type { UserListItem } from "../../../../../types/usersDashboard";
import { ProfileModal } from "../ProfileModal";

interface UsersTableProps {
  users: UserListItem[];
  loading: boolean;
}

function UserRowSkeleton() {
  return (
    <Table.Tr>
      {Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are static placeholders
        <Table.Td key={i}>
          <Skeleton height={18} radius="sm" />
        </Table.Td>
      ))}
    </Table.Tr>
  );
}

export function UsersTable({ users, loading }: UsersTableProps) {
  const { checkPermission } = useUtilsStore();
  const canUpdate = checkPermission("users.update");

  const [opened, { open, close }] = useDisclosure(false);
  const [userId, setUserId] = useState<string>("");

  const handleProfileModal = (userId: string) => {
    if (opened) {
      close();
    } else {
      setUserId(userId);
      open();
    }
  };

  const rows = loading
    ? Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
        <UserRowSkeleton key={i} />
      ))
    : users.map((user) => (
        <Table.Tr key={user.id} className="hover:bg-surface-hover transition-colors duration-150">
          <Table.Td>
            <Group gap="sm" wrap="nowrap">
              <Avatar name={user.fullName} color="initials" size={34} radius="xl" />
              <Box style={{ minWidth: 0 }}>
                <Text size="sm" fw={600} c="var(--text-main)" truncate>
                  {user.fullName}
                </Text>
                <Text size="xs" c="var(--text-secondary)" truncate>
                  {user.email}
                </Text>
              </Box>
            </Group>
          </Table.Td>

          <Table.Td>
            <Text size="sm" c="var(--text-secondary)">
              {user.roles.map((r) => r.role.displayName).join(", ") || "—"}
            </Text>
          </Table.Td>

          <Table.Td>
            <Badge variant="light" color={user.isActive ? "green" : "gray"} radius="md" size="sm">
              {user.isActive ? "Ativo" : "Inativo"}
            </Badge>
          </Table.Td>

          <Table.Td>
            <Group gap={6} justify="flex-end">
              <Tooltip label="Ver detalhes" withArrow position="top">
                <ActionIcon
                  id={`user-view-${user.id}`}
                  variant="subtle"
                  color="blue"
                  size="sm"
                  radius="md"
                  onClick={() => handleProfileModal(user.id)}
                >
                  <FaEye size={13} />
                </ActionIcon>
              </Tooltip>

              {canUpdate && (
                <Tooltip label="Editar usuário" withArrow position="top">
                  <ActionIcon
                    id={`user-edit-${user.id}`}
                    variant="subtle"
                    color="green"
                    size="sm"
                    radius="md"
                    onClick={() => handleProfileModal(user.id)}
                  >
                    <FaEdit size={13} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
          </Table.Td>
        </Table.Tr>
      ));

  return (
    <Paper radius="lg" className="bg-surface border border-border overflow-hidden">
      <Table striped highlightOnHover verticalSpacing="sm" horizontalSpacing="md" stickyHeader>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                Usuário
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                Cargo
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                Status
              </Text>
            </Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {!loading && users.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Box className="flex flex-col items-center justify-center py-12 gap-2">
                  <Text size="sm" c="var(--text-secondary)">
                    Nenhum usuário encontrado para os filtros aplicados.
                  </Text>
                </Box>
              </Table.Td>
            </Table.Tr>
          ) : (
            rows
          )}
        </Table.Tbody>
      </Table>
      {opened && <ProfileModal opened={opened} handleClose={close} targetId={userId} />}
    </Paper>
  );
}
