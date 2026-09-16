export interface PaginatedData<T> {
  records: any;
  totalPages: number;
  total: number;
  success: import("../reminder/reminder.responses").AdminReminderListItem[];
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}