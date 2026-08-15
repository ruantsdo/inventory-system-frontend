import { Avatar, Box, Button, Card, Group, Modal, type ModalProps, Stack, Text, Title } from "@mantine/core";
import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export type ActionConfirmType =
  | "delete"
  | "deactivate"
  | "reactivate"
  | "warning"
  | "info"
  | "success"
  | "custom";

export interface ActionConfirmItemDetails {
  avatar?: {
    name?: string;
    src?: string;
    icon?: React.ReactNode;
    color?: string;
  };
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  extra?: React.ReactNode;
}

export interface ActionConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  action?: ActionConfirmType;
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  iconColor?: string;
  iconBg?: string;
  confirmBtnId?: string;
  cancelBtnId?: string;
  itemDetails?: ActionConfirmItemDetails;
  children?: React.ReactNode;
  size?: ModalProps["size"];
  zIndex?: number;
}

interface ActionPresetConfig {
  title: string;
  description: string;
  confirmColor: string;
  confirmLabel: string;
  iconColor: string;
  iconBg: string;
  confirmBtnId: string;
  cancelBtnId: string;
}

const ACTION_PRESETS: Record<ActionConfirmType, ActionPresetConfig> = {
  delete: {
    title: "Remover item?",
    description:
      "Esta ação não pode ser desfeita. Tem certeza que deseja remover permanentemente este item do sistema?",
    confirmColor: "red",
    confirmLabel: "Remover",
    iconColor: "var(--status-error)",
    iconBg: "color-mix(in srgb, var(--status-error) 15%, transparent)",
    confirmBtnId: "confirm-delete-btn",
    cancelBtnId: "cancel-delete-btn",
  },
  deactivate: {
    title: "Desativar item?",
    description:
      "O item perderá o acesso ou visibilidade no sistema até ser reativado. Tem certeza que deseja desativá-lo?",
    confirmColor: "orange",
    confirmLabel: "Desativar",
    iconColor: "var(--status-warning)",
    iconBg: "color-mix(in srgb, var(--status-warning) 15%, transparent)",
    confirmBtnId: "confirm-deactivate-btn",
    cancelBtnId: "cancel-deactivate-btn",
  },
  reactivate: {
    title: "Reativar item?",
    description:
      "O item recuperará o acesso ou visibilidade no sistema. Tem certeza que deseja reativá-lo?",
    confirmColor: "green",
    confirmLabel: "Reativar",
    iconColor: "var(--status-success)",
    iconBg: "color-mix(in srgb, var(--status-success) 15%, transparent)",
    confirmBtnId: "confirm-reactivate-btn",
    cancelBtnId: "cancel-reactivate-btn",
  },
  warning: {
    title: "Atenção",
    description: "Tem certeza que deseja prosseguir com esta ação?",
    confirmColor: "orange",
    confirmLabel: "Confirmar",
    iconColor: "var(--status-warning)",
    iconBg: "color-mix(in srgb, var(--status-warning) 15%, transparent)",
    confirmBtnId: "confirm-warning-btn",
    cancelBtnId: "cancel-warning-btn",
  },
  info: {
    title: "Confirmação",
    description: "Deseja prosseguir com esta operação?",
    confirmColor: "blue",
    confirmLabel: "Confirmar",
    iconColor: "var(--secondary)",
    iconBg: "color-mix(in srgb, var(--secondary) 15%, transparent)",
    confirmBtnId: "confirm-info-btn",
    cancelBtnId: "cancel-info-btn",
  },
  success: {
    title: "Confirmação",
    description: "Deseja confirmar esta operação?",
    confirmColor: "green",
    confirmLabel: "Confirmar",
    iconColor: "var(--status-success)",
    iconBg: "color-mix(in srgb, var(--status-success) 15%, transparent)",
    confirmBtnId: "confirm-success-btn",
    cancelBtnId: "cancel-success-btn",
  },
  custom: {
    title: "Confirmar ação",
    description: "Deseja prosseguir com esta operação?",
    confirmColor: "blue",
    confirmLabel: "Confirmar",
    iconColor: "var(--text-main)",
    iconBg: "color-mix(in srgb, var(--text-main) 10%, transparent)",
    confirmBtnId: "confirm-action-btn",
    cancelBtnId: "cancel-action-btn",
  },
};

