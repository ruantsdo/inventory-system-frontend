import { ActionIcon, Box, Text } from "@mantine/core";
import { FaBars, FaChevronLeft } from "react-icons/fa";
import { APP_LOGO_ICON, APP_NAME } from "./nav.config";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  activeLabel: string;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}

export function SidebarHeader({
  isCollapsed,
  activeLabel,
  mobileOpen,
  onToggle,
  onMobileClose,
}: SidebarHeaderProps) {
  const handleToggleClick = () => {
    if (mobileOpen) {
      onMobileClose();
    } else {
      onToggle();
    }
  };

  return (
    <Box
      className={`flex items-center h-16 border-b border-border px-3 ${
        isCollapsed ? "justify-center" : "justify-between"
      }`}
    >
      {!isCollapsed && (
        <Box className="flex items-center gap-2 overflow-hidden">
          <Box className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            {APP_LOGO_ICON}
          </Box>
          <Box className="min-w-0">
            <Text size="sm" fw={700} className="text-text-main truncate">
              {APP_NAME}
            </Text>
            <Text size="xs" className="text-text-secondary truncate">
              {activeLabel}
            </Text>
          </Box>
        </Box>
      )}

      <ActionIcon
        variant="subtle"
        size="lg"
        radius="md"
        onClick={handleToggleClick}
        className="text-text-secondary hover:bg-surface-hover"
      >
        {isCollapsed ? <FaBars size={18} /> : <FaChevronLeft size={16} />}
      </ActionIcon>
    </Box>
  );
}
