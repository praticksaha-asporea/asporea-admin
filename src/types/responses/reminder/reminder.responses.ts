export interface ReminderTargetResponse {
  id: string;
  name: string;
  info: string;
  type: "candidate" | "tac";
  profilePic?: string | null;  
}

export interface CreateAdminReminderResponseData {
  success: any;
  count: number;
  message: string;
}

export interface RecipientDetails {
  id?: string;
  name: string;
  info?: string;
  inqNo?: string;
  email?: string;
  role?: string;
  profilePic?: string | null;
  type?: "candidate" | "tac";
}

export interface AdminReminderListItem {
  _id: string;
  notifyTo: string;
  notifyType: "candidate" | "tac";
  sentFrom: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    profilePic?: {
      path?: string;
      url?: string;
    } | string | null;
  };
  heading: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  notifyToDetails?: RecipientDetails | null;
}

export interface DeleteReminderResponseData {
  success: any;
  message: string;
}