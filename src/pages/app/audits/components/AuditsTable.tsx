import { ActionIcon, Box, Group, Paper, Skeleton, Table, Text, Tooltip } from "@mantine/core";
import { FaEye } from "react-icons/fa";
import type { AuditOutput } from "../../../../types/api.contracts";
import { formatToBrDate } from "../../../../utils/date.utils";
import { useAuditTranslation } from "../hooks/useAuditTranslation";
import { AuditSeverityBadge } from "./AuditSeverityBadge";

interface AuditsTableProps {
  audits: AuditOutput[];
  loading: boolean;
  onViewDetail: (id: string) => void;
}

function AuditRowSkeleton() {
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

export function AuditsTable({ audits, loading, onViewDetail }: AuditsTableProps) {
  const { translateAction, translateCategory } = useAuditTranslation();

  const rows = loading
    ? Array.from({ length: 10 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
        <AuditRowSkeleton key={i} />
      ))
    : audits.map((audit) => (
        <Table.Tr key={audit.id} className="hover:bg-surface-hover transition-colors duration-150">
          <Table.Td>
            <Text size="sm" c="var(--text-secondary)">
              {audit.origin}
            </Text>
          </Table.Td>

          <Table.Td>
            <Text size="sm" c="var(--text-main)">
              {formatToBrDate(audit.createdAt)}
            </Text>
          </Table.Td>

          <Table.Td>
            <Text size="sm" fw={500} c="var(--text-main)">
              {translateAction(audit.action)}
            </Text>
          </Table.Td>

          <Table.Td>
            <Text size="sm" fw={500} c="var(--text-main)">
              {audit.performedByUserName}
            </Text>
          </Table.Td>

          <Table.Td>
            <Text size="sm" fw={500} c="var(--text-main)">
              {audit.facilityName}
            </Text>
          </Table.Td>

          <Table.Td>
            <Text size="sm" c="var(--text-secondary)">
              {translateCategory(audit.category)}
            </Text>
          </Table.Td>

          <Table.Td>
            <AuditSeverityBadge severity={audit.severity} />
          </Table.Td>

          <Table.Td>
            <Group gap={6} justify="flex-end">
              <Tooltip label="Ver detalhes" withArrow position="top">
                <ActionIcon
                  id={`audit-view-${audit.id}`}
                  variant="subtle"
                  color="blue"
                  size="sm"
                  radius="md"
                  onClick={() => onViewDetail(audit.id)}
                >
                  <FaEye size={13} />
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
                Origem
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                Data
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                Ação
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                Usuário Executor
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                Unidade
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                Categoria
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                Severidade
              </Text>
            </Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {!loading && audits.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Box className="flex flex-col items-center justify-center py-12 gap-2">
                  <Text size="sm" c="var(--text-secondary)">
                    Nenhum registro de auditoria encontrado para os filtros aplicados.
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
