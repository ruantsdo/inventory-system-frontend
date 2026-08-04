import { NAV_ITEMS } from "../components/Sidebar/nav.config";
import type { NavItem } from "../types/navigation";

export type NavItemSimple = Pick<NavItem, "path" | "permission">;

export const navBarRoutesPermissions: NavItemSimple[] = NAV_ITEMS.map(({ path, permission }) => ({
  path,
  permission,
}));

export const appRoutesPermissions: NavItemSimple[] = [
  ...navBarRoutesPermissions,
  {
    path: "users/create",
    permission: "users.create",
  },
  {
    path: "users/edit/:userId",
    permission: "users.edit",
  },
];
