import { Box, Button, Text, Title } from "@mantine/core";
import { FaPlus, FaUsers } from "react-icons/fa";
import { useAuthStore } from "../../../../../stores/auth";
import { useUtilsStore } from "../../../../../stores/utils";

export function UsersDashboardHeader() {
  const { currentSession } = useAuthStore();
  const { handleNavigation } = useUtilsStore();

  return (
    <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <Box className="flex items-center gap-3">
        <Box
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "color-mix(in srgb, var(--primary) 15%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FaUsers size={20} color="var(--primary)" />
        </Box>
        <Box>
          <Title order={3} c="var(--text-main)">
            Dashboard de Usuários
          </Title>
          <Text size="sm" c="var(--text-secondary)" mt={2}>
            Visualizando usuários em{" "}
            <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
              {currentSession?.activeContext.isGlobal
                ? "Todas as unidades"
                : currentSession?.activeContext.facilityName}
            </span>
          </Text>
        </Box>
      </Box>

      <Button
        id="users-dashboard-create-btn"
        leftSection={<FaPlus size={13} />}
        radius="md"
        onClick={() => handleNavigation("users/create", "users.create")}
        style={{ background: "var(--primary)" }}
      >
        Novo Usuário
      </Button>
    </Box>
  );
}
