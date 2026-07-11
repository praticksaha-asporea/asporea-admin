import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types/api/baseResponse";
import type { ShiftPayload } from "../../types/payloads/shift/shift.payloads";
import type { ShiftResponseData } from "../../types/responses/shift/shift.responses";
import type { PaginatedData } from "../../types/responses/pagingData/common.responses";

export const getShiftsApi: (
  params?: Record<string, string>,
) => Promise<ApiResponse<PaginatedData<ShiftResponseData>>> = catchAsync(
  async (
    params?: Record<string, string>,
  ): Promise<AxiosResponse<ApiResponse<PaginatedData<ShiftResponseData>>>> => {
    const res = await httpsCall.get("/admin/shift/get-list", { params });
    return res;
  },
);

export const getShiftByIdApi: (
  id: string,
) => Promise<ApiResponse<ShiftResponseData>> = catchAsync(
  async (
    id: string,
  ): Promise<AxiosResponse<ApiResponse<ShiftResponseData>>> => {
    const res = await httpsCall.get(`/admin/shift/view?id=${id}`);
    return res;
  },
);

export const createShiftApi: (
  data: ShiftPayload,
) => Promise<ApiResponse<ShiftResponseData>> = catchAsync(
  async (
    data: ShiftPayload,
  ): Promise<AxiosResponse<ApiResponse<ShiftResponseData>>> => {
    const res = await httpsCall.post("/admin/shift/create", data);
    return res;
  },
);

export const updateShiftApi: (
  id: string,
  data: Partial<ShiftPayload>,
) => Promise<ApiResponse<ShiftResponseData>> = catchAsync(
  async (
    id: string,
    data: Partial<ShiftPayload>,
  ): Promise<AxiosResponse<ApiResponse<ShiftResponseData>>> => {
    const res = await httpsCall.put(`/admin/shift/update`, { id, ...data });
    return res;
  },
);

export const deleteShiftApi: (id: string) => Promise<ApiResponse<any>> =
  catchAsync(async (id: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.delete(`/admin/shift/delete?id=${id}`);
    return res;
  });
