import { AreaChart } from "@mantine/charts";
import { Box, Paper, Text } from "@mantine/core";

import { ChartTooltip } from "./ChartTooltip";

import type { ConsumptionData } from "../types/dashboard";

const consumptionData: ConsumptionData[] = [
  { day: "Seg", value: 820 },
  { day: "Ter", value: 932 },
  { day: "Qua", value: 1100 },
  { day: "Qui", value: 1240 },
  { day: "Sex", value: 890 },
  { day: "Sáb", value: 650 },
  { day: "Dom", value: 430 },
];

export function ConsumptionChart() {
  const weekConsumption = consumptionData.map((item) => item.value).reduce((a, b) => a + b, 0);

  return (
    <Paper radius="lg" className="bg-surface border border-border p-5 h-full">
      <Box className="flex items-start justify-between mb-4">
        <Box>
          <Text size="sm" fw={600} className="text-text-main">
            Consumo da Última Semana
          </Text>
          <Text size="xs" className="text-text-secondary mt-0.5">
            Média do Consumo
          </Text>
        </Box>
      </Box>

      <Box className="mb-4">
        <Text size="xl" fw={800} className="text-text-main text-3xl">
          {weekConsumption.toLocaleString("pt-BR")}
        </Text>
        <Text size="xs" className="text-text-secondary">
          unidades consumidas essa semana
        </Text>
      </Box>

      <Box className="w-full">
        <AreaChart
          h={300}
          data={consumptionData}
          dataKey="day"
          yAxisProps={{ domain: [0, 100] }}
          dotProps={{ r: 1 }}
          series={[{ name: "value", color: "indigo.6" }]}
          tooltipProps={{
            content: ({ label, payload }) => <ChartTooltip label={label} payload={[...payload]} />,
          }}
        />
      </Box>
    </Paper>
  );
}
