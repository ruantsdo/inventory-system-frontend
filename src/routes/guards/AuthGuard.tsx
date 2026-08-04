import { Navigate, Outlet, useLocation } from "react-router";
import { LoaderPage } from "../../public/pages";
import { selectHasCheckedAuth, selectIsAuthenticated, useAuthStore } from "../../stores/auth";

export const AuthGuard = () => {
  const canNavigateTo = useAuthStore((state) => state.canNavigateTo);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const hasCheckedAuth = useAuthStore(selectHasCheckedAuth);
  const location = useLocation();

  if (!hasCheckedAuth) {
    return <LoaderPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!canNavigateTo(location.pathname)) {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
};
