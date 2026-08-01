import { Alert, Box, Group, Pagination, Text } from "@mantine/core";
import { FaClipboardList, FaExclamationTriangle, FaShieldAlt } from "react-icons/fa";
import { StatCard } from "../../../components/StatCard";
import { AuditDetailModal } from "./components/AuditDetailModal";
import { AuditsFilters } from "./components/AuditsFilters";
import { AuditsHeader } from "./components/AuditsHeader";
import { AuditsTable } from "./components/AuditsTable";
import { useAudits } from "./hooks/useAudits";

export function AuditsPage() {
  const {
    audits,
    page,
    pageSize,
    filterType,
    filterValue,
    selectedDetail,
    loading,
    loadingDetail,
    error,
    handlePageChange,
    handleFilterChange,
    handleClearFilters,
    handleViewDetail,
    handleCloseDetail,
    refetch,
  } = useAudits();

  const highSeverityCount =
    audits?.filter((a) => a.severity === "HIGH" || a.severity === "CRITICAL").length || 0;

  const securityCount = audits?.filter((a) => a.category === "SECURITY").length || 0;

  const hasNextPage = audits.length === pageSize;

  return (
    <Box className="flex flex-col gap-6">
      <AuditsHeader onRefresh={refetch} loading={loading} />

      <Box className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<FaClipboardList size={20} />}
          label="Registros nesta Página"
          value={loading ? "—" : String(audits.length)}
          description="Exibindo até 1000 por página"
          color="success"
        />
        <StatCard
          icon={<FaExclamationTriangle size={20} />}
          label="Alta Severidade"
          value={loading ? "—" : String(highSeverityCount)}
          description="Registros HIGH ou CRITICAL"
          color="error"
        />
        <StatCard
          icon={<FaShieldAlt size={20} />}
          label="Segurança"
          value={loading ? "—" : String(securityCount)}
          description="Eventos de categoria SECURITY"
          color="warning"
        />
      </Box>

      <AuditsFilters
        filterType={filterType}
        filterValue={filterValue}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {error && !loading && (
        <Alert
          icon={<FaExclamationTriangle size={14} />}
          title="Erro ao carregar registros"
          color="red"
          variant="light"
          radius="md"
        >
          {error}
        </Alert>
      )}

      <AuditsTable audits={audits} loading={loading} onViewDetail={handleViewDetail} />

      {!loading && audits.length > 0 && (
        <Group justify="space-between" align="center">
          <Text size="sm" c="var(--text-secondary)">
            Página <strong>{page}</strong> · {audits.length} registros exibidos
          </Text>

          {(page > 1 || hasNextPage) && (
            <Pagination
              id="audits-pagination"
              total={hasNextPage ? page + 1 : page}
              value={page}
              onChange={handlePageChange}
              radius="md"
              size="sm"
              color="green"
            />
          )}
        </Group>
      )}

      <AuditDetailModal
        opened={!!selectedDetail || loadingDetail}
        onClose={handleCloseDetail}
        detail={selectedDetail}
        loading={loadingDetail}
      />
    </Box>
  );
}
