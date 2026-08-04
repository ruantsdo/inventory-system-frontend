import { useAuthStore } from "../../../stores/auth";
import { navigationHelper } from "../../modules/navigation.utils";
import type { PermissionsNavigationSlice, SliceCreator } from "../../types/utils.types";

export const createPermissionsNavigationSlice: SliceCreator<
  PermissionsNavigationSlice
> = (_set, get) => ({
  checkPermission: (permissionName: string) => {
    const { currentSession } = useAuthStore.getState();
    if (!currentSession) return false;

    const effectivePermissions = currentSession.effectivePermissions;
    const autorized = effectivePermissions.some((ep) => ep.name === permissionName);
    return autorized;
  },

  handleNavigation: (path: string, permission: string) => {
    if (get().checkPermission(permission)) {
      const absolutePath = path.startsWith("/") ? path : `/${path}`;
      if (navigationHelper.navigate) {
        navigationHelper.navigate(absolutePath);
      } else {
        window.location.href = absolutePath;
      }
    }
  },
});
