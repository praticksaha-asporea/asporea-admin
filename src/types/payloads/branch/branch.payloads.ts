export interface BranchPayload {
  title: string;
  location: string;
  counters: number;
  timeZone: string;
  workDays: string[];
  latitude?: string;
  longitude?: string;
}