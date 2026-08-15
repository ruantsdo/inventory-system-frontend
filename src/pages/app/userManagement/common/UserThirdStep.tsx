import { Alert, Badge, Box, Card, Divider, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import dayjs from "dayjs";
import { useFormContext } from "react-hook-form";
import {
  FaAddressCard,
  FaBuilding,
  FaCheckCircle,
  FaClipboardList,
  FaEnvelope,
  FaFileAlt,
  FaShieldAlt,
  FaUser,
} from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import type {
  CreateUserPayload,
  RoleWithPermissionsOutput,
  UpdateUserPayload,
} from "../../../../types/api.contracts";
import type { CreateUserFormState } from "../../../../types/createUser";

interface UserThirdStepProps {
  payload?: CreateUserPayload | UpdateUserPayload;
  allRoles: RoleWithPermissionsOutput[];
  mode?: "create" | "edit";
}

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

export function UserThirdStep({ allRoles, mode }: UserThirdStepProps) {
  const { getValues } = useFormContext<CreateUserFormState>();
  const data = getValues();
  const fullName = data.fullName;

  const hasAddress = data.zipCode || data.streetAddress || data.addressCity || data.addressState;

  const alertTitle =
    mode === "edit"
      ? "Quase lá! Revise os dados antes de salvar as alterações."
      : "Quase lá! Revise os dados antes de confirmar o cadastro.";

  const alertDescription =
    mode === "edit"
      ? "Após a confirmação, as informações cadastrais e alocações do usuário serão atualizadas no sistema."
      : "Após a confirmação, um e-mail de ativação será enviado ao endereço de e-mail informado. O usuário deverá clicar no link recebido para criar sua senha e acessar o sistema.";

  return (
    <Stack gap="lg">
      {mode === "edit" && fullName && (
        <Card
          withBorder
          padding="sm"
          radius="md"
          style={{
            borderColor: "var(--primary)",
            background: "color-mix(in srgb, var(--primary) 8%, transparent)",
          }}
        >
          <Text size="sm" fw={600} c="var(--primary)">
            Editando o usuário {fullName}
          </Text>
        </Card>
      )}

      <Alert icon={<FaCheckCircle />} title={alertTitle} color="green" variant="light" radius="md">
        {alertDescription}
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
        {data.hasProfessionalDocument &&
        data.professionalDocuments &&
        data.professionalDocuments.length > 0 ? (
          <Stack gap="md">
            {data.professionalDocuments.map((doc, idx) => (
              <Box key={doc.id || idx}>
                {idx > 0 && <Divider my="xs" />}
                <Stack gap={4}>
                  <Group gap="xs">
                    <Badge color="violet" variant="light">
                      {doc.documentType}
                    </Badge>
                    <Text size="sm" fw={600}>
                      {doc.documentNumber}
                    </Text>
                    {doc.issuerState && (
                      <Badge color="gray" variant="outline" size="xs">
                        {doc.issuerState}
                      </Badge>
                    )}
                  </Group>
                  <Stack gap={2} mt={2}>
                    {doc.issuer && <InfoRow label="Órgão Emissor" value={doc.issuer} />}
                    {doc.issuedAt && (
                      <InfoRow
                        label="Data de Emissão"
                        value={dayjs(doc.issuedAt).format("DD/MM/YYYY")}
                      />
                    )}
                    {doc.expiresAt && (
                      <InfoRow
                        label="Data de Validade"
                        value={dayjs(doc.expiresAt).format("DD/MM/YYYY")}
                      />
                    )}
                    {doc.notes && <InfoRow label="Observações" value={doc.notes} />}
                  </Stack>
                </Stack>
              </Box>
            ))}
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

      <Stack gap={4}>
        <Group gap="xs" align="center">
          <FaEnvelope size={12} color="var(--primary)" />
          <Text size="xs" c="var(--text-secondary)">
            {mode === "edit"
              ? `Os dados do usuário com e-mail ${data.email} serão atualizados.`
              : `Um link de ativação será enviado ao e-mail ${data.email}.`}
          </Text>
        </Group>
        <Group gap="xs" align="center">
          <FaShieldAlt size={12} color="var(--secondary)" />
          <Text size="xs" c="var(--text-secondary)">
            {mode === "edit"
              ? "As permissões e cargos do usuário passam a valer imediatamente após salvar."
              : "O acesso ao sistema só será liberado após a confirmação da conta pelo usuário."}
          </Text>
        </Group>
      </Stack>
    </Stack>
  );
}
