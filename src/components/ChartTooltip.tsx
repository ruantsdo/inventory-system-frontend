import { getFilteredChartTooltipPayload } from "@mantine/charts";
import { Paper, Text } from "@mantine/core";

import type { ChartTooltipProps } from "../types/dashboard";

export function ChartTooltip({ label, payload }: ChartTooltipProps) {
  if (!payload) return null;

  return (
    <Paper px="md" py="sm" withBorder shadow="md" radius="md">
      <Text fw={500} mb={5}>
        {label}
      </Text>
      {getFilteredChartTooltipPayload(payload).map((item) => (
        <Text key={item.name} fz="sm">
          Consumo: {item.value} unidades
        </Text>
      ))}
    </Paper>
  );
}
