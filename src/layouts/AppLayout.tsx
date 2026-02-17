import { Box, UnstyledButton } from "@mantine/core";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Outlet } from "react-router";
import { Sidebar } from "../components/Sidebar";

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Box className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Box className="md:hidden flex items-center px-4 h-14 bg-surface border-b border-border">
          <UnstyledButton
            onClick={() => setMobileOpen(true)}
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
