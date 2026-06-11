import {
  Alert,
  Badge,
  Box,
  Card,
  Code,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useFormContext } from "react-hook-form";
import {
  FaAddressCard,
  FaBuilding,
  FaCheckCircle,
  FaClipboardList,
  FaEnvelope,
  FaFileAlt,
  FaIdCard,
  FaShieldAlt,
  FaUser,
} from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import type { CreateUserFinalStepProps, CreateUserFormState } from "../../../../types/createUser";

function SectionHeader({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color?: string;
}) {
  return (
    <Group gap="xs" mb="sm">
      <ThemeIcon
        size="sm"
        radius="sm"
        style={{ background: color ?? "var(--primary)" }}
        variant="filled"
      >
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
      <Text size="xs" c="dimmed" style={{ minWidth: 120 }}>
        {label}:
      </Text>
      <Text size="xs" c="var(--text-main)" fw={500} style={{ textAlign: "right" }}>
        {value || <span style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>—</span>}
      </Text>
    </Group>
  );
}

export function CreateUserFinalStep({ payload, allRoles }: CreateUserFinalStepProps) {
  const { getValues } = useFormContext<CreateUserFormState>();
  const data = getValues();

  const hasAddress = data.zipCode || data.streetAddress || data.addressCity || data.addressState;

  return (
    <Stack gap="lg">
      <Alert
        icon={<FaCheckCircle />}
        title="Quase lá! Revise os dados antes de confirmar o cadastro."
        color="green"
        variant="light"
        radius="md"
      >
        Após a confirmação, um e-mail de ativação será enviado ao endereço de e-mail informado. O
        usuário deverá clicar no link recebido para criar sua senha e acessar o sistema.
      </Alert>

      <Card withBorder padding="lg" radius="md">
        <SectionHeader icon={<FaUser size={12} />} label="Dados Pessoais" color="var(--primary)" />
        <Stack gap={8}>
          <InfoRow label="Nome Completo" value={data.fullName} />
          <InfoRow
            label="Data de Nascimento"
            value={data.birthDate ? new Date(data.birthDate).toLocaleDateString("pt-BR") : null}
          />
          <InfoRow label="CPF" value={data.cpf || null} />
          <InfoRow label="Telefone" value={data.phone || null} />
          <InfoRow label="E-mail" value={data.email || null} />
        </Stack>
      </Card>

      {hasAddress && (
        <Card withBorder padding="lg" radius="md">
          <SectionHeader
            icon={<FaAddressCard size={12} />}
            label="Endereço"
            color="var(--secondary)"
          />
          <Stack gap={8}>
            <InfoRow label="CEP" value={data.zipCode || null} />
            <InfoRow
              label="Logradouro"
              value={[data.streetAddress, data.addressNumber].filter(Boolean).join(", ") || null}
            />
            <InfoRow label="Complemento" value={data.additionalInfo || null} />
            <InfoRow label="Bairro" value={data.neighborhood || null} />
            <InfoRow
              label="Cidade / UF"
              value={[data.addressCity, data.addressState].filter(Boolean).join(" / ") || null}
            />
          </Stack>
        </Card>
      )}

      <Card withBorder padding="lg" radius="md">
        <SectionHeader
          icon={<FaFileAlt size={12} />}
          label="Documentação Profissional"
          color="#8b5cf6"
        />
        {data.hasProfessionalDocument && data.documentType && data.documentNumber ? (
          <Stack gap={8}>
            <InfoRow label="Tipo" value={data.documentType} />
            <InfoRow label="Número" value={data.documentNumber} />
          </Stack>
        ) : (
          <Text size="sm" c="dimmed" fs="italic">
            Nenhum documento especial foi fornecido.
          </Text>
        )}
      </Card>

      <Card withBorder padding="lg" radius="md">
        <SectionHeader
          icon={<FaShieldAlt size={12} />}
          label={`Alocações de Cargo (${data.allocations.length})`}
          color="#f59e0b"
        />

        {data.allocations.length === 0 ? (
          <Text size="sm" c="dimmed" fs="italic">
            Nenhuma alocação configurada.
          </Text>
        ) : (
          <Stack gap="sm">
            {data.allocations.map((alloc, idx) => (
              <Box key={alloc.id}>
                {idx > 0 && <Divider my="xs" />}
                <Stack gap="xs">
                  <Group gap={16} align="center">
                    <Box style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <FaClipboardList size={12} color="var(--text-secondary)" />
                      <Text size="sm" fw={600} c="var(--text-main)">
                        {alloc.roleDisplayName}
                      </Text>
                    </Box>
                    <Box style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <FaLocationCrosshairs size={10} color="var(--text-secondary)" />
                      <Badge color="blue" variant="light" size="sm">
                        {alloc.cityName}
                      </Badge>
                    </Box>
                  </Group>
                  <Group gap={4} wrap="wrap" align="center">
                    <FaBuilding size={10} color="var(--text-secondary)" />
                    {alloc.facilityNames.map((name) => (
                      <Badge key={name} size="sm" color="teal" variant="outline">
                        {name}
                      </Badge>
                    ))}
                  </Group>
                  <Text size="xs" c="dimmed">
                    Permissões atribuídas: {(() => {
                      const rolePerms =
                        allRoles.find((r) => r.id === alloc.roleId)?.permissions ?? [];
                      const names = rolePerms
                        .filter((p) => alloc.permissionIds.includes(p.id))
                        .map((p) => p.displayName);
                      return names.length > 0 ? names.join(", ") : "—";
                    })()}
                  </Text>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Card>

      <Card withBorder padding="lg" radius="md">
        <Group gap="xs" mb="sm">
          <FaIdCard size={12} color="var(--text-secondary)" />
          <Text size="xs" fw={600} c="dimmed">
            Payload de envio ao servidor
          </Text>
          <Badge size="xs" color="orange" variant="outline">
            dev
          </Badge>
        </Group>
        <ScrollArea.Autosize mah={260} type="auto">
          <Code block style={{ fontSize: 11, whiteSpace: "pre" }}>
            {JSON.stringify(payload, null, 2)}
          </Code>
        </ScrollArea.Autosize>
      </Card>

      <Stack gap={4}>
        <Group gap="xs" align="center">
          <FaEnvelope size={12} color="var(--primary)" />
          <Text size="xs" c="var(--text-secondary)">
            Um link de ativação será enviado ao e-mail <strong>{data.email}</strong>.
          </Text>
        </Group>
        <Group gap="xs" align="center">
          <FaShieldAlt size={12} color="var(--secondary)" />
          <Text size="xs" c="var(--text-secondary)">
            O acesso ao sistema só será liberado após a confirmação da conta pelo usuário.
          </Text>
        </Group>
      </Stack>
    </Stack>
  );
}
