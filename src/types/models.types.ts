export type AssignmentStatus =
  | "pending"
  | "completed"
  | "contacted"
  | "not_responded"
  | "scheduled"
  | "rescheduled"
  | "in_progress"
  | string;

export interface IAssignment {
  pre: any;
  token: any;
  _id: string;
  leadId: string;
  phase: "pre_counselling" | "assessment" | string;
  assignedTo:
    | string
    | {
        _id: string;
        firstName: string;
        lastName?: string;
      };
  assignedBy?: string;
  status: AssignmentStatus;
  schedule?: {
    date?: string;
    from?: string;
    to?: string;
    method?: "on" | "off";
  };
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGeneralSetting {
  _id: string;
  branchId?: string;
  autoAssignTac?: boolean;
  preCounsellingWindowHours?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAssessment {
  _id: string;
  leadId: string;
  status: string;
  score?: number;
  remarks?: string;
  evaluatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBranch {
  _id: string;
  title: string;
  code?: string;
  address?: string;
}

export interface IUser {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}