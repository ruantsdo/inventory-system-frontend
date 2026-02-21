import type { UserRole } from "./";

export interface AuthUser {
  uuid: string;
  name: string;
  email: string;
  role: UserRole;
}
