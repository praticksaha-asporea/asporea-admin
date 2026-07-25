import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types/api/baseResponse";
import httpsCall from "../httpCall";
import type { DashboardData } from "../../types/responses/dashboard/get-lists.responses";

export const getDashboardItemsApi = async (): Promise<AxiosResponse<ApiResponse<DashboardData>>> => {
    const res = await httpsCall.get(`admin/dashboard/get-items`);
    return res.data;
}
