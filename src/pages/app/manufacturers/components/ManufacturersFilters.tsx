import { Box, Button, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface ManufacturersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}

export function ManufacturersFilters({
  search,
  onSearchChange,
  onClearSearch,
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
        placeholder="Buscar por nome ou CNPJ..."
        leftSection={<FaSearch size={13} />}
        value={localSearch}
        onChange={(e) => setLocalSearch(e.currentTarget.value)}
        radius="md"
        style={{ minWidth: 300 }}
      />

      {localSearch && (
        <Button
          id="manufacturers-clear-search-btn"
          variant="subtle"
          leftSection={<FaTimes size={12} />}
          radius="md"
          onClick={handleClear}
          color="gray"
        >
          Limpar
        </Button>
      )}
    </Box>
  );
}
