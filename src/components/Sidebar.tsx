import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Group,
  Indicator,
  Menu,
  Select,
  Text,
  Tooltip,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  FaBars,
  FaBell,
  FaBoxes,
  FaChartBar,
  FaChevronLeft,
  FaExchangeAlt,
  FaFileAlt,
  FaLayerGroup,
  FaMoon,
  FaSignOutAlt,
  FaSun,
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../stores/auth";
import { useUtilsStore } from "../stores/utils";
import type { NavItem, SidebarProps } from "../types/navigation";

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <FaTachometerAlt size={16} />,
    path: "/dashboard",
  },
  { label: "Estoque", icon: <FaBoxes size={16} />, path: "/estoque", permission: "inventory.view" },
  {
    label: "Requisições",
    icon: <FaFileAlt size={16} />,
    path: "/requisicoes",
    permission: "requests.view",
  },
  { label: "Lotes", icon: <FaLayerGroup size={16} />, path: "/lotes", permission: "batches.view" },
  {
    label: "Movimentações",
    icon: <FaExchangeAlt size={16} />,
    path: "/movimentacoes",
    permission: "requests.view",
  },
  {
    label: "Usuários",
    icon: <FaUsers size={16} />,
    path: "/users/dashboard",
    permission: "users.view",
  },
];

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { logout, currentSession, setCurrentSession } = useAuthStore();
  const user = currentSession?.user ?? null;
  const [filteredNavItems, setFilteredNavItems] = useState<NavItem[]>([]);

  const isCollapsed = collapsed && !mobileOpen;

  const location = useLocation();
  const navigate = useNavigate();
  const { checkPermission } = useUtilsStore();

  const { toggleColorScheme } = useMantineColorScheme();
  const currentTheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const isDark = currentTheme === "dark";

  const handleThemeToggle = () => {
    document.documentElement.classList.add("theme-transitioning");
    toggleColorScheme();
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 350);
  };

  const isGlobal = currentSession?.activeContext?.isGlobal ?? false;
  const facilities = currentSession?.facilities ?? [];

  const facilitySelectData = [...facilities.map((f) => ({ value: f.id, label: f.name }))];

  const activeFacilityValue =
    isGlobal && !currentSession?.activeContext?.facilityId
      ? "__all__"
      : (currentSession?.activeContext?.facilityId ?? null);

  const handleFacilityChange = (value: string | null) => {
    if (!currentSession) return;
    if (value === "__all__" || value === null) {
      setCurrentSession({
        ...currentSession,
        activeContext: {
          ...currentSession.activeContext,
          facilityId: null,
          facilityName: null,
          isGlobal: true,
        },
      });
    } else {
      const selected = facilities.find((f) => f.id === value);
      setCurrentSession({
        ...currentSession,
        activeContext: {
          ...currentSession.activeContext,
          facilityId: value,
          facilityName: selected?.name ?? null,
          isGlobal: false,
        },
      });
    }
  };

  const activeItem =
    filteredNavItems.find((item) => {
      const currentSegment = location.pathname.split("/").filter(Boolean)[0];
      const itemSegment = item.path.split("/").filter(Boolean)[0];
      return currentSegment && currentSegment === itemSegment;
    })?.path || "/dashboard";

  const handleNavigation = (path: string) => {
    navigate(path);
    if (mobileOpen) {
      onMobileClose();
    }
  };

  useEffect(() => {
    const filteredNavItems = navItems.filter((item) =>
      item.permission ? checkPermission(item.permission) : true,
    );
    setFilteredNavItems(filteredNavItems);
  }, [currentSession?.activeContext]);

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
                  {filteredNavItems.find((item) => item.path === activeItem)?.label || "Dashboard"}
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
          {filteredNavItems.map((item) => {
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
          <Box
            className={`flex ${isCollapsed ? "flex-col gap-3" : "flex-row"} justify-between items-center `}
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
                          {currentSession?.roles?.[0]?.displayName}
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
      </aside>
    </>
  );
}
