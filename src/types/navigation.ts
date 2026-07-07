import type { ReactNode } from "react";

export interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
  permission?: string;
}

export interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}
