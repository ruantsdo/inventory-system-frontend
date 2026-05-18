import { Box, Button, Text } from "@mantine/core";
import { FaBoxOpen, FaCalendarAlt, FaClipboardList, FaPlus } from "react-icons/fa";
import { AlertFeed } from "../../components/AlertFeed";
import { ConsumptionChart } from "../../components/ConsumptionChart";
import { RecentMovements } from "../../components/RecentMovements";
import { StatCard } from "../../components/StatCard";
import { useAuthStore } from "../../stores/auth";
import { useTimingStore } from "../../stores/utils";

export function HomePage() {
  const { currentSession } = useAuthStore();
  const { greeting, formattedDate } = useTimingStore();
  const user = currentSession?.user;

  return (
    <Box className="max-w-7xl mx-auto space-y-6">
      <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Box>
          <Text size="xl" fw={700} className="text-text-main text-2xl">
            Visão Geral do Estoque
          </Text>
          <Text size="sm" className="text-text-secondary mt-1">
            {greeting()}, {user?.fullName}! Aqui está o resumo de hoje,{" "}
            <span className="font-medium text-text-main">{formattedDate()}</span>.
          </Text>
        </Box>
        <Box className="flex items-center gap-3">
          <Button
            leftSection={<FaPlus size={14} />}
            radius="md"
            className="bg-primary hover:bg-primary/90 text-white font-semibold"
          >
            Nova Requisição
          </Button>
        </Box>
      </Box>

      <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<FaBoxOpen size={20} />}
          label="Itens abaixo do mínimo"
          value={12}
          description="vs. 8 na semana passada"
          color="error"
        />
        <StatCard
          icon={<FaCalendarAlt size={20} />}
          label="Vencimentos em breve"
          value={"08"}
          description="próximos 30 dias"
          color="warning"
        />
        <StatCard
          icon={<FaClipboardList size={20} />}
          label="Requisições pendentes"
          value={24}
          description="aguardando aprovação"
          color="success"
        />
      </Box>

      <Box className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Box className="lg:col-span-3">
          <ConsumptionChart />
        </Box>
        <Box className="lg:col-span-2">
          <AlertFeed />
        </Box>
      </Box>

      <RecentMovements />
    </Box>
  );
}
