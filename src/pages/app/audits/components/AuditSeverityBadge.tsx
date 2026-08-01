import { Badge } from "@mantine/core";

const severityConfig: Record<string, { color: string; label: string }> = {
  CRITICAL: { color: "red", label: "Crítico" },
  HIGH: { color: "red", label: "Alto" },
  MEDIUM: { color: "orange", label: "Médio" },
  LOW: { color: "blue", label: "Baixo" },
  INFO: { color: "teal", label: "Info" },
};

interface AuditSeverityBadgeProps {
  severity: string;
}

export function AuditSeverityBadge({ severity }: AuditSeverityBadgeProps) {
  const config = severityConfig[severity] ?? { color: "gray", label: severity };

  return (
    <Badge variant="light" color={config.color} radius="md" size="sm">
      {config.label}
    </Badge>
  );
}
