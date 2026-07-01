import { Avatar, Box, Button, Card, Group, Modal, Stack, Text, Title } from "@mantine/core";
import { FaExclamationTriangle } from "react-icons/fa";
import { useUserManagementStore } from "../../../../stores/app/userManagement";
import type { UserListItem } from "../../../../types/usersDashboard";

interface DeleteUserConfirmModalProps {
  deleteOpened: boolean;
  setDeleteOpened: (value: boolean) => void;
  user: UserListItem;
  onSuccess?: () => void;
}

export function DeleteUserConfirmModal({
  deleteOpened,
  setDeleteOpened,
  user,
  onSuccess,
}: DeleteUserConfirmModalProps) {
  const { deleteUser, loading } = useUserManagementStore();

  const handleDeleteUser = async () => {
    await deleteUser(user.id);
    setDeleteOpened(false);
    onSuccess?.();
  };

  return (
    <Modal
      opened={deleteOpened}
      onClose={() => setDeleteOpened(false)}
      withCloseButton={false}
      centered
      radius="lg"
      size="sm"
      overlayProps={{ blur: 4, backgroundOpacity: 0.4 }}
    >
      <Stack align="center" gap="md" py="md" px="xs">
        <Box
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "color-mix(in srgb, var(--status-error) 15%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaExclamationTriangle size={36} color="var(--status-error)" />
        </Box>

        <Title order={3} ta="center" c="var(--text-main)" fw={700}>
          Remover usuário?
        </Title>

        <Text c="var(--text-secondary)" ta="center" size="sm" style={{ lineHeight: 1.5 }}>
          Esta ação não pode ser desfeita. Tem certeza que deseja remover permanentemente o seguinte usuário do sistema?
        </Text>

        <Card withBorder padding="sm" radius="md" style={{ width: "100%" }}>
          <Group gap="sm" wrap="nowrap">
            <Avatar name={user.fullName} color="initials" size="md" radius="xl" />
            <Box style={{ minWidth: 0, flex: 1 }}>
              <Text size="sm" fw={600} c="var(--text-main)" truncate>
                {user.fullName}
              </Text>
              <Text size="xs" c="var(--text-secondary)" truncate>
                {user.email}
              </Text>
              {user.roles && user.roles.length > 0 && (
                <Text
                  size="10px"
                  c="var(--text-secondary)"
                  fw={500}
                  mt={2}
                  style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
                >
                  {user.roles.map((r) => r.role.displayName).join(", ")}
                </Text>
              )}
            </Box>
          </Group>
        </Card>

        <Group mt="md" justify="center" gap="sm" className="w-full flex-nowrap">
          <Button
            id="cancel-delete-btn"
            variant="default"
            disabled={loading}
            onClick={() => setDeleteOpened(false)}
            className="flex-1"
            radius="md"
            size="md"
          >
            Cancelar
          </Button>
          <Button
            id="confirm-delete-btn"
            color="red"
            loading={loading}
            onClick={handleDeleteUser}
            className="flex-1"
            radius="md"
            size="md"
          >
            Remover
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

