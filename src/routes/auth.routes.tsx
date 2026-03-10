import type { RouteObject } from "react-router";
import { LogingPage, ResetPasswordFirstStepPage, ResetPasswordSecondStepPage } from "../pages/auth";

export const authRoutes: RouteObject[] = [
  { path: "/login", element: <LogingPage /> },
  { path: "/auth/reset-password-first-step", element: <ResetPasswordFirstStepPage /> },
  { path: "/auth/reset-password-second-step:token", element: <ResetPasswordSecondStepPage /> },
];
