import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types/api/baseResponse";
import type { PathwayPayload } from "../../types/payloads/pathways/pathway.types";
import type { PathwayResponseData } from "../../types/responses/pathways/pathways.response";
import type { CountryResponseData } from "../../types/responses/position/position.responses";

export const getPathwaysApi: (
  params?: Record<string, string>
) => Promise<ApiResponse<PathwayResponseData[]>> = catchAsync(
  async (params?: Record<string, string>): Promise<AxiosResponse<ApiResponse<PathwayResponseData[]>>> => {
    const res = await httpsCall.get("admin/pathways", { params });
    return res;
  }
);

export const getPathwayByIdApi: (
  id: string
) => Promise<ApiResponse<PathwayResponseData>> = catchAsync(
  async (id: string): Promise<AxiosResponse<ApiResponse<PathwayResponseData>>> => {
    const res = await httpsCall.get(`admin/pathways/${id}`);
    return res;
  }
);

export const createPathwayApi: (
  data: PathwayPayload
) => Promise<ApiResponse<PathwayResponseData>> = catchAsync(
  async (data: PathwayPayload): Promise<AxiosResponse<ApiResponse<PathwayResponseData>>> => {
    const res = await httpsCall.post("admin/pathways", data);
    return res;
  }
);

export const updatePathwayApi: (
  id: string,
  data: Partial<PathwayPayload>
) => Promise<ApiResponse<PathwayResponseData>> = catchAsync(
  async (id: string, data: Partial<PathwayPayload>): Promise<AxiosResponse<ApiResponse<PathwayResponseData>>> => {
    const res = await httpsCall.put(`admin/pathways/${id}`, data);
    return res;
  }
);

export const deletePathwayApi: (
  id: string
) => Promise<ApiResponse<any>> = catchAsync(
  async (id: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.delete(`admin/pathways/${id}`);
    return res;
  }
);

export const getCountriesAction = async (): Promise<AxiosResponse<ApiResponse<CountryResponseData[]>>> => {
  const res = await httpsCall.get(`/countries`);
  return res;
};
