import {
  Badge,
  Box,
  Divider,
  Grid,
  Group,
  Loader,
  Modal,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  FaBuilding,
  FaCalendarAlt,
  FaClipboardList,
  FaCode,
  FaDesktop,
  FaNetworkWired,
  FaTag,
  FaUser,
} from "react-icons/fa";
import type { DetailAuditOutput } from "../../../../types/api.contracts";
import { formatToBrDate } from "../../../../utils";
import { useAuditTranslation } from "../hooks/useAuditTranslation";
import { AuditSeverityBadge } from "./AuditSeverityBadge";

interface AuditDetailModalProps {
  opened: boolean;
  onClose: () => void;
  detail: DetailAuditOutput | null;
  loading: boolean;
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
      <Text size="xs" c="dimmed" style={{ minWidth: 160 }}>
        {label}:
      </Text>
      <Text size="xs" c="var(--text-main)" fw={500}>
        {value || <span style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>—</span>}
      </Text>
    </Group>
  );
}

function JsonBlock({ data, label }: { data: Record<string, unknown>; label: string }) {
  const isEmpty = !data || Object.keys(data).length === 0;

  return (
    <Box style={{ flex: 1, minWidth: 0 }}>
      <Text size="xs" fw={700} tt="uppercase" c="var(--text-secondary)" mb={6}>
        {label}
      </Text>
      <ScrollArea
        style={{
          background: "color-mix(in srgb, var(--bg-surface) 80%, black)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "12px",
          minHeight: 120,
          maxHeight: 320,
        }}
      >
        {isEmpty ? (
          <Text size="xs" c="var(--text-secondary)" style={{ fontStyle: "italic" }}>
            Sem dados
          </Text>
        ) : (
          <Text
            size="xs"
            c="var(--text-main)"
            style={{ fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all" }}
          >
            {JSON.stringify(data, null, 2)}
          </Text>
        )}
      </ScrollArea>
    </Box>
  );
}

export function AuditDetailModal({ opened, onClose, detail, loading }: AuditDetailModalProps) {
  const { translateAction, translateCategory } = useAuditTranslation();

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
            <FaClipboardList size={14} />
          </ThemeIcon>
          <Text fw={700} c="var(--text-main)">
            Detalhes da Auditoria
          </Text>
        </Group>
      }
      size="xl"
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
          <Group gap="sm" wrap="wrap">
            <Badge variant="outline" radius="md">
              {translateAction(detail.action)}
            </Badge>
            <Badge variant="light" color="violet" radius="md">
              {translateCategory(detail.category)}
            </Badge>
            <AuditSeverityBadge severity={detail.severity} />
          </Group>

          <Divider />

          <Box>
            <SectionHeader icon={<FaCalendarAlt size={10} />} label="Identificação" />
            <Stack gap={6}>
              <InfoRow label="ID do Registro" value={detail.id} />
              <InfoRow label="Data / Hora" value={formatToBrDate(detail.createdAt)} />
              <InfoRow label="Origem" value={detail.origin} />
              <InfoRow label="Versão do Schema" value={detail.schemaVersion} />
            </Stack>
          </Box>

          <Divider />

          <Box>
            <SectionHeader icon={<FaUser size={10} />} label="Usuário Responsável" />
            <Stack gap={6}>
              <InfoRow label="Nome" value={detail.performedByUserName} />
              <InfoRow label="E-mail" value={detail.performedByUserEmail} />
              <InfoRow label="Perfil" value={detail.performedByRole} />
            </Stack>
          </Box>

          <Divider />

          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <SectionHeader icon={<FaBuilding size={10} />} label="Unidade" />
              <Stack gap={6}>
                <InfoRow label="ID da Unidade" value={detail.facilityId} />
                <InfoRow label="Nome da Unidade" value={detail.facilityName} />
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <SectionHeader icon={<FaNetworkWired size={10} />} label="Conexão" />
              <Stack gap={6}>
                <InfoRow label="IP" value={detail.ip} />
                <InfoRow label="User Agent" value={detail.userAgent} />
              </Stack>
            </Grid.Col>
          </Grid>

          <Divider />

          <Box>
            <SectionHeader icon={<FaTag size={10} />} label="Entidade Afetada" />
            <Stack gap={6}>
              <InfoRow label="Entidade" value={detail.entity} />
              <InfoRow label="Nome" value={detail.entityName} />
              <InfoRow label="ID" value={detail.entityId} />
            </Stack>
          </Box>

          <Divider />

          <Box>
            <SectionHeader icon={<FaCode size={10} />} label="Alterações" />
            <Group align="flex-start" gap="md" wrap="nowrap" style={{ overflowX: "auto" }}>
              <JsonBlock data={detail.before} label="Antes" />
              <Box
                style={{
                  width: 1,
                  alignSelf: "stretch",
                  background: "var(--border)",
                  flexShrink: 0,
                  display: "none",
                }}
              />
              <JsonBlock data={detail.after} label="Depois" />
            </Group>
          </Box>
        </Stack>
      )}

      {!loading && !detail && (
        <Box className="flex flex-col items-center justify-center py-16 gap-2">
          <FaDesktop size={24} color="var(--text-secondary)" />
          <Text size="sm" c="var(--text-secondary)">
            Não foi possível carregar os detalhes.
          </Text>
        </Box>
      )}
    </Modal>
  );
}
