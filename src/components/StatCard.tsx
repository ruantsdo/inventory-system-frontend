import { Box, Paper, Text, ThemeIcon } from "@mantine/core";
import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  description?: string;
  color: "error" | "warning" | "success";
}

const colorMap = {
  error: {
    bg: "bg-status-error/10",
    text: "text-status-error",
    dot: "bg-status-error",
  },
  warning: {
    bg: "bg-status-warning/10",
    text: "text-status-warning",
    dot: "bg-status-warning",
  },
  success: {
    bg: "bg-status-success/10",
    text: "text-status-success",
    dot: "bg-status-success",
  },
};

export function StatCard({ icon, label, value, description, color }: StatCardProps) {
  const scheme = colorMap[color];

  return (
    <Paper
      radius="lg"
      className="bg-surface border border-border p-5 hover:shadow-md transition-shadow duration-200"
    >
      <Box className="flex items-start justify-between">
        <Box className="space-y-1">
          <Box className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${scheme.dot}`} />
            <Text size="xs" tt="uppercase" fw={600} className="text-text-secondary tracking-wide">
              {label}
            </Text>
          </Box>
          <Text size="xl" fw={800} className={`text-text-main text-3xl`}>
            {value}
          </Text>
          {description && (
            <Text size="xs" className="text-text-secondary">
              {description}
            </Text>
          )}
        </Box>
        <ThemeIcon size={44} radius="md" variant="light" className={`${scheme.bg} ${scheme.text}`}>
          {icon}
        </ThemeIcon>
      </Box>
    </Paper>
  );
}
