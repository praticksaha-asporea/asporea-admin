export interface CreateAdminReminderPayload {
  targetIds: string[];
  notifyType: "candidate" | "tac";
  heading: string;
  message: string;
}

export interface AdminReminderListQueryParams {
  page?: number | string;
  limit?: number | string;
  read?: string;
  notifyType?: string;
  search?: string;
}
