import { Navigate, Outlet } from "react-router";

export const GuestGuard = () => {
  const isAuth = true;

  return !isAuth ? <Outlet /> : <Navigate to="/dashboard" replace />;
};
