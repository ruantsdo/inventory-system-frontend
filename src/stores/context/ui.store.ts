import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStore {
  isSidebarOpen: boolean;
  isMobileSidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isSidebarOpen: false,
      isMobileSidebarOpen: false,

      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      toggleMobileSidebar: () =>
        set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        isSidebarOpen: state.isSidebarOpen,
        isMobileSidebarOpen: state.isMobileSidebarOpen,
      }),
    },
  ),
);
