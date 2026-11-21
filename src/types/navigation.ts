import type { ReactNode } from "react";
import type { AppPermissionKey } from "../enums/permissions";

export interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
  permission?: AppPermissionKey;
}

export interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}
