import type { RouteObject } from "react-router";
import DashboardLayout from "../components/layout/DashboardLayout";
import { HomePage, NotFoundPage } from "../pages";

export const appRoutes: RouteObject[] = [
  {
    element: <DashboardLayout />,
    children: [{ path: "/dashboard", element: <HomePage /> }],
  },
  { path: "*", element: <NotFoundPage /> },
];
