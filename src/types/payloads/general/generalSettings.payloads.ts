export interface GeneralSettingsPayload {
  tacAssignmentType: "random" | "counterwise"; 
  inquiryNumberFormat: string;
  appointmentNumberFormat: string;
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
  inquiryBrochures?: {
    name: string;
    uploadId?: string;
    fileData?: string; 
    path?: string;     
  }[];
}