export const usersAuditActions = {
  USER_ACCOUNT_CREATED: "Conta de usuário criada",
  USER_ACCOUNT_UPDATED: "Conta de usuário atualizada",
  USER_ACCOUNT_UPDATED_WITH_PERMISSIONS: "Conta de usuário e permissões atualizadas",
  USER_ACCOUNT_DELETED: "Conta de usuário excluída",
  USER_ACCOUNT_ACTIVATED: "Conta de usuário ativada",
  USER_ACCOUNT_DEACTIVATED: "Conta de usuário desativada",

  USER_PROFESSIONAL_DOC_ADDED: "Documento profissional adicionado",
  USER_PROFESSIONAL_DOC_REVOKED: "Documento profissional revogado",

  ROLE_CREATED: "Cargo criado",
  ROLE_UPDATED: "Cargo atualizado",
  ROLE_DELETED: "Cargo excluído",
  ROLE_PERMISSIONS_CHANGED: "Permissões do cargo alteradas",

  USER_ROLE_ASSIGNED: "Cargo atribuído ao usuário",
  USER_ROLE_REMOVED: "Cargo removido do usuário",
  USER_PERMISSION_OVERRIDE: "Sobreposição de permissão do usuário",

  STOCK_RECEIPT_REGISTERED: "Recebimento de estoque registrado",
  STOCK_CONSUMPTION_RECORDED: "Consumo de estoque registrado",
  STOCK_TRANSFER_COMPLETED: "Transferência de estoque concluída",
  STOCK_MANUAL_ADJUSTMENT: "Ajuste manual de estoque",
  STOCK_RESERVATION_PLACED: "Reserva de estoque realizada",
  STOCK_RESERVATION_RELEASED: "Reserva de estoque liberada",

  STOCK_BATCH_QUARANTINED: "Lote em quarentena",
  STOCK_BATCH_RELEASED: "Lote liberado",
  STOCK_BATCH_EXPIRED: "Lote vencido",

  ITEM_REQUEST_SUBMITTED: "Solicitação de item enviada",
  ITEM_REQUEST_APPROVED: "Solicitação de item aprovada",
  ITEM_REQUEST_REJECTED: "Solicitação de item rejeitada",
  ITEM_REQUEST_FULFILLED: "Solicitação de item atendida",
  ITEM_REQUEST_CANCELLED: "Solicitação de item cancelada",

  FACILITY_CONFIG_UPDATED: "Configuração da unidade atualizada",
  LOCATION_CONFIG_UPDATED: "Configuração do local atualizada",
  INVENTORY_LIMITS_CHANGED: "Limites de estoque alterados",
  SYSTEM_SETTINGS_CHANGED: "Configurações do sistema alteradas",
  BULK_DATA_IMPORTED: "Dados em lote importados",
  BULK_DATA_EXPORTED: "Dados em lote exportados",

  GOVERNANCE_ACCESS_DENIED: "Acesso negado pela governança",
  ROOT_SHIELDING_TRIGGERED: "Usuário ROOT protegido",
  FACILITY_SCOPE_VIOLATION: "Violação de escopo de unidade",
  INSUFFICIENT_GOVERNANCE_LEVEL: "Nível de governança insuficiente",
  PROTECTED_ROLE_VIOLATION: "Violação de cargo protegido",

  USER_SENSITIVE_DATA_VIEWED: "Dados sensíveis do usuário visualizados",
  PROFESSIONAL_DOC_EXPOSED: "Documento profissional exposto",
  FINANCIAL_COST_EXPOSED: "Custo financeiro exposto",

  MANUFACTURER_CREATED: "Fabricante criado",
  MANUFACTURER_UPDATED: "Fabricante atualizado",
  MANUFACTURER_DELETED: "Fabricante excluído",

  SUPPLIER_CREATED: "Fornecedor criado",
  SUPPLIER_UPDATED: "Fornecedor atualizado",
  SUPPLIER_DELETED: "Fornecedor excluído",

  ITEM_TYPE_CREATED: "Tipo de item criado",
  ITEM_TYPE_UPDATED: "Tipo de item atualizado",
  ITEM_TYPE_DELETED: "Tipo de item excluído",

  ITEM_CREATED: "Item criado",
  ITEM_UPDATED: "Item atualizado",
  ITEM_DELETED: "Item excluído",

  BATCH_CREATED: "Lote criado",
  BATCH_UPDATED: "Lote atualizado",
  BATCH_DELETED: "Lote excluído",
} as const;

export type AuditActionType = (typeof usersAuditActions)[keyof typeof usersAuditActions];

export const auditActionOptions = Object.entries(usersAuditActions)
  .map(([value, label]) => ({ value, label }))
  .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
