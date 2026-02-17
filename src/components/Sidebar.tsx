import { ActionIcon, Avatar, Box, Button, Indicator, Text, Tooltip } from "@mantine/core";
import { useState } from "react";
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
} from "react-icons/fa";
import { useNavigate } from "react-router";
import { ThemeToggle } from "./ThemeToggle";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <FaTachometerAlt size={16} />,
    path: "/dashboard",
  },
  { label: "Estoque", icon: <FaBoxes size={16} />, path: "/estoque" },
  {
    label: "Requisições",
    icon: <FaFileAlt size={16} />,
    path: "/requisicoes",
  },
  { label: "Lotes", icon: <FaLayerGroup size={16} />, path: "/lotes" },
  {
    label: "Movimentações",
    icon: <FaExchangeAlt size={16} />,
    path: "/movimentacoes",
  },
];

const mockUser = {
  name: "Ricardo Silva",
  role: "Gestor de Estoque",
  avatar: null as string | null,
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("/dashboard");

  const isCollapsed = collapsed && !mobileOpen;

  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    setActiveItem(path);
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
            className={`flex items-center gap-3 py-2 rounded-lg ${isCollapsed ? "justify-center" : "px-3"}`}
          >
            <Avatar
              src={mockUser.avatar}
              size={isCollapsed ? "sm" : "md"}
              radius="xl"
              color="green"
            >
              {mockUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Avatar>
            {!isCollapsed && (
              <>
                <Box className="min-w-0 flex-1">
                  <Text size="sm" fw={600} className="text-text-main truncate">
                    {mockUser.name}
                  </Text>
                  <Text size="xs" className="text-text-secondary truncate">
                    {mockUser.role}
                  </Text>
                </Box>
                <Tooltip label="Sair" position="top" withArrow>
                  <ActionIcon variant="subtle" color="red" size="md" radius="md">
                    <FaSignOutAlt size={14} />
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
