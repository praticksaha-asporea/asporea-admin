export type AssessmentQuestion = {
  _id: string;
  title: string;
  shortName?: string;
  marks: number;
  section: string;
  subSection?: string;
  type: string;
  levels: string[];
  order: number;
  isDeleted?: boolean;
};

 
export type QuestionListResponse = {
  data: AssessmentQuestion[];
  total?: number;
  page?: number;
  limit?: number;
};