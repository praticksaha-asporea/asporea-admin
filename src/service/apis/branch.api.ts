import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types/api/baseResponse";
import type { BranchPayload } from "../../types/payloads/branch/branch.payloads";
import type { BranchResponseData } from "../../types/responses/branch/branch.responses";
import type { PaginatedData } from "../../types/responses/pagingData/common.responses";

export const getBranchesApi: (
  params?: Record<string, string>,
) => Promise<ApiResponse<PaginatedData<BranchResponseData>>> = catchAsync(
  async (
    params?: Record<string, string>,
  ): Promise<AxiosResponse<ApiResponse<PaginatedData<BranchResponseData>>>> => {
    const res = await httpsCall.get("/admin/branch/get-list", { params });
    return res;
  },
);

export const getBranchByIdApi: (
  id: string,
) => Promise<ApiResponse<BranchResponseData>> = catchAsync(
  async (
    id: string,
  ): Promise<AxiosResponse<ApiResponse<BranchResponseData>>> => {
    const res = await httpsCall.get(`/admin/branch/view?id=${id}`);
    return res;
  },
);

export const createBranchApi: (
  data: BranchPayload,
) => Promise<ApiResponse<BranchResponseData>> = catchAsync(
  async (
    data: BranchPayload,
  ): Promise<AxiosResponse<ApiResponse<BranchResponseData>>> => {
    const res = await httpsCall.post("/admin/branch/create", data);
    return res;
  },
);

export const updateBranchApi: (
  id: string,
  data: Partial<BranchPayload>,
) => Promise<ApiResponse<BranchResponseData>> = catchAsync(
  async (
    id: string,
    data: Partial<BranchPayload>,
  ): Promise<AxiosResponse<ApiResponse<BranchResponseData>>> => {
    const res = await httpsCall.put(`/admin/branch/update`, { id, ...data });
    return res;
  },
);

export const deleteBranchApi: (id: string) => Promise<ApiResponse<any>> =
  catchAsync(async (id: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.delete(`/admin/branch/${id}`);
    return res;
  });
