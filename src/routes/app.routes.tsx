import type { RouteObject } from "react-router";
import { HomePage } from "../pages";

export const appRoutes: RouteObject[] = [
	{ path: "/home", element: <HomePage /> },
];
