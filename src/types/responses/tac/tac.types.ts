import type { CandidateRow } from "../../object.types";
export interface CandidatesResponse {
  pagination: any;
  kpis: any;
  success: boolean;
  message: string;
  data: {
    kpis: any;
    data: CandidateRow[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  error: null;
}

export interface candidateDetailResponse {
  success: boolean;
  message: string;
  data: {
    lead: any;
    branchToken: null | any;
    assignments: any;
    assignmentByPhase: Record<string, any>;
    generalSettings: any;
    assessResult: any;
  };
  error: null;
}