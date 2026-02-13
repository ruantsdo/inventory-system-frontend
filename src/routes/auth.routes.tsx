import type { RouteObject } from "react-router";
import { ForgotPasswordPage, LogingPage, NotFoundPage, ResetPasswordPage } from "../pages";

export const authRoutes: RouteObject[] = [
  { path: "/", element: <LogingPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password/:token", element: <ResetPasswordPage /> },
  { path: "*", element: <NotFoundPage /> },
];
