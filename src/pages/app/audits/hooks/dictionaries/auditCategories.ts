export const auditCategories = {
  BUSINESS: "Negócio",
  SECURITY: "Segurança",
  GOVERNANCE: "Governança",
  SENSITIVE_ACCESS: "Acesso Sensível",
} as const;

export type AuditCategoryType = (typeof auditCategories)[keyof typeof auditCategories];
