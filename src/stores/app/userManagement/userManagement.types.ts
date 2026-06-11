import type { CreateUserPayload } from "../../../types/api.contracts";

export interface UserManagementState {
  loading: boolean;
  error: string | null;

  createUser: (payload: CreateUserPayload) => Promise<{ id: string; message: string }>;
  resetState: () => void;
}
