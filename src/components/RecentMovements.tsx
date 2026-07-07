import { Badge, Box, Button, Paper, Table, Text } from "@mantine/core";
import { useNavigate } from "react-router";

import type { Movement } from "../types/dashboard";

const movements: Movement[] = [
  {
    id: 1,
    item: "Seringa 10ml",
    lot: "LT-2025-001",
    type: "Entrada",
    quantity: 500,
    responsible: "Maria Costa",
    date: "14/10 16:32",
  },
  {
    id: 2,
    item: "Luva Procedimento M",
    lot: "LT-2025-003",
    type: "Saída",
    quantity: 200,
    responsible: "João Pereira",
    date: "14/10 15:12",
  },
  {
    id: 3,
    item: "Álcool 70%",
    lot: "LT-2025-007",
    type: "Entrada",
    quantity: 100,
    responsible: "Ana Souza",
    date: "14/10 14:48",
  },
  {
    id: 4,
    item: "Gaze Estéril",
    lot: "LT-2025-012",
    type: "Saída",
    quantity: 150,
    responsible: "Carlos Lima",
    date: "14/10 13:20",
  },
];

export function RecentMovements() {
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  const tableRows = movements.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>
        <Box className="flex flex-col">
          <span className="font-medium text-text-main">{element.item}</span>
          <span className="text-text-secondary text-xs">{element.lot}</span>
        </Box>
      </Table.Td>
      <Table.Td>
        <Badge
          variant="light"
          color={element.type === "Entrada" ? "var(--status-success)" : "var(--status-error)"}
          radius="sm"
        >
          {element.type}
        </Badge>
      </Table.Td>
      <Table.Td>{element.quantity}</Table.Td>
      <Table.Td>{element.responsible}</Table.Td>
      <Table.Td>{element.date}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper radius="lg" className="bg-surface border border-border p-5">
      <Box className="flex items-center justify-between mb-4">
        <Text size="sm" fw={600} className="text-text-main">
          Últimas Movimentações
        </Text>
        <Button variant="outline" onClick={() => handleNavigate("/movimentacoes")}>
          Ver todas as movimentações
        </Button>
      </Box>

      <Box className="overflow-x-auto">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Item</Table.Th>
              <Table.Th>Tipo</Table.Th>
              <Table.Th>Quantidade</Table.Th>
              <Table.Th>Responsável</Table.Th>
              <Table.Th>Data</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{tableRows}</Table.Tbody>
        </Table>
      </Box>
    </Paper>
  );
}
