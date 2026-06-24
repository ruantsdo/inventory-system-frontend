import {
  ActionIcon,
  Avatar,
  Box,
  Group,
  Indicator,
  Menu,
  Select,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  FaBell,
  FaMoon,
  FaSignOutAlt,
  FaSun,
  FaUser,
} from "react-icons/fa";
import { useFacilityContext } from "../../hooks/useFacilityContext";
import { useThemeToggle } from "../../hooks/useThemeToggle";
import { useAuthStore } from "../../stores/auth";
import type { AuthUser } from "../../types/user";

interface SidebarFooterProps {
  isCollapsed: boolean;
  user: AuthUser | null;
  onProfileOpen: () => void;
}

export function SidebarFooter({ isCollapsed, user, onProfileOpen }: SidebarFooterProps) {
  const { logout, currentSession } = useAuthStore();
  const { isDark, handleThemeToggle } = useThemeToggle();
  const { facilitySelectData, activeFacilityValue, handleFacilityChange, activeRoleDisplayName } =
    useFacilityContext();

  return (
    <Box className="mt-auto border-t border-border px-3 py-3 flex flex-col gap-1">
      <Box
        className={`flex ${isCollapsed ? "flex-col gap-3" : "flex-row"} justify-between items-center`}
      >
        <Menu closeOnItemClick={false}>
          <Menu.Target>
            <UnstyledButton className="flex items-center gap-3">
              <Group>
                <Avatar
                  key={user?.fullName}
                  name={user?.fullName}
                  color="initials"
                  size={isCollapsed ? 32 : 38}
                  radius="xl"
                />
                {!isCollapsed && (
                  <Box className="min-w-0 flex-1">
                    <Text size="sm" fw={600} className="text-text-main truncate">
                      {user?.fullName}
                    </Text>
                    <Text size="xs" className="text-text-secondary truncate">
                      {activeRoleDisplayName ?? currentSession?.roles?.[0]?.displayName}
                    </Text>
                  </Box>
                )}
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Interface</Menu.Label>
            <Menu.Item
              leftSection={
                isDark ? <FaSun size={16} color="orange" /> : <FaMoon size={16} color="blue" />
              }
              onClick={handleThemeToggle}
            >
              {isDark ? "Alterar Tema para Claro" : "Alterar Tema para Escuro"}
            </Menu.Item>

            <Menu.Divider />
            <Menu.Label>Alterar Unidade Ativa</Menu.Label>
            <Menu.Item component="div" closeMenuOnClick={false}>
              <Select
                variant="unstyled"
                placeholder="Selecione a unidade"
                data={facilitySelectData}
                value={activeFacilityValue}
                onChange={handleFacilityChange}
                allowDeselect={false}
                styles={{
                  input: { minWidth: 250 },
                }}
              />
            </Menu.Item>

            <Menu.Divider />
            <Menu.Label>Conta</Menu.Label>
            <Menu.Item
              onClick={onProfileOpen}
              leftSection={<FaUser size={16} />}
              color="blue"
            >
              Meu Perfil
            </Menu.Item>
            <Menu.Item onClick={logout} leftSection={<FaSignOutAlt size={16} />} color="red">
              Sair
            </Menu.Item>
          </Menu.Dropdown>

          <Tooltip label="Notificações" position="right" withArrow>
            <Box className="flex justify-center">
              <Indicator inline processing color="red" size={8} offset={4}>
                <ActionIcon
                  variant="outline"
                  size="lg"
                  radius="md"
                  className="text-text-secondary border-border hover:text-text-main"
                >
                  <FaBell size={16} />
                </ActionIcon>
              </Indicator>
            </Box>
          </Tooltip>
        </Menu>
      </Box>
    </Box>
  );
}
