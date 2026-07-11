export interface GeneralSettingsPayload {
  tacAssignmentType: "random" | "counterwise"; 
  inquiryNumberFormat: string;
  escalationTimelineHours?: number | "";
  inqResTimelineHours?: number | "";
  preCounsellingTimelineHours?: number | "";
  assessmentTimelineHours?: number | "";
  assessment?: {
    fullMarks?: number | "";
    passingMarks?: number | "";
  };
  technical?: {
    fullMarks?: number | "";
    passingMarks?: number | "";
  };
}