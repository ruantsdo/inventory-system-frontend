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
import {
  FaBoxes,
  FaBuilding,
  FaEnvelope,
  FaExternalLinkAlt,
  FaIndustry,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { countries } from "../../../../enums";
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

function InfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
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
  const countryName = countries.find((c) => c.value === detail?.country)?.label || detail?.country || "Brasil";

  const formattedAddress = detail?.address
    ? [
        detail.address.street,
        detail.address.number,
        detail.address.complement,
        detail.address.neighborhood,
        detail.address.zipCode ? `CEP ${detail.address.zipCode}` : null,
      ]
        .filter(Boolean)
        .join(", ")
    : null;

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
            <Group justify="space-between" align="center" mb="sm">
              <SectionHeader icon={<FaBuilding size={10} />} label="Identificação" />
              <Badge variant="light" color={detail.isActive ? "green" : "gray"} radius="sm">
                {detail.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </Group>
            <Stack gap={6}>
              <InfoRow label="Razão Social" value={detail.name} />
              <InfoRow label="Nome Fantasia / Marca" value={detail.tradeName} />
              <InfoRow label="CNPJ" value={detail.cnpj} />
              <InfoRow label="País de Origem" value={countryName} />
              <InfoRow label="Código Regulatório" value={detail.regulatoryCode} />
              {detail.website && (
                <InfoRow
                  label="Website Oficial"
                  value={
                    <a
                      href={detail.website.startsWith("http") ? detail.website : `https://${detail.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline inline-flex items-center gap-1"
                    >
                      {detail.website} <FaExternalLinkAlt size={9} />
                    </a>
                  }
                />
              )}
              <InfoRow label="Cadastrado em" value={formatToBrDate(String(detail.createdAt))} />
              <InfoRow label="Atualizado em" value={formatToBrDate(String(detail.updatedAt))} />
            </Stack>
          </Box>

          <Divider />

          <Box>
            <SectionHeader icon={<FaMapMarkerAlt size={10} />} label="Localização e Endereço" />
            <Stack gap={6}>
              {detail.city && (
                <InfoRow label="Cidade / Estado" value={`${detail.city.name}${detail.city.state ? ` / ${detail.city.state}` : ""}`} />
              )}
              <InfoRow label="Endereço" value={formattedAddress} />
            </Stack>
          </Box>

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
                  leftSection={<FaBoxes size={11} />}
                  onClick={onViewItems}
                  disabled={itemCount === 0}
                >
                  Visualizar Itens do Fabricante
                </Button>
              ) : (
                <Tooltip label="Você não tem permissão para visualizar itens" withArrow>
                  <span>
                    <Button size="xs" variant="light" radius="md" disabled>
                      Visualizar Itens do Fabricante
                    </Button>
                  </span>
                </Tooltip>
              )}
            </Group>
          </Box>
        </Stack>
      )}
    </Modal>
  );
}
