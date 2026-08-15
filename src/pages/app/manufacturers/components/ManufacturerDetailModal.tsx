import {
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Loader,
  Modal,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { FaBoxes, FaBuilding, FaEnvelope, FaIndustry, FaLayerGroup, FaMapMarkerAlt, FaPhone, FaUser } from "react-icons/fa";
import type { ManufacturerOutput } from "../../../../types/api.contracts";
import { formatToBrDate } from "../../../../utils/date.utils";

interface ManufacturerDetailModalProps {
  opened: boolean;
  onClose: () => void;
  detail: ManufacturerOutput | null;
  loading: boolean;
  canViewItems: boolean;
  onViewItems: () => void;
}

function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Group gap="xs" mb="sm">
      <ThemeIcon size="sm" radius="sm" style={{ background: "var(--primary)" }} variant="filled">
        {icon}
      </ThemeIcon>
      <Text fw={700} size="sm" c="var(--text-main)">
        {label}
      </Text>
    </Group>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <Group justify="flex-start" align="flex-start" gap="xs">
      <Text size="xs" c="dimmed" style={{ minWidth: 140 }}>
        {label}:
      </Text>
      <Text size="xs" c="var(--text-main)" fw={500}>
        {value || <span style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>—</span>}
      </Text>
    </Group>
  );
}

export function ManufacturerDetailModal({
  opened,
  onClose,
  detail,
  loading,
  canViewItems,
  onViewItems,
}: ManufacturerDetailModalProps) {
  const itemCount = detail?._count?.items ?? 0;
  const batchCount = detail?._count?.batches ?? 0;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon
            size="md"
            radius="md"
            style={{ background: "var(--primary)" }}
            variant="filled"
          >
            <FaIndustry size={14} />
          </ThemeIcon>
          <Text fw={700} c="var(--text-main)">
            Detalhes do Fabricante
          </Text>
        </Group>
      }
      size="lg"
      radius="lg"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      {loading && (
        <Box className="flex items-center justify-center py-16">
          <Loader size="md" />
        </Box>
      )}

      {!loading && detail && (
        <Stack gap="lg">
          <Box>
            <SectionHeader icon={<FaBuilding size={10} />} label="Identificação" />
            <Stack gap={6}>
              <InfoRow label="Nome / Razão Social" value={detail.name} />
              <InfoRow label="CNPJ" value={detail.cnpj} />
              <InfoRow label="Cadastrado em" value={formatToBrDate(String(detail.createdAt))} />
              <InfoRow label="Atualizado em" value={formatToBrDate(String(detail.updatedAt))} />
            </Stack>
          </Box>

          {detail.city && (
            <>
              <Divider />
              <Box>
                <SectionHeader icon={<FaMapMarkerAlt size={10} />} label="Localização" />
                <Stack gap={6}>
                  <InfoRow label="Cidade" value={detail.city.name} />
                  <InfoRow label="Estado" value={detail.city.state} />
                </Stack>
              </Box>
            </>
          )}

          {detail.contact && (
            <>
              <Divider />
              <Box>
                <SectionHeader icon={<FaUser size={10} />} label="Contato" />
                <Stack gap={6}>
                  <InfoRow label="Responsável" value={detail.contact.contactPerson} />
                  <Group gap="xs">
                    {detail.contact.email && (
                      <Badge variant="light" leftSection={<FaEnvelope size={10} />} radius="sm">
                        {detail.contact.email}
                      </Badge>
                    )}
                    {detail.contact.phone && (
                      <Badge variant="light" leftSection={<FaPhone size={10} />} radius="sm" color="green">
                        {detail.contact.phone}
                      </Badge>
                    )}
                  </Group>
                </Stack>
              </Box>
            </>
          )}

          <Divider />

          <Box>
            <SectionHeader icon={<FaBoxes size={10} />} label="Itens e Lotes Vinculados" />
            <Group gap="sm" align="center">
              <Group gap="xs">
                <Badge variant="outline" leftSection={<FaBoxes size={10} />} radius="sm">
                  {itemCount} {itemCount !== 1 ? "Itens" : "Item"}
                </Badge>
                <Badge variant="outline" leftSection={<FaLayerGroup size={10} />} radius="sm" color="violet">
                  {batchCount} {batchCount !== 1 ? "Lotes" : "Lote"}
                </Badge>
              </Group>

              {canViewItems ? (
                <Button
                  id="manufacturer-view-items-btn"
                  size="xs"
                  variant="light"
                  radius="md"
                  onClick={onViewItems}
                  disabled={itemCount === 0}
                >
                  Ver Itens
                </Button>
              ) : (
                <Tooltip
                  label="Você não possui permissão para visualizar itens"
                  withArrow
                  position="right"
                >
                  <Button size="xs" variant="light" radius="md" disabled>
                    Ver Itens
                  </Button>
                </Tooltip>
              )}
            </Group>
          </Box>
        </Stack>
      )}

      {!loading && !detail && (
        <Box className="flex flex-col items-center justify-center py-16 gap-2">
          <FaIndustry size={24} color="var(--text-secondary)" />
          <Text size="sm" c="var(--text-secondary)">
            Não foi possível carregar os detalhes.
          </Text>
        </Box>
      )}
    </Modal>
  );
}
