import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types/api/baseResponse";
import type { SectionPayload } from "../../types/payloads/assessment/section/assessmentSection.payloads";
import type {
  AssessmentSection,
  SectionListResponse,
} from "../../types/responses/assessment/section/assessmentSection.responses";

export const getSectionsApi: (
  params?: Record<string, string | boolean>,
) => Promise<ApiResponse<SectionListResponse | AssessmentSection[]>> =
  catchAsync(
    async (
      params?: Record<string, string | boolean>,
    ): Promise<
      AxiosResponse<ApiResponse<SectionListResponse | AssessmentSection[]>>
    > => {
      const res = await httpsCall.get("admin/assessment/sections/list", {
        params,
      });
      return res;
    },
  );

export const createSectionApi: (
  data: SectionPayload,
) => Promise<ApiResponse<AssessmentSection>> = catchAsync(
  async (
    data: SectionPayload,
  ): Promise<AxiosResponse<ApiResponse<AssessmentSection>>> => {
    const res = await httpsCall.post("admin/assessment/sections/create", data);
    return res;
  },
);

export const deleteSectionApi: (id: string) => Promise<ApiResponse<any>> =
  catchAsync(async (id: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.delete(
      `admin/assessment/sections/delete?id=${id}`,
    );
    return res;
  });

export const getSectionDetailApi: (
  id: string,
) => Promise<ApiResponse<AssessmentSection>> = catchAsync(
  async (
    id: string,
  ): Promise<AxiosResponse<ApiResponse<AssessmentSection>>> => {
    const res = await httpsCall.get(
      `admin/assessment/sections/detail?id=${id}`,
    );
    return res;
  },
);

export const updateSectionApi: (
  id: string,
  data: SectionPayload,
) => Promise<ApiResponse<AssessmentSection>> = catchAsync(
  async (
    id: string,
    data: SectionPayload,
  ): Promise<AxiosResponse<ApiResponse<AssessmentSection>>> => {
    const res = await httpsCall.put(
      `admin/assessment/sections/update?id=${id}`,
      data,
    );
    return res;
  },
);
