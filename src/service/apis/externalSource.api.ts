import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types/api/baseResponse";
import type {
  ExternalSourcePayload,
  UpdateExternalSourcePayload,
  ToggleStatusPayload,
  ExternalSourceQueryParams,
  ExternalSourceStatus,
} from "../../types/payloads/externalSource/externalSource.payloads";
import type { ExternalSource, ExternalSourceListResponse } from "../../types/responses/externalSource/externalSource.responses";


export const getExternalSourcesApi: (
    params?: ExternalSourceQueryParams,
) => Promise<AxiosResponse<ApiResponse<ExternalSourceListResponse>>> = catchAsync(
    async (
        params?: Record<string, string | number | boolean>,
    ): Promise<AxiosResponse<ApiResponse<ExternalSourceListResponse>>> => {
        const res = await httpsCall.get("admin/external-sources/list", { params });
        return res;
    },
);


export const createExternalSourceApi: (
    data: ExternalSourcePayload,
) => Promise<AxiosResponse<ApiResponse<ExternalSource>>> = catchAsync(
    async (
        data: ExternalSourcePayload,
    ): Promise<AxiosResponse<ApiResponse<ExternalSource>>> => {
        const res = await httpsCall.post("admin/external-sources/create", data);
        return res;
    },
);

export const getExternalSourceByIdApi: (
    id: string
) => Promise<AxiosResponse<ApiResponse<ExternalSource>>> = catchAsync(
    async (
        id: string
    ): Promise<AxiosResponse<ApiResponse<ExternalSource>>> => {
        const res = await httpsCall.get(`admin/external-sources/${id}`);
        return res;
    }
);

export const updateExternalSourceApi: (
    id: string,
    data: UpdateExternalSourcePayload
) => Promise<AxiosResponse<ApiResponse<ExternalSource>>> = catchAsync(
    async (
        id: string,
        data: UpdateExternalSourcePayload
    ): Promise<AxiosResponse<ApiResponse<ExternalSource>>> => {
        const res = await httpsCall.put(`admin/external-sources/${id}`, data);
        return res;
    }
);
export const toggleExternalSourceApi: (
    id: string,
    targetStatus?: ExternalSourceStatus
) => Promise<AxiosResponse<ApiResponse<any>>> = catchAsync(
    async (
        id: string,
        targetStatus?: ExternalSourceStatus
    ): Promise<AxiosResponse<ApiResponse<any>>> => {
        const payload: ToggleStatusPayload = { targetStatus };
        const res = await httpsCall.patch(`admin/external-sources/${id}`, payload);
        return res;
    }
);