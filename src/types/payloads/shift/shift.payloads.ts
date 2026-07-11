export interface ScheduleObj {
  days: string[];
  startTime: string;
  endTime: string;
  breakTime: string;
}

export interface ShiftPayload {
  shiftName: string;
  schedules: ScheduleObj[];
}