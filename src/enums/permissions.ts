export type PermissionScopeMode = "GLOBAL" | "FACILITY" | "OWN";

export type UserRoleScopeMode = "GLOBAL" | "FACILITY_SET";

export const permissionKeys = [
  // audit & reports
  "audit.view",
  "audit.export",
  "audit.user_actions",
  "audit.inventory_actions",
  "audit.security_events",
  "reports.run",
  "reports.export",
  "reports.view_all_facilities",

  // batches
  "batches.view",
  "batches.create",
  "batches.update",
  "batches.delete",
  "batches.restore",
  "batches.receive",
  "batches.quarantine",
  "batches.release",
  "batches.expire",
  "batches.adjust",

  // cities
  "cities.view",
  "cities.create",
  "cities.update",
  "cities.delete",
  "cities.restore",

  // controlled
  "controlled.view",
  "controlled.request",
  "controlled.authorize",
  "controlled.authorize_any_facility",
  "controlled.dispatch",
  "controlled.deliver",
  "controlled.receive",
  "controlled.audit",
  "controlled.view_all",

  // facilities
  "facilities.view",
  "facilities.create",
  "facilities.update",
  "facilities.delete",
  "facilities.restore",
  "facilities.activate",
  "facilities.deactivate",

  // inventory
  "inventory.view",
  "inventory.create_movement",
  "inventory.adjust",
  "inventory.transfer",
  "inventory.reserve",
  "inventory.release",
  "inventory.receive",
  "inventory.count",
  "inventory.reconcile",

  // items
  "items.view",
  "items.create",
  "items.update",
  "items.delete",
  "items.restore",
  "items.manage_attributes",
  "items.activate",
  "items.deactivate",

  // item types
  "item_types.view",
  "item_types.create",
  "item_types.update",
  "item_types.delete",
  "item_types.restore",

  // manufacturers
  "manufacturers.view",
  "manufacturers.create",
  "manufacturers.update",
  "manufacturers.delete",
  "manufacturers.restore",

  // purchases
  "purchases.create",
  "purchases.view",
  "purchases.receive",
  "purchases.authorize",
  "purchases.cancel",
  "purchases.close",

  // requests
  "requests.view",
  "requests.create",
  "requests.approve",
  "requests.fulfill",
  "requests.cancel",
  "requests.reject",

  // suppliers
  "suppliers.view",
  "suppliers.create",
  "suppliers.update",
  "suppliers.delete",
  "suppliers.restore",

  // system and integration
  "system.settings",
  "data.import",
  "data.export",
  "system.logs",
  "system.health",
  "system.backup",
  "system.restore",

  // users, roles and permissions
  "users.view",
  "users.create",
  "users.update",
  "users.delete",
  "users.restore",
  "users.activate",
  "users.deactivate",
  "users.manage_scope",
  "users.manage_facilities",
  "users.manage_admin_roles",
  "users.grant_functional_roles",
  "roles.manage",
  "roles.assign",
  "roles.unassign",
  "roles.create",
  "roles.update",
  "roles.delete",
  "roles.restore",
  "permissions.manage",
  "permissions.view",
  "permissions.grant",
  "permissions.revoke",
] as const;

export type PermissionKey = (typeof permissionKeys)[number];

export type AppPermissionKey = PermissionKey;

