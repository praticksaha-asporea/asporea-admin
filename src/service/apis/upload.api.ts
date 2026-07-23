import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types/api/baseResponse";
import type { UploadListParams } from "../../types/payloads/upload/upload.payloads";
import type { UploadResponseData } from "../../types/responses/upload/upload.responses";
import type { PaginatedData } from "../../types/responses/pagingData/common.responses";

export const getUploadsListApi: (
  params?: UploadListParams,
) => Promise<ApiResponse<PaginatedData<UploadResponseData>>> = catchAsync(
  async (
    params?: UploadListParams,
  ): Promise<AxiosResponse<ApiResponse<PaginatedData<UploadResponseData>>>> => {
    const res = await httpsCall.get("/admin/uploads", { params });
    return res; 
  },
);

export const deleteUploadApi: (id: string) => Promise<ApiResponse<any>> =
  catchAsync(async (id: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.delete("/admin/uploads", { params: { id } });
    return res;
  });