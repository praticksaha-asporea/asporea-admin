import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types/api/baseResponse";
import type { QuestionPayload } from "../../types/payloads/assessment/assessment.payload";
import type { AssessmentQuestion, QuestionListResponse } from "../../types/responses/assessment/assessment.responses";

 
export const getQuestionsApi: (params?: Record<string, string | number>) => Promise<ApiResponse<QuestionListResponse | AssessmentQuestion[]>> = catchAsync(
  async (params?: Record<string, string | number>): Promise<AxiosResponse<ApiResponse<QuestionListResponse | AssessmentQuestion[]>>> => {
    const res = await httpsCall.get("admin/assessment/questions/list", { params });  
    return res;
  }
);

 
export const getQuestionByIdApi: (id: string) => Promise<ApiResponse<AssessmentQuestion>> = catchAsync(
  async (id: string): Promise<AxiosResponse<ApiResponse<AssessmentQuestion>>> => {
    const res = await httpsCall.get(`admin/assessment/questions/view?id=${id}`);
    return res;
  }
);

 
export const createQuestionApi: (data: QuestionPayload) => Promise<ApiResponse<AssessmentQuestion>> = catchAsync(
  async (data: QuestionPayload): Promise<AxiosResponse<ApiResponse<AssessmentQuestion>>> => {
    const res = await httpsCall.post("admin/assessment/questions/create", data);
    return res;
  }
);

 
export const updateQuestionApi: (id: string, data: Partial<QuestionPayload>) => Promise<ApiResponse<AssessmentQuestion>> = catchAsync(
  async (id: string, data: Partial<QuestionPayload>): Promise<AxiosResponse<ApiResponse<AssessmentQuestion>>> => {
    const res = await httpsCall.put(`admin/assessment/questions/update?id=${id}`, data);
    return res;
  }
);

 
export const deleteQuestionApi: (id: string) => Promise<ApiResponse<any>> = catchAsync(
  async (id: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.delete(`admin/assessment/questions/delete?id=${id}`);
    return res;
  }
);

 
export const restoreQuestionApi: (id: string) => Promise<ApiResponse<any>> = catchAsync(
  async (id: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.put(`admin/assessment/questions/restore?id=${id}`);
    return res;
  }
);