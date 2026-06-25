import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";

export type GeneralSettingsPayload = {
  tacAssignment: "random" | "counterwise";
  inquiryNumberFormat: string;
  escalationTimelineHours?: number;
  inqResTimelineHours?: number;
  preCounsellingTimelineHours?: number;
  assessmentTimelineHours?: number;
  assessment?: {
    fullMarks?: number | "";
    passingMarks?: number | "";
  };
  technical?: {
    fullMarks?: number | "";
    passingMarks?: number | "";
  };
};

export const getGeneralSettingsApi = catchAsync(async () => {
  const res = await httpsCall.get("/general-settings/view");
  return res;
});

export const updateGeneralSettingsApi = catchAsync(
  async (data: GeneralSettingsPayload) => {
    const res = await httpsCall.patch("/general-settings/update", data);
    return res;
  },
);
