import { type ForgotPasswordRequest, forgotPasswordSchema } from "./auth/forgotPassword";
import { type LoginRequest, loginSchema } from "./auth/login";
import { type ResetPasswordRequest, resetPasswordSchema } from "./auth/resetPassword";

export {
  forgotPasswordSchema,
  resetPasswordSchema,
  loginSchema,
  type LoginRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
};
