import { Box, UnstyledButton } from "@mantine/core";
import { useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router";
import { Sidebar } from "../components/Sidebar/index";
import { useSessionRevalidation } from "../hooks/useSessionRevalidation";
import { useUIStore } from "../stores/context";
import { navigationHelper } from "../utils";

export function AppLayout() {
  const { isSidebarOpen, toggleSidebar, isMobileSidebarOpen, toggleMobileSidebar } = useUIStore();
  useSessionRevalidation();

  const navigate = useNavigate();
  useEffect(() => {
    navigationHelper.navigate = navigate;
  }, [navigate]);


  return (
    <Box className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        collapsed={isSidebarOpen}
        onToggle={() => toggleSidebar()}
        mobileOpen={isMobileSidebarOpen}
        onMobileClose={() => toggleMobileSidebar()}
      />

      <Box className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Box className="md:hidden flex items-center px-4 h-14 bg-surface border-b border-border">
          <UnstyledButton
            onClick={() => toggleMobileSidebar()}
            className="p-2 rounded-lg hover:bg-surface-hover text-text-main transition-colors"
          >
            <FaBars size={20} />
          </UnstyledButton>
        </Box>

        <Box className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
