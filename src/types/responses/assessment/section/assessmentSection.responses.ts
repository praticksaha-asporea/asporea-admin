export type AssessmentSection = {
  _id: string;
  section: string;
  shortName: string;
  underSection: string;
  maxScore?: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type SectionListResponse = {
  data: AssessmentSection[];
};