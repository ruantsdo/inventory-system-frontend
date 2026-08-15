import {
  Badge,
  Box,
  Group,
  Modal,
  Pagination,
  Paper,
  ScrollArea,
  Skeleton,
  Stack,
  Table,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useEffect } from "react";
import { FaBoxes } from "react-icons/fa";
import { useManufacturersStore } from "../../../../stores/app/manufacturers";
import type { ManufacturerOutput } from "../../../../types/api.contracts";

interface ManufacturerItemsModalProps {
  opened: boolean;
  onClose: () => void;
  manufacturer: ManufacturerOutput | null;
}

function ItemRowSkeleton() {
  return (
    <Table.Tr>
      {Array.from({ length: 4 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are static placeholders
        <Table.Td key={i}>
          <Skeleton height={18} radius="sm" />
        </Table.Td>
      ))}
    </Table.Tr>
  );
}

export function ManufacturerItemsModal({
  opened,
  onClose,
  manufacturer,
}: ManufacturerItemsModalProps) {
  const {
    manufacturerItems,
    manufacturerItemsTotal,
    manufacturerItemsPage,
    manufacturerItemsTotalPages,
    manufacturerItemsLoading,
    fetchManufacturerItems,
    clearManufacturerItems,
  } = useManufacturersStore();

  useEffect(() => {
    if (opened && manufacturer) {
      fetchManufacturerItems(manufacturer.id, 1);
    }
  }, [opened, manufacturer, fetchManufacturerItems]);

  function handleClose() {
    clearManufacturerItems();
    onClose();
  }

  function handlePageChange(page: number) {
    if (manufacturer) {
      fetchManufacturerItems(manufacturer.id, page);
    }
  }

  const rows = manufacturerItemsLoading
    ? Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
        <ItemRowSkeleton key={i} />
      ))
    : manufacturerItems.map((item) => (
        <Table.Tr key={item.id} className="hover:bg-surface-hover transition-colors duration-150">
          <Table.Td>
            <Text size="sm" fw={500} c="var(--text-main)">
              {item.name}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="sm" c="var(--text-secondary)" style={{ fontFamily: "monospace" }}>
              {item.identifier}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="sm" c="var(--text-secondary)">
              {item.gtin || "—"}
            </Text>
          </Table.Td>
          <Table.Td>
            <Badge
              variant="light"
              radius="sm"
              color={item.isActive ? "green" : "gray"}
            >
              {item.isActive ? "Ativo" : "Inativo"}
            </Badge>
          </Table.Td>
        </Table.Tr>
      ));

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="sm">
          <ThemeIcon size="md" radius="md" style={{ background: "var(--primary)" }} variant="filled">
            <FaBoxes size={14} />
          </ThemeIcon>
          <Stack gap={0}>
            <Text fw={700} c="var(--text-main)" size="sm">
              Itens Vinculados
            </Text>
            {manufacturer && (
              <Text size="xs" c="var(--text-secondary)">
                {manufacturer.name}
              </Text>
            )}
          </Stack>
        </Group>
      }
      size="xl"
      radius="lg"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Stack gap="md">
        <Paper radius="md" className="bg-surface border border-border overflow-hidden">
          <Table striped highlightOnHover verticalSpacing="sm" horizontalSpacing="md" stickyHeader>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                    Nome
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                    Identificador
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                    GTIN
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text size="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                    Status
                  </Text>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {!manufacturerItemsLoading && manufacturerItems.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Box className="flex flex-col items-center justify-center py-8 gap-2">
                      <Text size="sm" c="var(--text-secondary)">
                        Nenhum item encontrado.
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

        {!manufacturerItemsLoading && manufacturerItemsTotalPages > 1 && (
          <Group justify="space-between" align="center">
            <Text size="sm" c="var(--text-secondary)">
              {manufacturerItemsTotal} iten{manufacturerItemsTotal !== 1 ? "s" : ""} no total
            </Text>
            <Pagination
              id="manufacturer-items-pagination"
              total={manufacturerItemsTotalPages}
              value={manufacturerItemsPage}
              onChange={handlePageChange}
              radius="md"
              size="sm"
              color="green"
            />
          </Group>
        )}
      </Stack>
    </Modal>
  );
}
