export interface AssignmentPayload {
  employeeId: string;
  branchId: string;
  shiftId: string;
  effectiveFrom: string;
  minuteOfSlots: number;
  counterNo?: number;
  role: string;
}