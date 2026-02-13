import type { RouteObject } from "react-router";
import DashboardLayout from "../components/layout/DashboardLayout";
import { HomePage } from "../pages/app";
import { NotFoundPage } from "../pages/public";

export const appRoutes: RouteObject[] = [
  {
    element: <DashboardLayout />,
    children: [{ path: "/dashboard", element: <HomePage /> }],
  },
  { path: "*", element: <NotFoundPage /> },
];
