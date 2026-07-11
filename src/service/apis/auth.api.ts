import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types/api/baseResponse";
import type { LoginPayload, ChangePasswordPayload } from "../../types/payloads/auth/auth.payloads";
import type { LoginResponseData, ChangePasswordResponseData } from "../../types/responses/auth/auth.responses";
export const loginApi: (data: LoginPayload) => Promise<ApiResponse<LoginResponseData>> = catchAsync(
  async (data: LoginPayload): Promise<AxiosResponse<ApiResponse<LoginResponseData>>> => {
    const res = await httpsCall.post(`/admin/auth/login`, data);
    return res;
  }
);

export const changePasswordApi: (data: ChangePasswordPayload) => Promise<ApiResponse<ChangePasswordResponseData>> = catchAsync(
  async (data: ChangePasswordPayload): Promise<AxiosResponse<ApiResponse<ChangePasswordResponseData>>> => {
    const res = await httpsCall.post(`/admin/auth/change-password`, data);
    return res;
  }
);