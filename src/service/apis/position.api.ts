import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types/api/baseResponse";
import type { PositionPayload } from "../../types/payloads/position/position.payloads";
import type { PositionResponseData } from "../../types/responses/position/position.responses";
import type { PaginatedData } from "../../types/responses/pagingData/common.responses";

export const getPositionsApi: (
  params?: Record<string, string>,
) => Promise<ApiResponse<PaginatedData<PositionResponseData>>> = catchAsync(
  async (
    params?: Record<string, string>,
  ): Promise<
    AxiosResponse<ApiResponse<PaginatedData<PositionResponseData>>>
  > => {
    const res = await httpsCall.get("/admin/position/get-list", { params });
    return res;
  },
);

export const getPositionByIdApi: (
  id: string,
) => Promise<ApiResponse<PositionResponseData>> = catchAsync(
  async (
    id: string,
  ): Promise<AxiosResponse<ApiResponse<PositionResponseData>>> => {
    const res = await httpsCall.get(`/admin/position/view?id=${id}`);
    return res;
  },
);

export const createPositionApi: (
  data: PositionPayload,
  brochure?: File | null,
) => Promise<ApiResponse<PositionResponseData>> = catchAsync(
  async (
    data: PositionPayload,
    brochure?: File | null,
  ): Promise<AxiosResponse<ApiResponse<PositionResponseData>>> => {
    if (brochure) {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (Array.isArray(v)) v.forEach((item) => form.append(k, item));
        else if (v !== undefined && v !== "") form.append(k, String(v));
      });
      form.append("positionBrochure", brochure);
      const res = await httpsCall.post("/admin/position/create", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res;
    }
    const res = await httpsCall.post("/admin/position/create", data);
    return res;
  },
);

export const updatePositionApi: (
  id: string,
  data: Partial<PositionPayload>,
  brochure?: File | null,
) => Promise<ApiResponse<PositionResponseData>> = catchAsync(
  async (
    id: string,
    data: Partial<PositionPayload>,
    brochure?: File | null,
  ): Promise<AxiosResponse<ApiResponse<PositionResponseData>>> => {
    if (brochure) {
      const form = new FormData();
      form.append("id", id);
      Object.entries(data).forEach(([k, v]) => {
        if (Array.isArray(v)) v.forEach((item) => form.append(k, item));
        else if (v !== undefined && v !== "") form.append(k, String(v));
      });
      form.append("positionBrochure", brochure);
      const res = await httpsCall.patch("/admin/position/update", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res;
    }
    const res = await httpsCall.patch("/admin/position/update", {
      id,
      ...data,
    });
    return res;
  },
);

export const deletePositionApi: (id: string) => Promise<ApiResponse<any>> =
  catchAsync(async (id: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.delete(`/admin/position/delete?id=${id}`);
    return res;
  });
