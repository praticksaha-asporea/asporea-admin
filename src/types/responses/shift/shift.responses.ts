import type { ScheduleObj } from "../../payloads/shift/shift.payloads";

export interface ShiftResponseData {
  _id: string;
  shiftName: string;
  schedules: ScheduleObj[];
  createdAt?: string;
  updatedAt?: string;
}