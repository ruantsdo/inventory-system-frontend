import { createBrowserRouter } from "react-router";
import { appRoutes } from "./app.routes";
import { authRoutes } from "./auth.routes";
import { AuthGuard } from "./guards/AuthGuard";
import { GuestGuard } from "./guards/GuestGuard";

export const router = createBrowserRouter([
  {
    element: <GuestGuard />,
    children: authRoutes,
  },
  {
    element: <AuthGuard />,
    children: appRoutes,
  },
]);
