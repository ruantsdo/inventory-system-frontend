import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserEditData,
} from "../../../types/api.contracts";
import type { UserData } from "../../../types/user";

export interface UserManagementState {
  loading: boolean;
  error: string | null;

  createUser: (payload: CreateUserPayload) => Promise<{ id: string; message: string }>;
  getUserDataByID: (targetId: string) => Promise<UserData>;
  getUserDataForEdit: (targetId: string) => Promise<UserEditData>;
  updateUser: (id: string, payload: UpdateUserPayload) => Promise<{ message: string }>;
  deleteUser: (targetId: string) => Promise<{ message: string }>;
  reactivateUser: (targetId: string) => Promise<{ message: string }>;
  deactivateUser: (targetId: string) => Promise<{ message: string }>;
  getUserDataByCpf: (targetCpf: string) => Promise<UserData>;
  getUserDataByEmail: (targetEmail: string) => Promise<UserData>;
  getSelfData: () => Promise<UserData>;
  resetState: () => void;
}
