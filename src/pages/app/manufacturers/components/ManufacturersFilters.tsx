import { Box, Button, Select, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface ManufacturersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  isActiveFilter: string | null;
  onIsActiveFilterChange: (value: string | null) => void;
}

export function ManufacturersFilters({
  search,
  onSearchChange,
  onClearSearch,
  isActiveFilter,
  onIsActiveFilterChange,
}: ManufacturersFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);
  const [debounced] = useDebouncedValue(localSearch, 500);

  useEffect(() => {
    onSearchChange(debounced);
  }, [debounced, onSearchChange]);

  const handleClear = () => {
    setLocalSearch("");
    onClearSearch();
  };

  return (
    <Box className="flex flex-col sm:flex-row gap-3 items-start sm:items-end flex-wrap">
      <TextInput
        id="manufacturers-search-input"
        placeholder="Buscar por nome, marca ou CNPJ..."
        leftSection={<FaSearch size={13} />}
        value={localSearch}
        onChange={(e) => setLocalSearch(e.currentTarget.value)}
        radius="md"
        style={{ minWidth: 300 }}
      />

      <Select
        id="manufacturers-status-filter"
        placeholder="Todos os status"
        data={[
          { value: "true", label: "Ativos" },
          { value: "false", label: "Inativos" },
        ]}
        value={isActiveFilter}
        onChange={onIsActiveFilterChange}
        clearable
        radius="md"
        style={{ minWidth: 160 }}
      />

      {(localSearch || isActiveFilter) && (
        <Button
          id="manufacturers-clear-search-btn"
          variant="subtle"
          leftSection={<FaTimes size={12} />}
          radius="md"
          onClick={() => {
            handleClear();
            onIsActiveFilterChange(null);
          }}
          color="gray"
        >
          Limpar filtros
        </Button>
      )}
    </Box>
  );
}
