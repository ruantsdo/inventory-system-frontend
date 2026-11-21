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
import { FaEdit, FaEye, FaPause, FaPlay, FaTrash } from "react-icons/fa";
import { ActionConfirmModal } from "../../../../../components";
import * as usersService from "../../../../../services/users";
import { useUtilsStore } from "../../../../../stores/utils";
import type { UserListItem } from "../../../../../types/usersDashboard";
import { ProfileModal } from "../ProfileModal";

interface UsersTableProps {
  users: UserListItem[];
  loading: boolean;
  refetch: () => Promise<void> | void;
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

export function UsersTable({ users, loading, refetch }: UsersTableProps) {
  const { checkPermission, handleNavigation } = useUtilsStore();

  const canUpdate = checkPermission("users.update");
  const canDelete = checkPermission("users.delete");
  const canDeactivate = checkPermission("users.deactivate");
  const canActivate = checkPermission("users.activate");

  const [opened, { open, close }] = useDisclosure(false);
  const [userId, setTargetId] = useState<string>("");

  const [confirmModalOpened, setConfirmModalOpened] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"delete" | "deactivate" | "reactivate">(
    "delete",
  );
  const [targetUser, setTargetUser] = useState<UserListItem>();

  const handleProfileModal = (userId: string) => {
    if (opened) {
      close();
    } else {
      setTargetId(userId);
      open();
    }
  };

  const handleDeleteClick = (user: UserListItem) => {
    setTargetUser(user);
    setConfirmAction("delete");
    setConfirmModalOpened(true);
  };

  const handleChangeUserState = (user: UserListItem) => {
    setTargetUser(user);
    setConfirmAction(user.isActive ? "deactivate" : "reactivate");
    setConfirmModalOpened(true);
  };

  const handleConfirmAction = async () => {
    if (!targetUser) return;
    setActionLoading(true);
    try {
      if (confirmAction === "delete") {
        await usersService.deleteUser(targetUser.id);
      } else if (confirmAction === "deactivate") {
        await usersService.deactivateUser(targetUser.id);
      } else {
        await usersService.reactivateUser(targetUser.id);
      }
      setConfirmModalOpened(false);
      await refetch();
    } finally {
      setActionLoading(false);
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
                <Tooltip label="Editar" withArrow position="top">
                  <ActionIcon
                    id={`user-edit-${user.id}`}
                    variant="subtle"
                    color="green"
                    size="sm"
                    radius="md"
                    onClick={() => handleNavigation(`/users/edit/${user.id}`, "users.update")}
                  >
                    <FaEdit size={13} />
                  </ActionIcon>
                </Tooltip>
              )}

              {user.isActive && canDeactivate && (
                <Tooltip label="Desativar" withArrow position="top">
                  <ActionIcon
                    id={`user-deactivate-${user.id}`}
                    variant="subtle"
                    color="orange"
                    size="sm"
                    radius="md"
                    onClick={() => handleChangeUserState(user)}
                  >
                    <FaPause size={12} />
                  </ActionIcon>
                </Tooltip>
              )}

              {!user.isActive && canActivate && (
                <Tooltip label="Ativar" withArrow position="top">
                  <ActionIcon
                    id={`user-activate-${user.id}`}
                    variant="subtle"
                    color="teal"
                    size="sm"
                    radius="md"
                    onClick={() => handleChangeUserState(user)}
                  >
                    <FaPlay size={12} />
                  </ActionIcon>
                </Tooltip>
              )}

              {canDelete && (
                <Tooltip label="Remover" withArrow position="top">
                  <ActionIcon
                    id={`user-delete-${user.id}`}
                    variant="subtle"
                    color="red"
                    size="sm"
                    radius="md"
                    onClick={() => handleDeleteClick(user)}
                  >
                    <FaTrash size={12} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
          </Table.Td>
        </Table.Tr>
      ));

  return (
    <Paper radius="md" withBorder className="border-border bg-surface overflow-hidden">
      <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
        <Table.Thead className="bg-background">
          <Table.Tr>
            <Table.Th>Usuário</Table.Th>
            <Table.Th>Cargos</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th style={{ textAlign: "right" }}>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.length === 0 && !loading ? (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Box py="xl" ta="center">
                  <Text size="sm" c="var(--text-secondary)">
                    Nenhum usuário encontrado.
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
      {confirmModalOpened && targetUser && (
        <ActionConfirmModal
          opened={confirmModalOpened}
          onClose={() => setConfirmModalOpened(false)}
          action={confirmAction}
          loading={actionLoading}
          onConfirm={handleConfirmAction}
          itemDetails={{
            avatar: { name: targetUser.fullName },
            title: targetUser.fullName,
            subtitle: targetUser.email,
            badge:
              targetUser.roles && targetUser.roles.length > 0
                ? targetUser.roles.map((r) => r.role.displayName).join(", ")
                : undefined,
          }}
        />
      )}
    </Paper>
  );
}
