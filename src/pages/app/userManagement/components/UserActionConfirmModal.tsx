import { Avatar, Box, Button, Card, Group, Modal, Stack, Text, Title } from "@mantine/core";
import { FaExclamationTriangle } from "react-icons/fa";
import { useUserManagementStore } from "../../../../stores/app/userManagement";
import type { UserListItem } from "../../../../types/usersDashboard";

interface UserActionConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  user: UserListItem;
  action: "delete" | "deactivate" | "reactivate";
  onSuccess?: () => void;
}

export function UserActionConfirmModal({
  opened,
  onClose,
  user,
  action,
  onSuccess,
}: UserActionConfirmModalProps) {
  const { deleteUser, deactivateUser, reactivateUser, loading } = useUserManagementStore();

  const handleConfirm = async () => {
    if (action === "delete") {
      await deleteUser(user.id);
    } else if (action === "deactivate") {
      await deactivateUser(user.id);
    } else {
      await reactivateUser(user.id);
    }
    onClose();
    onSuccess?.();
  };

  const getConfig = () => {
    switch (action) {
      case "delete":
        return {
          title: "Remover usuário?",
          description:
            "Esta ação não pode ser desfeita. Tem certeza que deseja remover permanentemente o seguinte usuário do sistema?",
          confirmColor: "red",
          confirmLabel: "Remover",
          iconColor: "var(--status-error)",
          iconBg: "color-mix(in srgb, var(--status-error) 15%, transparent)",
          confirmBtnId: "confirm-delete-btn",
          cancelBtnId: "cancel-delete-btn",
        };
      case "deactivate":
        return {
          title: "Desativar usuário?",
          description:
            "O usuário perderá o acesso ao sistema até ser reativado. Tem certeza que deseja desativar o seguinte usuário?",
          confirmColor: "orange",
          confirmLabel: "Desativar",
          iconColor: "var(--status-warning)",
          iconBg: "color-mix(in srgb, var(--status-warning) 15%, transparent)",
          confirmBtnId: "confirm-deactivate-btn",
          cancelBtnId: "cancel-deactivate-btn",
        };
      case "reactivate":
        return {
          title: "Reativar usuário?",
          description:
            "O usuário recuperará o acesso ao sistema. Tem certeza que deseja reativar o seguinte usuário?",
          confirmColor: "green",
          confirmLabel: "Reativar",
          iconColor: "var(--status-success)",
          iconBg: "color-mix(in srgb, var(--status-success) 15%, transparent)",
          confirmBtnId: "confirm-reactivate-btn",
          cancelBtnId: "cancel-reactivate-btn",
        };
    }
  };

  const config = getConfig();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
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
            background: config.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaExclamationTriangle size={36} color={config.iconColor} />
        </Box>

        <Title order={3} ta="center" c="var(--text-main)" fw={700}>
          {config.title}
        </Title>

        <Text c="var(--text-secondary)" ta="center" size="sm" style={{ lineHeight: 1.5 }}>
          {config.description}
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
            id={config.cancelBtnId}
            variant="default"
            disabled={loading}
            onClick={onClose}
            className="flex-1"
            radius="md"
            size="md"
          >
            Cancelar
          </Button>
          <Button
            id={config.confirmBtnId}
            color={config.confirmColor}
            loading={loading}
            onClick={handleConfirm}
            className="flex-1"
            radius="md"
            size="md"
          >
            {config.confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
