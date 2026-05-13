import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";

export type ScheduleObj = {
  days: string[];
  startTime: string;
  endTime: string;
  breakTime: string;
};

export type ShiftPayload = {
  shiftName: string;
  schedules: ScheduleObj[];
};

export const getShiftsApi = catchAsync(async (params?: Record<string, string>) => {
  const res = await httpsCall.get("/admin/shift/get-list", { params });
  return res;
});

export const getShiftByIdApi = catchAsync(async (id: string) => {
  const res = await httpsCall.get(`/admin/shift/view?id=${id}`);
  return res;
});

export const createShiftApi = catchAsync(async (data: ShiftPayload) => {
  const res = await httpsCall.post("/admin/shift/create", data);
  return res;
});

export const updateShiftApi = catchAsync(async (id: string, data: Partial<ShiftPayload>) => {
  const res = await httpsCall.put(`/admin/shift/update`, {id,...data});
  return res;
});

export const deleteShiftApi = catchAsync(async (id: string) => {
  const res = await httpsCall.delete(`/admin/shift/${id}`);
  return res;
});
