import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";

export type SectionPayload = {
  section: string;
  shortName: string;
  underSection: string;
  maxScore?: number;
};

export const getSectionsApi = catchAsync(
  async (params?: Record<string, string>) => {
    const res = await httpsCall.get("admin/assessment/sections/list", {
      params,
    });
    return res;
  },
);

export const createSectionApi = catchAsync(async (data: SectionPayload) => {
  const res = await httpsCall.post("admin/assessment/sections/create", data);
  return res;
});

export const deleteSectionApi = catchAsync(async (id: string) => {
  const res = await httpsCall.delete(`admin/assessment/sections/delete?id=${id}`);
  return res;
});

 
export const getSectionDetailApi = catchAsync(async (id: string) => {
  const res = await httpsCall.get(`admin/assessment/sections/detail?id=${id}`);
  return res;
});

 
export const updateSectionApi = catchAsync(async (id: string, data: SectionPayload) => {
  const res = await httpsCall.put(`admin/assessment/sections/update?id=${id}`, data);
  return res;
});