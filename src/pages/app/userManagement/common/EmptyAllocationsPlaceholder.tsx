import { Card, Stack, Text } from "@mantine/core";
import { FaShieldAlt } from "react-icons/fa";

export function EmptyAllocationsPlaceholder() {
  return (
    <Card
      withBorder
      padding="lg"
      radius="md"
      style={{ borderStyle: "dashed", borderColor: "var(--border)" }}
    >
      <Stack align="center" gap="xs">
        <FaShieldAlt size={24} color="var(--text-secondary)" />
        <Text size="sm" c="dimmed" ta="center">
          Nenhuma alocação configurada ainda.
          <br />
          Use o formulário acima para atribuir um cargo a uma ou mais unidades.
        </Text>
      </Stack>
    </Card>
  );
}
