import { useCallback, useEffect } from "react";
import type { AuditFilterType } from "../../../../stores/app/audits";
import { useAuditsStore } from "../../../../stores/app/audits";

export function useAudits() {
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
    fetchAudits,
    setPage,
    setFilter,
    clearFilters,
    fetchAuditDetail,
    clearSelectedDetail,
  } = useAuditsStore();

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits, page, filterType, filterValue]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    [setPage],
  );

  const handleFilterChange = useCallback(
    (type: AuditFilterType, value: string) => {
      setFilter(type, value);
    },
    [setFilter],
  );

  const handleViewDetail = useCallback(
    (id: string) => {
      fetchAuditDetail(id);
    },
    [fetchAuditDetail],
  );

  return {
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
    handleClearFilters: clearFilters,
    handleViewDetail,
    handleCloseDetail: clearSelectedDetail,
    refetch: fetchAudits,
  };
}
