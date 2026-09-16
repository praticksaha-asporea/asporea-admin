import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types/api/baseResponse";
import type { PaginatedData } from "../../types/responses/pagingData/common.responses";
import type { CreateAdminReminderPayload } from "../../types/payloads/reminder/reminder.payloads";
import type {
  ReminderTargetResponse,
  CreateAdminReminderResponseData,
  AdminReminderListItem,
  DeleteReminderResponseData,
} from "../../types/responses/reminder/reminder.responses";

export const getAdminReminderTargetsApi: (
  role: string
) => Promise<ApiResponse<ReminderTargetResponse[]>> = catchAsync(
  async (
    role: string
  ): Promise<AxiosResponse<ApiResponse<ReminderTargetResponse[]>>> => {
    const res = await httpsCall.get(`/admin/reminders/users-by-role?role=${role}`);
    return res;
  }
);

export const createAdminReminderApi: (
  data: CreateAdminReminderPayload
) => Promise<ApiResponse<CreateAdminReminderResponseData>> = catchAsync(
  async (
    data: CreateAdminReminderPayload
  ): Promise<AxiosResponse<ApiResponse<CreateAdminReminderResponseData>>> => {
    const res = await httpsCall.post("/admin/reminders/create", data);
    return res;
  }
);

export const getAdminRemindersListApi: (
  params?: Record<string, string>
) => Promise<ApiResponse<PaginatedData<AdminReminderListItem>>> = catchAsync(
  async (
    params?: Record<string, string>
  ): Promise<AxiosResponse<ApiResponse<PaginatedData<AdminReminderListItem>>>> => {
    const res = await httpsCall.get("/admin/reminders/get-list", { params });
    return res;
  }
);

export const getAdminReminderByIdApi: (
  id: string
) => Promise<ApiResponse<AdminReminderListItem>> = catchAsync(
  async (
    id: string
  ): Promise<AxiosResponse<ApiResponse<AdminReminderListItem>>> => {
    const res = await httpsCall.get(`/admin/reminders/get-by-id?id=${id}`);
    return res;
  }
);

export const deleteAdminReminderApi: (
  id: string
) => Promise<ApiResponse<DeleteReminderResponseData>> = catchAsync(
  async (
    id: string
  ): Promise<AxiosResponse<ApiResponse<DeleteReminderResponseData>>> => {
    const res = await httpsCall.delete(`/admin/reminders/delete?id=${id}`);
    return res;
  }
);