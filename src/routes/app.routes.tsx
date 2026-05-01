import type { RouteObject } from "react-router";
import { AppLayout } from "../layouts/AppLayout";
import { HomePage } from "../pages/app";
import { CreateUserPage } from "../pages/app/userManagement/createUserPage";
import { NotFoundPage } from "../pages/public";

export const appRoutes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "dashboard", element: <HomePage /> },
      { path: "users/create", element: <CreateUserPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];
