export type QuestionPayload = {
  title: string;
  shortName?: string;
  marks: number;
  section: string;
  subSection?: string;
  type: string;
  levels: string[];
  order: number;
};