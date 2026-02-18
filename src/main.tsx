import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import { RouterProvider } from "react-router";
import { router } from "./routes/";

import { useAuthStore } from "./stores/auth";

const App = () => {
  const hasCheckedAuth = useAuthStore((state) => state.hasCheckedAuth);

  if (!hasCheckedAuth) {
    return null;
  }

  return <RouterProvider router={router} />;
};

useAuthStore.getState().checkAuth();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <Notifications />
      <App />
    </MantineProvider>
  </StrictMode>,
);
