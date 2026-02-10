import { Navigate, Outlet } from "react-router";

export const AuthGuard = () => {
  const isAuth = false; 

  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
};