export const permissionDisplayNames: Record<PermissionKey, string> = {
  // audit & reports
  "audit.view": "Visualizar auditoria",
  "audit.export": "Exportar auditoria",
  "audit.user_actions": "Visualizar ações de usuários",
  "audit.inventory_actions": "Visualizar ações de estoque",
  "audit.security_events": "Visualizar eventos de segurança",
  "reports.run": "Executar relatórios",
  "reports.export": "Exportar relatórios",
  "reports.view_all_facilities": "Visualizar relatórios de todas as unidades",

  // batches
  "batches.view": "Visualizar lotes",
  "batches.create": "Criar lotes",
  "batches.update": "Editar lotes",
  "batches.delete": "Excluir lotes",
  "batches.restore": "Restaurar lotes",
  "batches.receive": "Receber lotes",
  "batches.quarantine": "Quarentenar lotes",
  "batches.release": "Liberar lotes",
  "batches.expire": "Expirar lotes",
  "batches.adjust": "Ajustar lotes",

  // cities
  "cities.view": "Visualizar cidades",
  "cities.create": "Criar cidades",
  "cities.update": "Editar cidades",
  "cities.delete": "Excluir cidades",
  "cities.restore": "Restaurar cidades",

  // controlled
  "controlled.view": "Visualizar controlados",
  "controlled.request": "Solicitar controlados",
  "controlled.authorize": "Autorizar controlados",
  "controlled.authorize_any_facility": "Autorizar controlados em qualquer unidade",
  "controlled.dispatch": "Despachar controlados",
  "controlled.deliver": "Entregar controlados",
  "controlled.receive": "Receber controlados",
  "controlled.audit": "Auditar itens controlados",
  "controlled.view_all": "Visualizar todos os controlados",

  // facilities
  "facilities.view": "Visualizar unidades",
  "facilities.create": "Criar unidades",
  "facilities.update": "Editar unidades",
  "facilities.delete": "Excluir unidades",
  "facilities.restore": "Restaurar unidades",
  "facilities.activate": "Ativar unidades",
  "facilities.deactivate": "Desativar unidades",

  // inventory
  "inventory.view": "Visualizar estoque",
  "inventory.create_movement": "Criar movimentação",
  "inventory.adjust": "Ajustar estoque",
  "inventory.transfer": "Transferir estoque",
  "inventory.reserve": "Reservar estoque",
  "inventory.release": "Liberar reserva",
  "inventory.receive": "Receber estoque",
  "inventory.count": "Contar estoque",
  "inventory.reconcile": "Reconciliar estoque",

  // items
  "items.view": "Visualizar itens",
  "items.create": "Criar itens",
  "items.update": "Editar itens",
  "items.delete": "Excluir itens",
  "items.restore": "Restaurar itens",
  "items.manage_attributes": "Gerenciar atributos de itens",
  "items.activate": "Ativar itens",
  "items.deactivate": "Desativar itens",

  // item types
  "item_types.view": "Visualizar tipos de item",
  "item_types.create": "Criar tipos de item",
  "item_types.update": "Editar tipos de item",
  "item_types.delete": "Excluir tipos de item",
  "item_types.restore": "Restaurar tipos de item",

  // manufacturers
  "manufacturers.view": "Visualizar fabricantes",
  "manufacturers.create": "Criar fabricantes",
  "manufacturers.update": "Editar fabricantes",
  "manufacturers.delete": "Excluir fabricantes",
  "manufacturers.restore": "Restaurar fabricantes",

  // purchases
  "purchases.create": "Criar compras",
  "purchases.view": "Visualizar compras",
  "purchases.receive": "Receber compras",
  "purchases.authorize": "Autorizar compras",
  "purchases.cancel": "Cancelar compras",
  "purchases.close": "Fechar compras",

  // requests
  "requests.view": "Visualizar solicitações",
  "requests.create": "Criar solicitações",
  "requests.approve": "Aprovar solicitações",
  "requests.fulfill": "Atender solicitações",
  "requests.cancel": "Cancelar solicitações",
  "requests.reject": "Rejeitar solicitações",

  // suppliers
  "suppliers.view": "Visualizar fornecedores",
  "suppliers.create": "Criar fornecedores",
  "suppliers.update": "Editar fornecedores",
  "suppliers.delete": "Excluir fornecedores",
  "suppliers.restore": "Restaurar fornecedores",

  // system and integration
  "system.settings": "Configurações do sistema",
  "data.import": "Importar dados",
  "data.export": "Exportar dados",
  "system.logs": "Visualizar logs do sistema",
  "system.health": "Visualizar saúde do sistema",
  "system.backup": "Gerar backup do sistema",
  "system.restore": "Restaurar backup do sistema",

  // users, roles and permissions
  "users.view": "Visualizar usuários",
  "users.create": "Criar usuários",
  "users.update": "Editar usuários",
  "users.delete": "Excluir usuários",
  "users.restore": "Restaurar usuários",
  "users.activate": "Ativar usuários",
  "users.deactivate": "Desativar usuários",
  "users.manage_scope": "Gerenciar escopo de usuários",
  "users.manage_facilities": "Gerenciar unidades dos usuários",
  "users.manage_admin_roles": "Gerenciar cargos administrativos de usuários",
  "users.grant_functional_roles": "Atribuir cargos funcionais",
  "roles.manage": "Gerenciar cargos",
  "roles.assign": "Atribuir cargos",
  "roles.unassign": "Desatribuir cargos",
  "roles.create": "Criar cargos",
  "roles.update": "Editar cargos",
  "roles.delete": "Excluir cargos",
  "roles.restore": "Restaurar cargos",
  "permissions.manage": "Gerenciar permissões",
  "permissions.view": "Visualizar permissões",
  "permissions.grant": "Conceder permissões",
  "permissions.revoke": "Revogar permissões",
};
