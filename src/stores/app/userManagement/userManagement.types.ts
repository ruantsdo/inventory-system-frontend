import type { CreateUserPayload } from "../../../types/api.contracts";
import type { UserData } from "../../../types/user";

export interface UserManagementState {
  loading: boolean;
  error: string | null;

  createUser: (payload: CreateUserPayload) => Promise<{ id: string; message: string }>;
  getUserDataByID: (targetId: string) => Promise<UserData>;
  getUserDataByCpf: (targetCpf: string) => Promise<UserData>;
  getUserDataByEmail: (targetEmail: string) => Promise<UserData>;
  getSelfData: () => Promise<UserData>;
  resetState: () => void;
}
