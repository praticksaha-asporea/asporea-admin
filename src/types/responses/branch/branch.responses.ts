export interface BranchResponseData {
  _id: string;
  title: string;
  location: string;
  timeZone: string;
  counters: number;
  workDays: string[];
  status?: string;
  coordinates: {
    type: string;
    coordinates: number[];  
  };
  createdAt?: string;
  updatedAt?: string;
}