import type { RouteObject } from "react-router";
import { AppLayout } from "../layouts/AppLayout";
import { HomePage } from "../pages/app";
import { CreateUserPage, EditUserPage, UsersDashboardPage } from "../pages/app/";
import { NotFoundPage } from "../public/pages";

export const appRoutes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "dashboard", element: <HomePage /> },
      { path: "users/create", element: <CreateUserPage /> },
      { path: "users/edit/:userId", element: <EditUserPage /> },
      { path: "users/dashboard", element: <UsersDashboardPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];
