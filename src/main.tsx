import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router";
import { router } from "./routes/";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<MantineProvider>
			<RouterProvider router={router} />
		</MantineProvider>
	</StrictMode>,
);
