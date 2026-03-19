import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import { RouterProvider } from "react-router";
import { LoaderPage } from "./pages/public";
import { router } from "./routes/";
import { useAuthStore } from "./stores/auth";

const App = () => {
  const hasCheckedAuth = useAuthStore((state) => state.hasCheckedAuth);

  if (!hasCheckedAuth) {
    return <LoaderPage />;
  }

  return <RouterProvider router={router} />;
};

useAuthStore.getState().checkAuth();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Elemento root não encontrado. Verifique o index.html.");

createRoot(rootElement).render(
  <StrictMode>
    <MantineProvider>
      <Notifications />
      <App />
    </MantineProvider>
  </StrictMode>,
);
