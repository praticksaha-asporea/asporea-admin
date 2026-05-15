import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";

export type AssignmentPayload = {
  employeeId: string;
  branchId: string;
  shiftId: string;
  effectiveFrom: string;
  minuteOfSlots: number;
  counterNo: number;
  role: string;
};

export const getAssignmentsApi = catchAsync(async (params?: Record<string, string>) => {
  const res = await httpsCall.get("/admin/employee-assignment/get-list", { params });
  return res;
});

export const getAssignmentByIdApi = catchAsync(async (id: string) => {
  const res = await httpsCall.get(`/admin/employee-assignment/view?id=${id}`);
  return res;
});

export const createAssignmentApi = catchAsync(async (data: AssignmentPayload) => {
  const res = await httpsCall.post("/admin/employee-assignment/create", data);
  return res;
});

export const updateAssignmentApi = catchAsync(async (id: string, data: Partial<AssignmentPayload>) => {
  const res = await httpsCall.patch("/admin/employee-assignment/update", { id, ...data });
  return res;
});

export const deleteAssignmentApi = catchAsync(async (id: string) => {
  const res = await httpsCall.delete(`/admin/employee-assignment/delete?id=${id}`);
  return res;
});
