import {
  ActionIcon,
  Box,
  Group,
  Paper,
  Skeleton,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
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
      {Array.from({ length: 6 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are static placeholders
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
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
        <RowSkeleton key={i} />
      ))
    : manufacturers.map((m) => (
        <Table.Tr key={m.id} className="hover:bg-surface-hover transition-colors duration-150">
          <Table.Td>
            <Text size="sm" fw={500} c="var(--text-main)">
              {m.name}
            </Text>
          </Table.Td>

          <Table.Td>
            <Text size="sm" c="var(--text-secondary)">
              {m.cnpj || "—"}
            </Text>
          </Table.Td>

          <Table.Td>
            <Text size="sm" c="var(--text-secondary)">
              {m.city ? `${m.city.name}${m.city.state ? ` / ${m.city.state}` : ""}` : "—"}
            </Text>
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
      ));

  return (
    <Paper radius="lg" className="bg-surface border border-border overflow-hidden">
      <Table striped highlightOnHover verticalSpacing="sm" horizontalSpacing="md" stickyHeader>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                Nome / Razão Social
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                CNPJ
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                Cidade / UF
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
              <Table.Td colSpan={6}>
                <Box className="flex flex-col items-center justify-center py-12 gap-2">
                  <Text size="sm" c="var(--text-secondary)">
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
