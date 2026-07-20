import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types/api/baseResponse";
import type { ExternalSourcePayload } from "../../types/payloads/externalSource/externalSource.payloads";
import type { ExternalSource, ExternalSourceListResponse } from "../../types/responses/externalSource/externalSource.responses";


export const getExternalSourcesApi: (
    params?: Record<string, string | number | boolean>,
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


export const deleteExternalSourceApi: (id: string) => Promise<AxiosResponse<ApiResponse<any>>> = catchAsync(
    async (id: string): Promise<AxiosResponse<ApiResponse<any>>> => {
        const res = await httpsCall.delete(`admin/external-sources/delete?id=${id}`);
        return res;
    }
);