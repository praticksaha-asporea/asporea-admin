export interface LoginPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  userId: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}