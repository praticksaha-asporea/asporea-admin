import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";

export type UserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  password?: string;
};

export const getUsersApi = catchAsync(async (params?: Record<string, string>) => {
  const res = await httpsCall.get("/admin/user/get-list", { params });
  return res;
});

export const createUserApi = catchAsync(async (data: UserPayload) => {
  const res = await httpsCall.post("/users", data);
  return res;
});

export const updateUserApi = catchAsync(async (id: number | string, data: Partial<UserPayload>) => {
  const res = await httpsCall.put(`/users/${id}`, data);
  return res;
});

export const deleteUserApi = catchAsync(async (id: number | string) => {
  const res = await httpsCall.delete(`/users/${id}`);
  return res;
});
