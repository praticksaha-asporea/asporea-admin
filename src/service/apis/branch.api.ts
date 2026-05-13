import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";

export type BranchPayload = {
  title: string;
  location: string;
  counters: number;
  timeZone: string;
  workDays: string[];
};

export const getBranchesApi = catchAsync(async (params?: Record<string, string>) => {
  const res = await httpsCall.get("/admin/branch/get-list", { params });
  return res;
});

export const getBranchByIdApi = catchAsync(async (id: string) => {
  const res = await httpsCall.get(`/admin/branch/view?id=${id}`);
  return res;
});

export const createBranchApi = catchAsync(async (data: BranchPayload) => {
  const res = await httpsCall.post("/admin/branch/create", data);
  return res;
});

export const updateBranchApi = catchAsync(async (id: string, data: Partial<BranchPayload>) => {
  const res = await httpsCall.put(`/admin/branch/update`, {id,...data});
  return res;
});

export const deleteBranchApi = catchAsync(async (id: string) => {
  const res = await httpsCall.delete(`/admin/branch/${id}`);
  return res;
});
