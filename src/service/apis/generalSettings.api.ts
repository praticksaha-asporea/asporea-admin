import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types/api/baseResponse";
import type { GeneralSettingsPayload } from "../../types/payloads/general/generalSettings.payloads";
import type { GeneralSettingsResponseData } from "../../types/responses/general/generalSettings.responses";

export const getGeneralSettingsApi: () => Promise<
  ApiResponse<GeneralSettingsResponseData>
> = catchAsync(
  async (): Promise<
    AxiosResponse<ApiResponse<GeneralSettingsResponseData>>
  > => {
    const res = await httpsCall.get("/general-settings/view");
    return res;
  },
);

export const updateGeneralSettingsApi: (
  data: GeneralSettingsPayload,
) => Promise<ApiResponse<GeneralSettingsResponseData>> = catchAsync(
  async (
    data: GeneralSettingsPayload,
  ): Promise<AxiosResponse<ApiResponse<GeneralSettingsResponseData>>> => {
    const res = await httpsCall.patch("/general-settings/update", data);
    return res;
  },
);
