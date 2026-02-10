import type { RouteObject } from "react-router";
import { ForgotPasswordPage, LogingPage, NotFoundPage } from "../pages";

export const authRoutes: RouteObject[] = [
	{ path: "/", element: <LogingPage /> },
	{ path: "/forgot-password", element: <ForgotPasswordPage /> },
	{ path: "*", element: <NotFoundPage /> },
];
