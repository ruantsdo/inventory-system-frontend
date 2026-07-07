import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  FaAddressCard,
  FaBriefcase,
  FaBuilding,
  FaClipboardList,
  FaEdit,
  FaShieldAlt,
  FaUser,
} from "react-icons/fa";
import { getSelfData } from "../../../../services/users";
import { useUserManagementStore } from "../../../../stores/app/userManagement";
import { useAuthStore } from "../../../../stores/auth";
import { useUtilsStore } from "../../../../stores/utils";
import type { UserData } from "../../../../types/user";
import { formatToBrDate } from "../../../../utils/date.utils";

interface ProfileModalProps {
  opened: boolean;
  handleClose: () => void;
  targetId: string;
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
      <Text size="xs" c="dimmed" style={{ minWidth: 140 }}>
        {label}:
      </Text>
      <Text size="xs" c="var(--text-main)" fw={500}>
        {value || <span style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>—</span>}
      </Text>
    </Group>
  );
}

export function ProfileModal({ opened, handleClose, targetId }: ProfileModalProps) {
  const { getUserDataByID, loading } = useUserManagementStore();
  const { handleNavigation } = useUtilsStore();
  const { currentSession } = useAuthStore();
  const [user, setUser] = useState<UserData>();
  const [adress, setAdress] = useState<string>("");

  const isAutenticadedUser = currentSession?.user?.id === targetId;

  const modalTitle = isAutenticadedUser ? "Meu Perfil" : "Informações do usuário";

  const fetchUserData = async () => {
    let userData: UserData;
    if (isAutenticadedUser) {
      userData = await getSelfData();
    } else {
      userData = await getUserDataByID(targetId);
    }
    setAdress(buildFullAdressString(userData));
    setUser(userData);
  };

  const handleEdit = () => {
    const targetId = currentSession?.user?.id;
    if (!targetId) return;
    handleNavigation(`/users/edit/${targetId}`, "users.update");
    handleClose();
  };

  const buildFullAdressString = (userData: UserData) => {
    const { streetAddress, number, neighborhood, addressCity, state } = userData;

    const streetPart = [streetAddress, number].filter(Boolean).join(", ");
    const localPart = [streetPart, neighborhood].filter(Boolean).join(", ");
    const cityStatePart = [addressCity, state].filter(Boolean).join("-");

    return [localPart, cityStatePart].filter(Boolean).join(" - ");
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Modal opened={opened} onClose={handleClose} title={modalTitle} size="50%" radius="md">
      {loading ? (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
          }}
        >
          <Loader size="md" />
        </Box>
      ) : user ? (
        <Stack gap="md">
          <Stack align="center" gap="xs" my="md">
            <Avatar
              key={user.fullName}
              name={user.fullName}
              variant="light"
              color="initials"
              size="80"
              radius="100%"
            />
            <Text fw={700} size="md" c="var(--text-main)" style={{ textAlign: "center" }}>
              {user.fullName}
            </Text>
            <Text size="xs" c="dimmed" style={{ textAlign: "center" }}>
              {user.email}
            </Text>
          </Stack>

          {isAutenticadedUser && (
            <Stack align="center" mt="-1.5rem">
              <Button
                variant="outline"
                leftSection={<FaEdit size={16} />}
                color="blue"
                onClick={handleEdit}
              >
                Editar
              </Button>
            </Stack>
          )}

          <Card withBorder padding="lg" radius="md">
            <SectionHeader
              icon={<FaUser size={12} />}
              label="Dados Pessoais"
              color="var(--primary)"
            />
            <Stack gap={8}>
              <InfoRow label="Nome Completo" value={user.fullName} />
              <InfoRow label="Data de Nascimento" value={formatToBrDate(user.birthDate)} />
              <InfoRow label="CPF" value={user.cpf} />
              <InfoRow label="Telefone" value={user.phone || null} />
              <InfoRow label="E-mail" value={user.email} />
            </Stack>
          </Card>

          {adress && (
            <Card withBorder padding="lg" radius="md">
              <SectionHeader
                icon={<FaAddressCard size={12} />}
                label="Endereço"
                color="var(--secondary)"
              />
              <Stack gap={8}>
                <InfoRow label="Endereço Completo" value={adress} />
                {user.zipCode && <InfoRow label="CEP" value={user.zipCode} />}
                {user.additionalInfo && <InfoRow label="Complemento" value={user.additionalInfo} />}
              </Stack>
            </Card>
          )}

          {user.professionalDocuments && user.professionalDocuments.length > 0 && (
            <Card withBorder padding="lg" radius="md">
              <SectionHeader
                icon={<FaBriefcase size={12} />}
                label="Documentação Profissional"
                color="#8b5cf6"
              />
              <Stack gap="sm">
                {user.professionalDocuments.map((doc, idx) => (
                  <Box key={`${doc.documentType}-${idx}`}>
                    {idx > 0 && <Divider my="xs" />}
                    <Stack gap={8}>
                      <InfoRow label="Tipo de Documento" value={doc.documentType} />
                      <InfoRow label="Número do Registro" value={doc.documentNumber} />
                      {doc.issuer && <InfoRow label="Órgão Emissor" value={doc.issuer} />}
                      {doc.issuerState && <InfoRow label="UF Emissora" value={doc.issuerState} />}
                      {doc.issuedAt && (
                        <InfoRow label="Data de Emissão" value={formatToBrDate(doc.issuedAt)} />
                      )}
                      {doc.expiresAt && (
                        <InfoRow label="Data de Validade" value={formatToBrDate(doc.expiresAt)} />
                      )}
                      {doc.notes && <InfoRow label="Observações" value={doc.notes} />}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Card>
          )}

          {user.roles && user.roles.length > 0 && (
            <Card withBorder padding="lg" radius="md">
              <SectionHeader
                icon={<FaShieldAlt size={12} />}
                label="Cargos e Permissões"
                color="#f59e0b"
              />
              <Stack gap="md">
                {user.roles.map((role, index) => (
                  <Box key={`role-${role.roleName}-${index}`}>
                    {index > 0 && <Divider my="md" />}
                    <Stack gap="xs">
                      <Group gap="xs" align="center">
                        <FaClipboardList size={12} color="var(--text-secondary)" />
                        <Text size="sm" fw={600} c="var(--text-main)">
                          {role.roleName}
                        </Text>
                      </Group>

                      {role.facilities && role.facilities.length > 0 && (
                        <Group gap={4} wrap="wrap" align="center">
                          <FaBuilding size={10} color="var(--text-secondary)" />
                          <Text size="xs" c="dimmed" mr={4}>
                            Unidades:
                          </Text>
                          {role.facilities.map((fac) => (
                            <Badge key={fac} size="sm" color="teal" variant="outline">
                              {fac}
                            </Badge>
                          ))}
                        </Group>
                      )}

                      {role.permissionNames && role.permissionNames.length > 0 && (
                        <Stack gap={4}>
                          <Text size="xs" fw={500} c="dimmed">
                            Permissões Atribuídas:
                          </Text>
                          <Group gap={4} wrap="wrap">
                            {role.permissionNames.map((perm) => (
                              <Badge key={perm} size="xs" color="gray" variant="light">
                                {perm}
                              </Badge>
                            ))}
                          </Group>
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Card>
          )}
        </Stack>
      ) : (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 100,
          }}
        >
          <Text size="sm" c="dimmed" fs="italic">
            Não foi possível carregar as informações.
          </Text>
        </Box>
      )}
    </Modal>
  );
}
