import { useCallback, useEffect } from "react";
import { useAuthStore } from "../../../../stores/auth";
import { useManufacturersStore } from "../../../../stores/app/manufacturers";
import { hasPermission } from "../../../../utils/permissions.utils";

export function useManufacturers() {
  const {
    manufacturers,
    total,
    page,
    limit,
    totalPages,
    search,
    isActive,
    selectedDetail,
    loadingDetail,
    editingManufacturer,
    isFormModalOpen,
    saving,
    deleting,
    loading,
    error,
    fetchManufacturers,
    setPage,
    setSearch,
    setIsActive,
    fetchManufacturerDetail,
    clearSelectedDetail,
    openCreateModal,
    openEditModal,
    closeFormModal,
    saveManufacturer,
    deleteManufacturer,
  } = useManufacturersStore();

  const { currentSession } = useAuthStore();

  const canViewItems = hasPermission(currentSession, "items.view");

  useEffect(() => {
    fetchManufacturers();
  }, [fetchManufacturers, page, search, isActive]);

  const handlePageChange = useCallback(
    (newPage: number) => setPage(newPage),
    [setPage],
  );

  const handleSearchChange = useCallback(
    (value: string) => setSearch(value),
    [setSearch],
  );

  const handleIsActiveFilterChange = useCallback(
    (value: string | null) => {
      if (value === "true") setIsActive(true);
      else if (value === "false") setIsActive(false);
      else setIsActive(undefined);
    },
    [setIsActive],
  );

  const handleClearSearch = useCallback(() => setSearch(""), [setSearch]);

  const handleViewDetail = useCallback(
    (id: string) => fetchManufacturerDetail(id),
    [fetchManufacturerDetail],
  );

  return {
    manufacturers,
    total,
    page,
    limit,
    totalPages,
    search,
    isActive,
    selectedDetail,
    loadingDetail,
    editingManufacturer,
    isFormModalOpen,
    saving,
    deleting,
    loading,
    error,
    canViewItems,
    handlePageChange,
    handleSearchChange,
    handleClearSearch,
    handleIsActiveFilterChange,
    handleViewDetail,
    handleCloseDetail: clearSelectedDetail,
    handleOpenCreate: openCreateModal,
    handleOpenEdit: openEditModal,
    handleCloseForm: closeFormModal,
    handleSave: saveManufacturer,
    handleDelete: deleteManufacturer,
    refetch: fetchManufacturers,
  };
}
