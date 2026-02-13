import {
	type ForgotPasswordRequest,
	forgotPasswordSchema,
} from "./auth/forgotPassword";
import { type LoginRequest, loginSchema } from "./auth/login";
import {
	type RedefinePasswordRequest,
	redefinePasswordSchema,
} from "./auth/redefinePassword";

export {
	forgotPasswordSchema,
	redefinePasswordSchema,
	loginSchema,
	type LoginRequest,
	type ForgotPasswordRequest,
	type RedefinePasswordRequest,
};
