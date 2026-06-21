import type { RouteObject } from "react-router";
import { AppLayout } from "../layouts/AppLayout";
import { HomePage } from "../pages/app";
import { CreateUserPage, UsersDashboardPage } from "../pages/app/";
import { NotFoundPage } from "../pages/public";

export const appRoutes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "dashboard", element: <HomePage /> },
      { path: "users/create", element: <CreateUserPage /> },
      { path: "users/dashboard", element: <UsersDashboardPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];
