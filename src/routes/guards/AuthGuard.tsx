import { Navigate, Outlet, useLocation } from "react-router";
import { LoaderPage } from "../../public/pages";
import { selectHasCheckedAuth, selectIsAuthenticated, useAuthStore } from "../../stores/auth";

export const AuthGuard = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const hasCheckedAuth = useAuthStore(selectHasCheckedAuth);
  const location = useLocation();

  if (!hasCheckedAuth) {
    return <LoaderPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
