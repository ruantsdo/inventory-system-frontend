import type { AuditOutput, DetailAuditOutput } from "../../types/api.contracts";
import { apiClient } from "../api.client";

export async function getAudits(page: number): Promise<AuditOutput[]> {
  const { data } = await apiClient.get("/api/audits", { params: { page } });
  return data.auditEvents as AuditOutput[];
}

export async function getAuditsByAction(page: number, action: string): Promise<AuditOutput[]> {
  const { data } = await apiClient.get("/api/audits/action", {
    params: { page, action },
  });
  return data.auditEvents as AuditOutput[];
}

export async function getAuditsByCategory(page: number, category: string): Promise<AuditOutput[]> {
  const { data } = await apiClient.get("/api/audits/category", {
    params: { page, category },
  });
  return data.auditEvents as AuditOutput[];
}

export async function getAuditsBySeverity(page: number, severity: string): Promise<AuditOutput[]> {
  const { data } = await apiClient.get("/api/audits/severity", {
    params: { page, severity },
  });
  return data.auditEvents as AuditOutput[];
}

export async function getAuditDetail(id: string): Promise<DetailAuditOutput> {
  const { data } = await apiClient.get("/api/audits/detail", {
    params: { id },
  });
  return data.auditEvent as DetailAuditOutput;
}
