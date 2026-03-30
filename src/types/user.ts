import type { ID } from "./permissions";

export interface AuthUser {
  id: ID;
  fullName: string;
  city?: {
    id: ID;
    name: string;
  } | null;
}
