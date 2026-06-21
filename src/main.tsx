import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider, useComputedColorScheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import { RouterProvider } from "react-router";
import { ErrorBoundary } from "./components";
import { LoaderPage } from "./pages/public";
import { router } from "./routes/";
import { useAuthStore } from "./stores/auth";

function App() {
  const hasCheckedAuth = useAuthStore((state) => state.hasCheckedAuth);
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    if (computedColorScheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [computedColorScheme]);

  if (!hasCheckedAuth) {
    return <LoaderPage />;
  }

  return <RouterProvider router={router} />;
}

const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
  useAuthStore.getState().checkAuth();
  unsubscribe();
});
if (useAuthStore.persist.hasHydrated()) {
  useAuthStore.getState().checkAuth();
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Elemento root não encontrado. Verifique o index.html.");

createRoot(rootElement).render(
  <StrictMode>
    <MantineProvider>
      <ErrorBoundary>
        <Notifications />
        <App />
      </ErrorBoundary>
    </MantineProvider>
  </StrictMode>,
);
