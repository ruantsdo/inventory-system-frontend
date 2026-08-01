import { Box, Button, Select } from "@mantine/core";
import { FaTimes } from "react-icons/fa";
import type { AuditFilterType } from "../../../../stores/app/audits";
import { auditActionOptions } from "../hooks/dictionaries/usersActions";

const CATEGORY_OPTIONS = [
  { value: "BUSINESS", label: "Negócio" },
  { value: "SECURITY", label: "Segurança" },
  { value: "GOVERNANCE", label: "Governança" },
  { value: "SENSITIVE_ACCESS", label: "Acesso Sensível" },
];

const SEVERITY_OPTIONS = [
  { value: "INFO", label: "Info" },
  { value: "LOW", label: "Baixo" },
  { value: "MEDIUM", label: "Médio" },
  { value: "HIGH", label: "Alto" },
  { value: "CRITICAL", label: "Crítico" },
];

interface AuditsFiltersProps {
  filterType: AuditFilterType;
  filterValue: string;
  onFilterChange: (type: AuditFilterType, value: string) => void;
  onClearFilters: () => void;
}

export function AuditsFilters({
  filterType,
  filterValue,
  onFilterChange,
  onClearFilters,
}: AuditsFiltersProps) {
  const hasActiveFilter = filterType !== "none" && filterValue !== "";

  return (
    <Box className="flex flex-col sm:flex-row gap-3 items-start sm:items-end flex-wrap">
      <Select
        id="audits-filter-action"
        placeholder="Filtrar por Ação"
        value={filterType === "action" ? filterValue : null}
        onChange={(v) => {
          if (v) onFilterChange("action", v);
        }}
        data={auditActionOptions}
        searchable
        clearable
        onClear={onClearFilters}
        radius="md"
        style={{ minWidth: 260 }}
        nothingFoundMessage="Nenhuma ação encontrada"
      />

      <Select
        id="audits-filter-category"
        placeholder="Filtrar por Categoria"
        value={filterType === "category" ? filterValue : null}
        onChange={(v) => {
          if (v) onFilterChange("category", v);
        }}
        data={CATEGORY_OPTIONS}
        clearable
        onClear={onClearFilters}
        radius="md"
        style={{ minWidth: 200 }}
      />

      <Select
        id="audits-filter-severity"
        placeholder="Filtrar por Severidade"
        value={filterType === "severity" ? filterValue : null}
        onChange={(v) => {
          if (v) onFilterChange("severity", v);
        }}
        data={SEVERITY_OPTIONS}
        clearable
        onClear={onClearFilters}
        radius="md"
        style={{ minWidth: 190 }}
      />

      {hasActiveFilter && (
        <Button
          id="audits-clear-filters-btn"
          variant="subtle"
          leftSection={<FaTimes size={12} />}
          radius="md"
          onClick={onClearFilters}
          color="gray"
        >
          Limpar Filtros
        </Button>
      )}
    </Box>
  );
}
