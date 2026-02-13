import { Navigate, Outlet } from "react-router";

export const AuthGuard = () => {
  const isAuth = true;

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};
