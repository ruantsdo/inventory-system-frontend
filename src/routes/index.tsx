import { createBrowserRouter } from "react-router";
import { appRoutes } from "./app.routes";
import { authRoutes } from "./auth.routes";
import { AuthGuard } from "./guards/";

export const router = createBrowserRouter([
	...authRoutes,

	{
		element: <AuthGuard />,
		children: appRoutes,
	},
]);
