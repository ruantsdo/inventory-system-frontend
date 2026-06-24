import { Box, SegmentedControl, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import type { UserStatusFilter } from "../../../../../types/usersDashboard";

interface UsersDashboardFiltersProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: UserStatusFilter) => void;
  statusFilter: UserStatusFilter;
}

export function UsersDashboardFilters({
  onSearchChange,
  onStatusChange,
  statusFilter,
}: UsersDashboardFiltersProps) {
  const [localSearch, setLocalSearch] = useState("");
  const [debounced] = useDebouncedValue(localSearch, 350);

  useEffect(() => {
    onSearchChange(debounced);
  }, [debounced, onSearchChange]);

  return (
    <Box className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
      <TextInput
        id="users-search-input"
        placeholder="Buscar por nome, e-mail ou CPF..."
        leftSection={<FaSearch size={13} />}
        value={localSearch}
        onChange={(e) => setLocalSearch(e.currentTarget.value)}
        style={{ minWidth: 260, flex: 1 }}
        radius="md"
      />

      <SegmentedControl
        id="users-status-filter"
        value={statusFilter}
        onChange={(v) => onStatusChange(v as UserStatusFilter)}
        radius="md"
        data={[
          { label: "Todos", value: "all" },
          { label: "Ativos", value: "active" },
          { label: "Inativos", value: "inactive" },
        ]}
      />
    </Box>
  );
}
