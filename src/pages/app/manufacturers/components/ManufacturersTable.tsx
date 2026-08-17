import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Paper,
  Skeleton,
  Stack,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { countries } from "../../../../enums";
import type { ManufacturerOutput } from "../../../../types/api.contracts";

interface ManufacturersTableProps {
  manufacturers: ManufacturerOutput[];
  loading: boolean;
  onViewDetail: (id: string) => void;
  onEdit: (manufacturer: ManufacturerOutput) => void;
  onDelete: (id: string) => void;
}

function RowSkeleton() {
  return (
    <Table.Tr>
      {Array.from({ length: 7 }).map((_, i) => (
        <Table.Td key={i}>
          <Skeleton height={18} radius="sm" />
        </Table.Td>
      ))}
    </Table.Tr>
  );
}

export function ManufacturersTable({
  manufacturers,
  loading,
  onViewDetail,
  onEdit,
  onDelete,
}: ManufacturersTableProps) {
  const rows = loading
    ? Array.from({ length: 10 }).map((_, i) => (
        <RowSkeleton key={i} />
      ))
    : manufacturers.map((m) => {
        const countryLabel = countries.find((c) => c.value === m.country)?.label || m.country || "Brasil";
        return (
          <Table.Tr key={m.id} className="hover:bg-surface-hover transition-colors duration-150">
            <Table.Td>
              <Stack gap={1}>
                <Text size="sm" fw={500} c="var(--text-main)">
                  {m.name}
                </Text>
                {m.tradeName && (
                  <Text size="xs" c="var(--text-secondary)">
                    {m.tradeName}
                  </Text>
                )}
              </Stack>
            </Table.Td>

            <Table.Td>
              <Stack gap={1}>
                <Text size="sm" c="var(--text-secondary)">
                  {m.cnpj || "—"}
                </Text>
                {m.country !== "BR" && (
                  <Text size="xs" c="dimmed">
                    {countryLabel}
                  </Text>
                )}
              </Stack>
            </Table.Td>

            <Table.Td>
              <Text size="sm" c="var(--text-secondary)">
                {m.city ? `${m.city.name}${m.city.state ? ` / ${m.city.state}` : ""}` : countryLabel}
              </Text>
            </Table.Td>

            <Table.Td>
              <Badge variant="light" size="sm" radius="sm" color={m.isActive ? "green" : "gray"}>
                {m.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </Table.Td>

            <Table.Td>
              <Text size="sm" c="var(--text-secondary)">
                {m.contact?.contactPerson || m.contact?.email || m.contact?.phone || "—"}
              </Text>
            </Table.Td>

            <Table.Td>
              <Text size="sm" c="var(--text-secondary)">
                {m._count
                  ? `${m._count.items} iten${m._count.items !== 1 ? "s" : ""} · ${m._count.batches} lot${m._count.batches !== 1 ? "es" : "e"}`
                  : "—"}
              </Text>
            </Table.Td>

            <Table.Td>
              <Group gap={6} justify="flex-end">
                <Tooltip label="Ver detalhes" withArrow position="top">
                  <ActionIcon
                    id={`manufacturer-view-${m.id}`}
                    variant="subtle"
                    color="blue"
                    size="sm"
                    radius="md"
                    onClick={() => onViewDetail(m.id)}
                  >
                    <FaEye size={13} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Editar" withArrow position="top">
                  <ActionIcon
                    id={`manufacturer-edit-${m.id}`}
                    variant="subtle"
                    color="green"
                    size="sm"
                    radius="md"
                    onClick={() => onEdit(m)}
                  >
                    <FaEdit size={13} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Excluir" withArrow position="top">
                  <ActionIcon
                    id={`manufacturer-delete-${m.id}`}
                    variant="subtle"
                    color="red"
                    size="sm"
                    radius="md"
                    onClick={() => onDelete(m.id)}
                  >
                    <FaTrash size={13} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Table.Td>
          </Table.Tr>
        );
      });

  return (
    <Paper radius="lg" className="bg-surface border border-border overflow-hidden">
      <Table striped highlightOnHover verticalSpacing="sm" horizontalSpacing="md" stickyHeader>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                Fabricante
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                CNPJ / País
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                Localização
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                Status
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                Contato
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                Itens / Lotes
              </Text>
            </Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {!loading && manufacturers.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Box className="py-12 text-center">
                  <Text c="var(--text-secondary)" size="sm">
                    Nenhum fabricante encontrado.
                  </Text>
                </Box>
              </Table.Td>
            </Table.Tr>
          ) : (
            rows
          )}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
