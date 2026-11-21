import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router";
import type { AppPermissionKey } from "../../enums/permissions";
import { useAuthStore } from "../../stores/auth";
import { hasPermission } from "../../utils/permissions.utils";

interface PermissionGuardProps {
  permission: AppPermissionKey;
  children?: ReactNode;
}

export const PermissionGuard = ({ permission, children }: PermissionGuardProps) => {
  const isAllowed = useAuthStore((state) => hasPermission(state.currentSession, permission));

  if (!isAllowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

