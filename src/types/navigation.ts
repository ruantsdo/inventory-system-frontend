import type { ReactNode } from "react";

export interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
}

export interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}
