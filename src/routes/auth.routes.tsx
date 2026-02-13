import type { RouteObject } from "react-router";
import { ForgotPasswordPage, LogingPage, ResetPasswordPage } from "../pages";

export const authRoutes: RouteObject[] = [
  { path: "/login", element: <LogingPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password/:token", element: <ResetPasswordPage /> },
];
