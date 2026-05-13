import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";


type LoginData = {
  email: string;
  password: string;
};

type ChangePasswordData = {
  userId: string,
  oldPassword: string,
  newPassword:string,
  confirmPassword: string
};
export const loginApi = catchAsync(async (data:LoginData) => {
  const res = await httpsCall.post(`/admin/auth/login`, data);
  return res;
});

export const changePasswordApi = catchAsync(async (data:ChangePasswordData) => {
  const res = await httpsCall.post(`/admin/auth/change-password`, data);
  return res;
});