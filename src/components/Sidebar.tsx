import { ActionIcon, Avatar, Box, Button, Indicator, Text, Tooltip } from "@mantine/core";

import {
  FaBars,
  FaBell,
  FaBoxes,
  FaChartBar,
  FaChevronLeft,
  FaCog,
  FaExchangeAlt,
  FaFileAlt,
  FaLayerGroup,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../stores/auth";
import type { NavItem, SidebarProps } from "../types/navigation";
import { ThemeToggle } from "./ThemeToggle";

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <FaTachometerAlt size={16} />,
    path: "/dashboard",
    permission: "dashboard.view",
  },
  { label: "Estoque", icon: <FaBoxes size={16} />, path: "/estoque", permission: "stock.view" },
  {
    label: "Requisições",
    icon: <FaFileAlt size={16} />,
    path: "/requisicoes",
    permission: "requests.view",
  },
  { label: "Lotes", icon: <FaLayerGroup size={16} />, path: "/lotes", permission: "lots.view" },
  {
    label: "Movimentações",
    icon: <FaExchangeAlt size={16} />,
    path: "/movimentacoes",
    permission: "movements.view",
  },
  {
    label: "Usuários",
    icon: <FaUsers size={16} />,
    path: "/users/create",
    permission: "users.view",
  },
];

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { logout, currentSession } = useAuthStore();
  const user = currentSession?.user ?? null;

  const isCollapsed = collapsed && !mobileOpen;

  const location = useLocation();
  const navigate = useNavigate();

  const activeItem =
    navItems.find((item) => location.pathname.startsWith(item.path))?.path || "/dashboard";

  const handleNavigation = (path: string) => {
    navigate(path);
    if (mobileOpen) {
      onMobileClose();
    }
  };

  return (
    <>
      {mobileOpen && (
        <Button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 bg-black/40 z-40 md:hidden border-none cursor-default"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
					fixed top-0 left-0 h-screen z-50
					bg-surface border-r border-border
					flex flex-col
					transition-all duration-300 ease-in-out
					${isCollapsed ? "w-[64px]" : "w-64"}
					${mobileOpen ? "translate-x-0" : "-translate-x-full"}
					md:translate-x-0 md:relative
				`}
      >
        <Box
          className={`flex items-center h-16 border-b border-border px-3 ${isCollapsed ? "justify-center" : "justify-between"}`}
        >
          {!isCollapsed && (
            <Box className="flex items-center gap-2 overflow-hidden">
              <Box className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <FaChartBar size={16} className="text-white" />
              </Box>
              <Box className="min-w-0">
                <Text size="sm" fw={700} className="text-text-main truncate">
                  Gestão de Estoque
                </Text>
                <Text size="xs" className="text-text-secondary truncate">
                  {navItems.find((item) => item.path === activeItem)?.label || "Dashboard"}
                </Text>
              </Box>
            </Box>
          )}

          <ActionIcon
            variant="subtle"
            size="lg"
            radius="md"
            onClick={() => {
              if (mobileOpen) {
                onMobileClose();
              } else {
                onToggle();
              }
            }}
            className="text-text-secondary hover:bg-surface-hover"
          >
            {isCollapsed ? <FaBars size={18} /> : <FaChevronLeft size={16} />}
          </ActionIcon>
        </Box>

        <nav className="flex flex-col py-4 px-3 gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.path === activeItem;

            const navButton = isCollapsed ? (
              <ActionIcon
                key={item.path}
                variant={isActive ? "light" : "subtle"}
                color={isActive ? "green" : "gray"}
                size="lg"
                radius="md"
                onClick={() => handleNavigation(item.path)}
                className={isActive ? "" : "text-text-secondary hover:text-text-main"}
              >
                {item.icon}
              </ActionIcon>
            ) : (
              <Button
                key={item.path}
                variant={isActive ? "light" : "subtle"}
                color={isActive ? "green" : "gray"}
                radius="md"
                fullWidth
                justify="flex-start"
                leftSection={item.icon}
                onClick={() => handleNavigation(item.path)}
                classNames={{
                  inner: "justify-start",
                  label: "text-sm font-medium",
                }}
                className={isActive ? "" : "text-text-secondary hover:text-text-main"}
              >
                {item.label}
              </Button>
            );

            return isCollapsed ? (
              <Tooltip key={item.path} label={item.label} position="right" withArrow>
                <Box className="flex justify-center">{navButton}</Box>
              </Tooltip>
            ) : (
              navButton
            );
          })}
        </nav>

        <Box className="mt-auto border-t border-border px-3 py-3 flex flex-col gap-1">
          {isCollapsed ? (
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
          ) : (
            <Indicator inline processing color="red" size={8} offset={4} className="w-full">
              <Button
                variant="outline"
                radius="md"
                fullWidth
                justify="flex-start"
                leftSection={<FaBell size={16} />}
                className="text-text-secondary border-border hover:text-text-main"
                classNames={{
                  inner: "justify-start",
                  label: "text-sm font-medium",
                }}
              >
                Notificações
              </Button>
            </Indicator>
          )}

          {isCollapsed ? (
            <Tooltip label="Configurações" position="right" withArrow>
              <Box className="flex justify-center">
                <ActionIcon
                  variant="outline"
                  size="lg"
                  radius="md"
                  className="text-text-secondary border-border hover:text-text-main"
                >
                  <FaCog size={16} />
                </ActionIcon>
              </Box>
            </Tooltip>
          ) : (
            <Button
              variant="outline"
              radius="md"
              fullWidth
              justify="flex-start"
              leftSection={<FaCog size={16} />}
              className="text-text-secondary border-border hover:text-text-main"
              classNames={{
                inner: "justify-start",
                label: "text-sm font-medium",
              }}
            >
              Configurações
            </Button>
          )}

          <Box className={`${isCollapsed ? "flex justify-center" : ""}`}>
            <ThemeToggle iconOnly={isCollapsed} />
          </Box>
          <Box
            className={`flex ${isCollapsed ? "flex-col" : "flex-row"} items-center gap-3 py-2 rounded-lg ${isCollapsed ? "justify-center" : "px-3"}`}
          >
            <Avatar
              key={user?.fullName}
              name={user?.fullName}
              color="initials"
              size={isCollapsed ? 32 : 38}
              radius="xl"
            />
            {isCollapsed && (
              <Tooltip label="Sair" position="top" withArrow>
                <ActionIcon variant="subtle" color="red" size="md" radius="md" onClick={logout}>
                  <FaSignOutAlt size={16} />
                </ActionIcon>
              </Tooltip>
            )}
            {!isCollapsed && (
              <>
                <Box className="min-w-0 flex-1">
                  <Text size="sm" fw={600} className="text-text-main truncate">
                    {user?.fullName}
                  </Text>
                  <Text size="xs" className="text-text-secondary truncate">
                    {currentSession?.roles?.[0]?.displayName}
                  </Text>
                </Box>
                <Tooltip label="Sair" position="top" withArrow>
                  <ActionIcon variant="subtle" color="red" size="md" radius="md" onClick={logout}>
                    <FaSignOutAlt size={16} />
                  </ActionIcon>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>
      </aside>
    </>
  );
}
