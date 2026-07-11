import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types/api/baseResponse";
import type { AssignmentPayload } from "../../types/payloads/assignment/assignment.payloads";
import type { AssignmentResponseData } from "../../types/responses/assignment/assignment.responses";
import type { PaginatedData } from "../../types/responses/pagingData/common.responses";

export const getAssignmentsApi: (
  params?: Record<string, string>,
) => Promise<ApiResponse<PaginatedData<AssignmentResponseData>>> = catchAsync(
  async (
    params?: Record<string, string>,
  ): Promise<
    AxiosResponse<ApiResponse<PaginatedData<AssignmentResponseData>>>
  > => {
    const res = await httpsCall.get("/admin/employee-assignment/get-list", {
      params,
    });
    return res;
  },
);

export const getAssignmentByIdApi: (
  id: string,
) => Promise<ApiResponse<AssignmentResponseData>> = catchAsync(
  async (
    id: string,
  ): Promise<AxiosResponse<ApiResponse<AssignmentResponseData>>> => {
    const res = await httpsCall.get(`/admin/employee-assignment/view?id=${id}`);
    return res;
  },
);

export const createAssignmentApi: (
  data: AssignmentPayload,
) => Promise<ApiResponse<AssignmentResponseData>> = catchAsync(
  async (
    data: AssignmentPayload,
  ): Promise<AxiosResponse<ApiResponse<AssignmentResponseData>>> => {
    const res = await httpsCall.post("/admin/employee-assignment/create", data);
    return res;
  },
);

export const updateAssignmentApi: (
  id: string,
  data: Partial<AssignmentPayload>,
) => Promise<ApiResponse<AssignmentResponseData>> = catchAsync(
  async (
    id: string,
    data: Partial<AssignmentPayload>,
  ): Promise<AxiosResponse<ApiResponse<AssignmentResponseData>>> => {
    const res = await httpsCall.patch("/admin/employee-assignment/update", {
      id,
      ...data,
    });
    return res;
  },
);

export const deleteAssignmentApi: (id: string) => Promise<ApiResponse<any>> =
  catchAsync(async (id: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.delete(
      `/admin/employee-assignment/delete?id=${id}`,
    );
    return res;
  });
