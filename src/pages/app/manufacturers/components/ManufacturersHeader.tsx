import { Box, Button, Text, Title } from "@mantine/core";
import { FaIndustry, FaPlus, FaSync } from "react-icons/fa";

interface ManufacturersHeaderProps {
  onRefresh: () => void;
  onCreateNew: () => void;
  loading: boolean;
}

export function ManufacturersHeader({ onRefresh, onCreateNew, loading }: ManufacturersHeaderProps) {
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
          <FaIndustry size={20} color="var(--primary)" />
        </Box>
        <Box>
          <Title order={3} c="var(--text-main)">
            Controle de Fabricantes
          </Title>
          <Text size="sm" c="var(--text-secondary)" mt={2}>
            Gerenciamento de fabricantes e itens vinculados
          </Text>
        </Box>
      </Box>

      <Box className="flex gap-2">
        <Button
          id="manufacturers-refresh-btn"
          leftSection={<FaSync size={13} />}
          radius="md"
          variant="outline"
          loading={loading}
          onClick={onRefresh}
          style={{ borderColor: "var(--border)", color: "var(--text-main)" }}
        >
          Atualizar
        </Button>
        <Button
          id="manufacturers-create-btn"
          leftSection={<FaPlus size={13} />}
          radius="md"
          onClick={onCreateNew}
        >
          Novo Fabricante
        </Button>
      </Box>
    </Box>
  );
}
