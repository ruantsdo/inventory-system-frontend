import type { AuditOutput, DetailAuditOutput } from "../../../types/api.contracts";

export type AuditFilterType = "none" | "action" | "category" | "severity";

export interface AuditsState {
  audits: AuditOutput[];
  page: number;
  pageSize: number;
  filterType: AuditFilterType;
  filterValue: string;
  selectedDetail: DetailAuditOutput | null;
  loading: boolean;
  loadingDetail: boolean;
  error: string | null;

  fetchAudits: () => Promise<void>;
  setPage: (page: number) => void;
  setFilter: (type: AuditFilterType, value: string) => void;
  clearFilters: () => void;
  fetchAuditDetail: (id: string) => Promise<void>;
  clearSelectedDetail: () => void;
}
