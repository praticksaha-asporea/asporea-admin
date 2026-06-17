import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";

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

export const getQuestionsApi = catchAsync(async (params?: Record<string, string>) => {
  const res = await httpsCall.get("/assessment/questions/list", { params });
  return res;
});

export const getQuestionByIdApi = catchAsync(async (id: string) => {
  const res = await httpsCall.get(`/assessment/questions/view?id=${id}`);
  return res;
});

export const createQuestionApi = catchAsync(async (data: QuestionPayload) => {
   
  const res = await httpsCall.post("/assessment/questions/create", data);
  return res;
});

export const updateQuestionApi = catchAsync(async (id: string, data: Partial<QuestionPayload>) => {
  const res = await httpsCall.put(`/assessment/questions/update?id=${id}`, data);
  return res;
});

export const deleteQuestionApi = catchAsync(async (id: string) => {
  const res = await httpsCall.delete(`/assessment/questions/delete?id=${id}`);
  return res;
});


export const restoreQuestionApi = catchAsync(async (id: string) => {
  const res = await httpsCall.put(`/assessment/questions/restore?id=${id}`);
  return res;
});