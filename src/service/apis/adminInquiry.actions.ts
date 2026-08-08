import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types/api/baseResponse";
import type { GetTacCandidatesPayload } from "../../types/payloads/tac/tac.types";
import type { candidateDetailResponse, CandidatesResponse } from "../../types/responses/tac/tac.types";

export const getTacCandidatesAction = async (params: GetTacCandidatesPayload): Promise<AxiosResponse<CandidatesResponse>> => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  if (params.experience) query.set("experience", params.experience);
  if (params.kpis) query.set("kpis", "true");

  const res = await httpsCall.get(`/tac/candidates?${query.toString()}`);
  return res;
};

export const getTacCandidateDetailAction = async (id: string): Promise<AxiosResponse<candidateDetailResponse>> => {
  const res = await httpsCall.get(`/tac/candidate/${id}`);
  return res
  // .data.data as {
  //   lead: ILead;
  //   branchToken: IBranchToken;
  //   assignments: IAssignment[];
  //   assignmentByPhase: Record<string, IAssignment>;
  // };
};
export const getTacListAction = catchAsync(
  async (params: { branchId: string }): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.get(`/inquiry/tac-list?branchId=${params.branchId}`);
    return res;
  }
);

export const bookSlotAction = catchAsync(
  async (payload: any): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.post("/pre-counselling/book-slot", payload);
    return res;
  }
);

export const scheduleAssessmentAction = catchAsync(
  async (payload: any): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.post("admin/tac/schedule-assessment", payload);
    return res;
  }
);

export const getSlotsAction = catchAsync(
  async (params: { consultantId: string; date: string }): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.get(`/pre-counselling/slots?consultantId=${params.consultantId}&date=${params.date}`);
    return res;
  }
);

export const updateAssignmentAction = catchAsync(
  async (payload: any): Promise<AxiosResponse<ApiResponse<any>>> => {
    const headers = payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
    const res = await httpsCall.patch("/tac/assignment/update", payload, { headers });
    return res;
  }
);

export const updateAssignmentAssessAction = catchAsync(
  async (payload: any): Promise<AxiosResponse<ApiResponse<any>>> => {
    const headers = payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
    const res = await httpsCall.patch("/tac/assignment/update-assessment", payload, { headers });
    return res;
  }
);

export const updateDocumentStatusAction = catchAsync(
  async (payload: any): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.patch("/tac/assignment/document-verify", payload);
    return res;
  }
);

export const updateExpStatusAction = catchAsync(
  async (payload: any): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.patch("/tac/assignment/exp-verify", payload);
    return res;
  }
);

export const updateLeadAction = catchAsync(
  async (payload: any): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.patch("/tac/lead/update", payload);
    return res;
  }
);

export const escalateLeadAction = catchAsync(
  async (payload: any): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.post("/tac/escalate", payload);
    return res;
  }
);

export const sendTacEmailAction = catchAsync(
  async (payload: any): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.post("/tac/communication/send-email", payload);
    return res;
  }
);