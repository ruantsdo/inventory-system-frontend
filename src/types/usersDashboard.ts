export interface UserRoleEntry {
  role: {
    displayName: string;
    name: string;
  };
}

export interface UserListItem {
  id: string;
  fullName: string;
  email: string;
  cpf: string;
  isActive: boolean;
  roles: UserRoleEntry[];
}

export interface GetUsersParams {
  search?: string;
  page?: number;
  pageSize?: number;
  isActive?: boolean;
}

export type UserStatusFilter = "all" | "active" | "inactive";
