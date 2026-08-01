import { Box, Button, Text, Title } from "@mantine/core";
import { FaClipboardList, FaSync } from "react-icons/fa";

interface AuditsHeaderProps {
  onRefresh: () => void;
  loading: boolean;
}

export function AuditsHeader({ onRefresh, loading }: AuditsHeaderProps) {
  return (
    <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <Box className="flex items-center gap-3">
        <Box
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "color-mix(in srgb, var(--primary) 15%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FaClipboardList size={20} color="var(--primary)" />
        </Box>
        <Box>
          <Title order={3} c="var(--text-main)">
            Logs de Auditoria
          </Title>
          <Text size="sm" c="var(--text-secondary)" mt={2}>
            Histórico de eventos e ações registradas no sistema
          </Text>
        </Box>
      </Box>

      <Button
        id="audits-refresh-btn"
        leftSection={<FaSync size={13} />}
        radius="md"
        variant="outline"
        loading={loading}
        onClick={onRefresh}
        style={{ borderColor: "var(--border)", color: "var(--text-main)" }}
      >
        Atualizar
      </Button>
    </Box>
  );
}
