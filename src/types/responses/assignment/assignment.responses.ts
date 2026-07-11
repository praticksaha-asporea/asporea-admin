export interface AssignmentResponseData {
  _id: string;
  employeeId:
    | { _id: string; firstName: string; lastName: string; role: string }
    | string;
  branchId: { _id: string; title: string } | string;
  shiftId: { _id: string; shiftName: string } | string;
  effectiveFrom: string;
  minuteOfSlots: number;
  counterNo?: number;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}
