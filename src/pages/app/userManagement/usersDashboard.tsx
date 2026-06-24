import { Alert, Box, Group, Pagination, Text } from "@mantine/core";
import { FaExclamationTriangle, FaUsers } from "react-icons/fa";
import { StatCard } from "../../../components/StatCard";
import { UsersDashboardFilters } from "./components/dashboard/UsersDashboardFilters";
import { UsersDashboardHeader } from "./components/dashboard/UsersDashboardHeader";
import { UsersTable } from "./components/dashboard/UsersTable";
import { useUsersDashboard } from "./hooks/useUsersDashboard";

export const UsersDashboardPage = () => {
  const {
    users,
    allUsers,
    total,
    page,
    pageSize,
    statusFilter,
    loading,
    error,
    setPage,
    setSearch,
    setStatusFilter,
  } = useUsersDashboard();

  const totalPages = Math.ceil(total / pageSize);
  const activeCount = allUsers.filter((u) => u.isActive).length;
  const inactiveCount = allUsers.filter((u) => !u.isActive).length;

  return (
    <Box className="flex flex-col gap-6">
      <UsersDashboardHeader />

      <Box className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<FaUsers size={20} />}
          label="Total de Usuários"
          value={loading ? "—" : String(total)}
          description="Resultado dos filtros atuais"
          color="success"
        />
        <StatCard
          icon={<FaUsers size={20} />}
          label="Ativos"
          value={loading ? "—" : String(activeCount)}
          description="Usuários com acesso ativo"
          color="success"
        />
        <StatCard
          icon={<FaUsers size={20} />}
          label="Inativos"
          value={loading ? "—" : String(inactiveCount)}
          description="Sem acesso ao sistema"
          color="warning"
        />
      </Box>

      <UsersDashboardFilters
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        statusFilter={statusFilter}
      />

      {error && !loading && (
        <Alert
          icon={<FaExclamationTriangle size={14} />}
          title="Erro ao carregar usuários"
          color="red"
          variant="light"
          radius="md"
        >
          {error}
        </Alert>
      )}

      <UsersTable users={users} loading={loading} />

      {!loading && total > 0 && (
        <Group justify="space-between" align="center">
          <Text size="sm" c="var(--text-secondary)">
            Exibindo{" "}
            <strong>
              {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)}
            </strong>{" "}
            de <strong>{total}</strong> usuários
          </Text>

          {totalPages > 1 && (
            <Pagination
              id="users-pagination"
              total={totalPages}
              value={page}
              onChange={setPage}
              radius="md"
              size="sm"
              color="green"
            />
          )}
        </Group>
      )}
    </Box>
  );
};
