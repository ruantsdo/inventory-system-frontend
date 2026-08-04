import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { ProfileModal } from "../../pages/app/userManagement/components/ProfileModal";
import { useAuthStore } from "../../stores/auth";
import type { SidebarProps } from "../../types/navigation";
import { useUtilsStore } from "../../utils";
import { NavItemButton } from "./NavItemButton";
import { NAV_ITEMS } from "./nav.config";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { currentSession } = useAuthStore();
  const user = currentSession?.user ?? null;
  const { checkPermission } = useUtilsStore();

  const isCollapsed = collapsed && !mobileOpen;

  const location = useLocation();
  const navigate = useNavigate();

  const [profileIsOpen, { toggle: handleProfileModal, close: closeProfile }] = useDisclosure(false);

  const filteredNavItems = useMemo(
    () => NAV_ITEMS.filter((item) => !item.permission || checkPermission(item.permission)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSession?.activeContext],
  );

  const activeItem =
    filteredNavItems.find((item) => {
      const currentSegment = location.pathname.split("/").filter(Boolean)[0];
      const itemSegment = item.path.split("/").filter(Boolean)[0];
      return currentSegment && currentSegment === itemSegment;
    })?.path || "/dashboard";

  const activeLabel =
    filteredNavItems.find((item) => item.path === activeItem)?.label || "Dashboard";

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

      {user && profileIsOpen && (
        <ProfileModal opened={profileIsOpen} handleClose={closeProfile} targetId={user.id} />
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
        <SidebarHeader
          isCollapsed={isCollapsed}
          activeLabel={activeLabel}
          mobileOpen={mobileOpen}
          onToggle={onToggle}
          onMobileClose={onMobileClose}
        />

        <nav className="flex flex-col py-4 px-3 gap-1 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <NavItemButton
              key={item.path}
              item={item}
              isActive={item.path === activeItem}
              isCollapsed={isCollapsed}
              onClick={handleNavigation}
            />
          ))}
        </nav>

        <SidebarFooter isCollapsed={isCollapsed} user={user} onProfileOpen={handleProfileModal} />
      </aside>
    </>
  );
}
