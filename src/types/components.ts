import type { ReactNode } from "react";

export interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  description?: string;
  color: "error" | "warning" | "success";
}

export interface ThemeToggleProps {
  iconOnly?: boolean;
}
