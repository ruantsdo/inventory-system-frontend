import type { AuditOutput, DetailAuditOutput } from "../../types/api.contracts";
import { apiClient } from "../api.client";

export interface GetAuditsParams {
  page?: number;
  action?: string;
  category?: string;
  severity?: string;
}

export async function getAudits(params?: GetAuditsParams | number): Promise<AuditOutput[]> {
  const query = typeof params === "number" ? { page: params } : (params ?? { page: 1 });
  const { data } = await apiClient.get("/api/audits", { params: query });
  return data.auditEvents as AuditOutput[];
}

export async function getAuditsByAction(page: number, action: string): Promise<AuditOutput[]> {
  return getAudits({ page, action });
}

export async function getAuditsByCategory(page: number, category: string): Promise<AuditOutput[]> {
  return getAudits({ page, category });
}

export async function getAuditsBySeverity(page: number, severity: string): Promise<AuditOutput[]> {
  return getAudits({ page, severity });
}

export async function getAuditDetail(id: string): Promise<DetailAuditOutput> {
  const { data } = await apiClient.get("/api/audits/detail", {
    params: { id },
  });
  return data.auditEvent as DetailAuditOutput;
}
