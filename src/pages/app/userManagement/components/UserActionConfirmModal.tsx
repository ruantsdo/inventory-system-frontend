import { ActionConfirmModal } from "../../../../components";
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

  const userActionConfigs = {
    delete: {
      title: "Remover usuário?",
      description:
        "Esta ação não pode ser desfeita. Tem certeza que deseja remover permanentemente o seguinte usuário do sistema?",
      confirmLabel: "Remover",
    },
    deactivate: {
      title: "Desativar usuário?",
      description:
        "O usuário perderá o acesso ao sistema até ser reativado. Tem certeza que deseja desativar o seguinte usuário?",
      confirmLabel: "Desativar",
    },
    reactivate: {
      title: "Reativar usuário?",
      description:
        "O usuário recuperará o acesso ao sistema. Tem certeza que deseja reativar o seguinte usuário?",
      confirmLabel: "Reativar",
    },
  };

  const config = userActionConfigs[action];

  return (
    <ActionConfirmModal
      opened={opened}
      onClose={onClose}
      action={action}
      title={config.title}
      description={config.description}
      confirmLabel={config.confirmLabel}
      loading={loading}
      onConfirm={handleConfirm}
      itemDetails={{
        avatar: { name: user.fullName },
        title: user.fullName,
        subtitle: user.email,
        badge:
          user.roles && user.roles.length > 0
            ? user.roles.map((r) => r.role.displayName).join(", ")
            : undefined,
      }}
    />
  );
}

