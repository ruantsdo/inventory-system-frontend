import { Navigate, Outlet } from "react-router";
import { LoaderPage } from "../../pages/public";
import { selectHasCheckedAuth, selectIsAuthenticated, useAuthStore } from "../../stores/auth";

export const GuestGuard = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const hasCheckedAuth = useAuthStore(selectHasCheckedAuth);

  if (!hasCheckedAuth) {
    return <LoaderPage />;
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};