export function ActionConfirmModal({
  opened,
  onClose,
  onConfirm,
  action = "delete",
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  confirmColor,
  loading: externalLoading,
  icon,
  iconColor,
  iconBg,
  confirmBtnId,
  cancelBtnId,
  itemDetails,
  children,
  size = "sm",
  zIndex,
}: ActionConfirmModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preset = ACTION_PRESETS[action] || ACTION_PRESETS.delete;

  const resolvedTitle = title ?? preset.title;
  const resolvedDescription = description ?? preset.description;
  const resolvedConfirmLabel = confirmLabel ?? preset.confirmLabel;
  const resolvedConfirmColor = confirmColor ?? preset.confirmColor;
  const resolvedIconColor = iconColor ?? preset.iconColor;
  const resolvedIconBg = iconBg ?? preset.iconBg;
  const resolvedConfirmBtnId = confirmBtnId ?? preset.confirmBtnId;
  const resolvedCancelBtnId = cancelBtnId ?? preset.cancelBtnId;

  const isLoading = externalLoading ?? isSubmitting;

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered
      radius="lg"
      size={size}
      zIndex={zIndex}
      overlayProps={{ blur: 4, backgroundOpacity: 0.4 }}
    >
      <Stack align="center" gap="md" py="md" px="xs">
        <Box
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: resolvedIconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon ?? <FaExclamationTriangle size={36} color={resolvedIconColor} />}
        </Box>

        {resolvedTitle && (
          <Title order={3} ta="center" c="var(--text-main)" fw={700}>
            {resolvedTitle}
          </Title>
        )}

        {resolvedDescription && (
          <Text c="var(--text-secondary)" ta="center" size="sm" style={{ lineHeight: 1.5 }}>
            {resolvedDescription}
          </Text>
        )}

        {itemDetails && (
          <Card withBorder padding="sm" radius="md" style={{ width: "100%" }}>
            <Group gap="sm" wrap="nowrap">
              {itemDetails.avatar?.icon ? (
                <Box
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "color-mix(in srgb, var(--primary) 12%, transparent)",
                  }}
                >
                  {itemDetails.avatar.icon}
                </Box>
              ) : itemDetails.avatar?.src ? (
                <Avatar src={itemDetails.avatar.src} size="md" radius="xl" />
              ) : itemDetails.avatar?.name ? (
                <Avatar
                  name={itemDetails.avatar.name}
                  color={itemDetails.avatar.color || "initials"}
                  size="md"
                  radius="xl"
                />
              ) : typeof itemDetails.title === "string" ? (
                <Avatar name={itemDetails.title} color="initials" size="md" radius="xl" />
              ) : null}

              <Box style={{ minWidth: 0, flex: 1 }}>
                <Text size="sm" fw={600} c="var(--text-main)" truncate>
                  {itemDetails.title}
                </Text>

                {itemDetails.subtitle && (
                  <Text size="xs" c="var(--text-secondary)" truncate>
                    {itemDetails.subtitle}
                  </Text>
                )}

                {itemDetails.badge && (
                  typeof itemDetails.badge === "string" ? (
                    <Text
                      size="10px"
                      c="var(--text-secondary)"
                      fw={500}
                      mt={2}
                      style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
                    >
                      {itemDetails.badge}
                    </Text>
                  ) : (
                    <Box mt={2}>{itemDetails.badge}</Box>
                  )
                )}

                {itemDetails.extra && <Box mt={4}>{itemDetails.extra}</Box>}
              </Box>
            </Group>
          </Card>
        )}

        {children}

        <Group mt="md" justify="center" gap="sm" className="w-full flex-nowrap">
          <Button
            id={resolvedCancelBtnId}
            variant="default"
            disabled={isLoading}
            onClick={onClose}
            className="flex-1"
            radius="md"
            size="md"
          >
            {cancelLabel}
          </Button>
          <Button
            id={resolvedConfirmBtnId}
            color={resolvedConfirmColor}
            loading={isLoading}
            onClick={handleConfirm}
            className="flex-1"
            radius="md"
            size="md"
          >
            {resolvedConfirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
