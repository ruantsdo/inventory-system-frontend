import { Badge, Box, Button, Paper, Text, UnstyledButton } from "@mantine/core";
import { FaCapsules, FaSyringe } from "react-icons/fa";
import { GiEyedropper } from "react-icons/gi";
import { useNavigate } from "react-router";

interface AlertItem {
  id: number;
  title: string;
  description: string;
  urgency: "alto" | "médio" | "baixo";
  icon: React.ReactNode;
  quantity: number;
}

const alerts: AlertItem[] = [
  {
    id: 1,
    title: "Amoxicilina 500mg",
    description: "Lote #A2341",
    urgency: "alto",
    icon: <FaCapsules size={16} />,
    quantity: 300,
  },
  {
    id: 2,
    title: "Insulina NPH",
    description: "Lote #I0892",
    urgency: "alto",
    icon: <FaSyringe size={16} />,
    quantity: 100,
  },
  {
    id: 3,
    title: "Dipirona Sódica",
    description: "Lote #D0 881",
    urgency: "médio",
    icon: <FaCapsules size={16} />,
    quantity: 50,
  },
  {
    id: 4,
    title: "Paracetamol Gotas",
    description: "Lote #P1120",
    urgency: "baixo",
    icon: <GiEyedropper size={16} />,
    quantity: 100,
  },
  {
    id: 5,
    title: "Paracetamol",
    description: "Lote #P1120",
    urgency: "baixo",
    icon: <FaCapsules size={16} />,
    quantity: 15,
  },
];

const urgencyColors = {
  alto: "var(--status-error)",
  médio: "var(--status-warning)",
  baixo: "var(--status-success)",
} as const;

const urgencyLabels = {
  alto: "Vence 5 dias",
  médio: "Vence 10 dias",
  baixo: "Vence 15 dias",
};

export function AlertFeed() {
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <Paper
      radius="lg"
      className="flex flex-col bg-surface border border-border p-5 h-full justify-around"
    >
      <Box className="flex items-center justify-between mb-4">
        <Text size="sm" fw={600} className="text-text-main">
          Alertas Críticos
        </Text>
      </Box>
      {!alerts.length ? (
        <Text size="md" className="text-text-secondary text-center">
          Não há alertas críticos
        </Text>
      ) : (
        <Box className="flex-1 space-y-3 overflow-y-auto">
          {alerts.map((alert) => (
            <Box
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-background hover:bg-surface-hover transition-colors duration-150"
            >
              <Box className="p-2 rounded-lg bg-status-error/10 text-status-error mt-0.5">
                {alert.icon}
              </Box>
              <Box className="flex-1 min-w-0">
                <Text size="sm" fw={600} className="text-text-main truncate">
                  {alert.title}
                </Text>
                <Text size="xs" className="text-text-secondary mt-0.5">
                  {alert.description}
                </Text>
              </Box>
              <Box className="flex flex-col gap-1 items-end">
                <Badge size="xs" variant="light" color={urgencyColors[alert.urgency]}>
                  {urgencyLabels[alert.urgency]}
                </Badge>
                {alert.quantity <= 50 && (
                  <Badge size="xs" variant="light" color={urgencyColors[alert.urgency]}>
                    <span className="text-status-warning">{alert.quantity} unidades restantes</span>
                  </Badge>
                )}
              </Box>
            </Box>
          ))}

          <Button variant="outline" onClick={() => handleNavigate("/alertas")}>
            Ver todos os alertas
          </Button>
        </Box>
      )}
    </Paper>
  );
}
