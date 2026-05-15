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

export const getUserByIdApi = catchAsync(async (id: string) => {
  const res = await httpsCall.get(`/user/details?id=${id}`);
  return res;
});

export const updateProfileApi = catchAsync(async (data: Partial<ProfilePayload>) => {
  const res = await httpsCall.patch("/user/profile-update", data);
  return res;
});

export type ProfilePayload = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  whatsappNumber: string;
  address: string;
  passportStatus: string;
  passportNo: string;
  enquired: string;
  notificationPreference: {
    sms: boolean;
    whatsapp: boolean;
    email: boolean;
  };
  id:string;
};

export const createUserApi = catchAsync(async (data: UserPayload) => {
  const res = await httpsCall.post("/admin/user/create", data);
  return res;
});

export const updateUserApi = catchAsync(async (id: number | string, data: Partial<UserPayload>) => {
  const res = await httpsCall.patch(`/admin/user/update`, {id,...data});
  return res;
});

export const deleteUserApi = catchAsync(async (id: number | string) => {
  const res = await httpsCall.delete(`/users/${id}`);
  return res;
});
