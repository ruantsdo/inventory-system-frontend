import type { RouteObject } from "react-router";
import { AppLayout } from "../layouts/AppLayout";
import { HomePage } from "../pages/app";
import {
  AuditsPage,
  CreateUserPage,
  EditUserPage,
  ManufacturersPage,
  UsersDashboardPage,
} from "../pages/app";
import { NotFoundPage } from "../public/pages";
import { PermissionGuard } from "./guards";

export const appRoutes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "dashboard", element: <HomePage /> },
      {
        path: "users/create",
        element: (
          <PermissionGuard permission="users.create">
            <CreateUserPage />
          </PermissionGuard>
        ),
      },
      {
        path: "users/edit/:userId",
        element: (
          <PermissionGuard permission="users.update">
            <EditUserPage />
          </PermissionGuard>
        ),
      },
      {
        path: "users/dashboard",
        element: (
          <PermissionGuard permission="users.view">
            <UsersDashboardPage />
          </PermissionGuard>
        ),
      },
      {
        path: "audits",
        element: (
          <PermissionGuard permission="audit.view">
            <AuditsPage />
          </PermissionGuard>
        ),
      },
      {
        path: "manufacturers",
        element: (
          <PermissionGuard permission="manufacturers.view">
            <ManufacturersPage />
          </PermissionGuard>
        ),
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];
