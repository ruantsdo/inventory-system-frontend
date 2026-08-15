import type { RouteObject } from "react-router";
import { AppLayout } from "../layouts/AppLayout";
import { HomePage } from "../pages/app";
import {
  AuditsPage,
  CreateUserPage,
  EditUserPage,
  ManufacturersPage,
  UsersDashboardPage,
} from "../pages/app/";
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
      { path: "audits", element: <AuditsPage /> },
      { path: "manufacturers", element: <ManufacturersPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];

