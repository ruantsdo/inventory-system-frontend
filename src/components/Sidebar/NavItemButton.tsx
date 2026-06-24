import { ActionIcon, Box, Button, Tooltip } from "@mantine/core";
import type { NavItem } from "../../types/navigation";

interface NavItemButtonProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: (path: string) => void;
}

export function NavItemButton({ item, isActive, isCollapsed, onClick }: NavItemButtonProps) {
  const activeVariant = isActive ? "light" : "subtle";
  const activeColor = isActive ? "green" : "gray";
  const inactiveClass = isActive ? "" : "text-text-secondary hover:text-text-main";

  const button = isCollapsed ? (
    <ActionIcon
      variant={activeVariant}
      color={activeColor}
      size="lg"
      radius="md"
      onClick={() => onClick(item.path)}
      className={inactiveClass}
    >
      {item.icon}
    </ActionIcon>
  ) : (
    <Button
      variant={activeVariant}
      color={activeColor}
      radius="md"
      fullWidth
      justify="flex-start"
      leftSection={item.icon}
      onClick={() => onClick(item.path)}
      classNames={{
        inner: "justify-start",
        label: "text-sm font-medium",
      }}
      className={inactiveClass}
    >
      {item.label}
    </Button>
  );

  if (isCollapsed) {
    return (
      <Tooltip label={item.label} position="right" withArrow>
        <Box className="flex justify-center">{button}</Box>
      </Tooltip>
    );
  }

  return button;
}
