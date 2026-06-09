import type { RouteObject } from "react-router";
import { LoginPage, ResetPasswordFirstStepPage, ResetPasswordSecondStepPage } from "../pages/auth";

export const authRoutes: RouteObject[] = [
  { path: "/login", element: <LoginPage /> },
  { path: "/auth/reset-password-first-step", element: <ResetPasswordFirstStepPage /> },
  { path: "/auth/reset-password-second-step/:token", element: <ResetPasswordSecondStepPage /> },
  { path: "/activate/:token", element: <ResetPasswordSecondStepPage /> },
];
