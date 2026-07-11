import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types/api/baseResponse";
import type {
  UserPayload,
  ProfilePayload,
} from "../../types/payloads/user/user.payloads";
import type { UserResponseData } from "../../types/responses/user/user.responses";
import type { PaginatedData } from "../../types/responses/pagingData/common.responses";

export const getUsersApi: (
  params?: Record<string, string>,
) => Promise<ApiResponse<PaginatedData<UserResponseData>>> = catchAsync(
  async (
    params?: Record<string, string>,
  ): Promise<AxiosResponse<ApiResponse<PaginatedData<UserResponseData>>>> => {
    const res = await httpsCall.get("/admin/user/get-list", { params });
    return res;
  },
);

export const getUsersByRoleApi: (
  role: string,
) => Promise<ApiResponse<PaginatedData<UserResponseData>>> = catchAsync(
  async (
    role: string,
  ): Promise<AxiosResponse<ApiResponse<PaginatedData<UserResponseData>>>> => {
    const res = await httpsCall.get("/admin/user/get-list", {
      params: { role, limit: "100", page: "1" },
    });
    return res;
  },
);

export const getUniqueRolesApi: () => Promise<ApiResponse<string[]>> =
  catchAsync(async (): Promise<AxiosResponse<ApiResponse<string[]>>> => {
    const res = await httpsCall.get("/admin/user/get-roles");
    return res;
  });

export const getUserByIdApi: (id: string) => Promise<ApiResponse<any>> =
  catchAsync(async (id: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.get(`/user/details?id=${id}`);
    return res;
  });

export const updateProfileApi: (
  data: ProfilePayload,
) => Promise<ApiResponse<any>> = catchAsync(
  async (
    data: ProfilePayload,
  ): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.patch("/user/profile-update", data);
    return res;
  },
);

export const createUserApi: (
  data: UserPayload,
) => Promise<ApiResponse<UserResponseData>> = catchAsync(
  async (
    data: UserPayload,
  ): Promise<AxiosResponse<ApiResponse<UserResponseData>>> => {
    const res = await httpsCall.post("/admin/user/create", data);
    return res;
  },
);

export const updateUserApi: (
  id: number | string,
  data: Partial<UserPayload>,
) => Promise<ApiResponse<UserResponseData>> = catchAsync(
  async (
    id: number | string,
    data: Partial<UserPayload>,
  ): Promise<AxiosResponse<ApiResponse<UserResponseData>>> => {
    const res = await httpsCall.patch(`/admin/user/update`, { id, ...data });
    return res;
  },
);

export const deleteUserApi: (id: number | string) => Promise<ApiResponse<any>> =
  catchAsync(
    async (id: number | string): Promise<AxiosResponse<ApiResponse<any>>> => {
      const res = await httpsCall.delete(`/users/${id}`);
      return res;
    },
  );
