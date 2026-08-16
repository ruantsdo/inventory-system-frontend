import { Alert, Box, Group, Pagination, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { ActionConfirmModal } from "../../../components";
import type { ManufacturerOutput } from "../../../types/api.contracts";
import { ManufacturerDetailModal } from "./components/ManufacturerDetailModal";
import { ManufacturerFormModal } from "./components/ManufacturerFormModal";
import { ManufacturerItemsModal } from "./components/ManufacturerItemsModal";
import { ManufacturersFilters } from "./components/ManufacturersFilters";
import { ManufacturersHeader } from "./components/ManufacturersHeader";
import { ManufacturersTable } from "./components/ManufacturersTable";
import { useManufacturers } from "./hooks/useManufacturers";

export function ManufacturersPage() {
  const {
    manufacturers,
    page,
    totalPages,
    search,
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
    handleViewDetail,
    handleCloseDetail,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleSave,
    handleDelete,
    refetch,
  } = useManufacturers();

  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [itemsOpened, { open: openItems, close: closeItems }] = useDisclosure(false);
  const [deletingTarget, setDeletingTarget] = useState<ManufacturerOutput | null>(null);

  function handleDeleteClick(id: string) {
    const target = manufacturers.find((m) => m.id === id);
    if (target) {
      setDeletingTarget(target);
      openDelete();
    }
  }

  async function handleConfirmDelete() {
    if (deletingTarget) {
      try {
        await handleDelete(deletingTarget.id);
        setDeletingTarget(null);
        closeDelete();
      } catch {}
    }
  }

  function handleEditClick(manufacturer: ManufacturerOutput) {
    handleOpenEdit(manufacturer);
  }

  function handleOpenItemsModal() {
    openItems();
  }

  return (
    <Box className="flex flex-col gap-6">
      <ManufacturersHeader onRefresh={refetch} onCreateNew={handleOpenCreate} loading={loading} />

      <ManufacturersFilters
        search={search}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
      />

      {error && !loading && (
        <Alert
          icon={<FaExclamationTriangle size={14} />}
          title="Erro ao carregar fabricantes"
          color="red"
          variant="light"
          radius="md"
        >
          {error}
        </Alert>
      )}

      <ManufacturersTable
        manufacturers={manufacturers}
        loading={loading}
        onViewDetail={handleViewDetail}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {!loading && totalPages > 1 && (
        <Group justify="space-between" align="center">
          <Text size="sm" c="var(--text-secondary)">
            Página <strong>{page}</strong> de <strong>{totalPages}</strong>
          </Text>
          <Pagination
            id="manufacturers-pagination"
            total={totalPages}
            value={page}
            onChange={handlePageChange}
            radius="md"
            size="sm"
            color="green"
          />
        </Group>
      )}

      <ManufacturerDetailModal
        opened={!!selectedDetail || loadingDetail}
        onClose={handleCloseDetail}
        detail={selectedDetail}
        loading={loadingDetail}
        canViewItems={canViewItems}
        onViewItems={handleOpenItemsModal}
      />

      <ManufacturerFormModal
        opened={isFormModalOpen}
        onClose={handleCloseForm}
        editing={editingManufacturer}
        saving={saving}
        onSave={handleSave}
      />

      <ManufacturerItemsModal
        opened={itemsOpened}
        onClose={closeItems}
        manufacturer={selectedDetail}
      />

      <ActionConfirmModal
        opened={deleteOpened}
        onClose={closeDelete}
        action="delete"
        title="Remover fabricante?"
        description="Esta ação não pode ser desfeita. Tem certeza que deseja remover permanentemente o seguinte fabricante do sistema?"
        confirmLabel="Remover"
        confirmBtnId="manufacturer-confirm-delete-btn"
        cancelBtnId="manufacturer-cancel-delete-btn"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        itemDetails={
          deletingTarget
            ? {
                avatar: { name: deletingTarget.name },
                title: deletingTarget.name,
                subtitle: deletingTarget.cnpj
                  ? `CNPJ: ${deletingTarget.cnpj}`
                  : deletingTarget.contact?.email || undefined,
                badge: deletingTarget.city
                  ? `${deletingTarget.city.name}${deletingTarget.city.state ? ` / ${deletingTarget.city.state}` : ""}`
                  : undefined,
              }
            : undefined
        }
      />
    </Box>
  );
}
