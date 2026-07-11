export interface AdminNotificationPreference {
  sms: boolean;
  whatsapp: boolean;
  email: boolean;
}

export interface AdminProfilePic {
  _id: string;
  path: string;
}

export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  whatsappNumber: string;
  address: string;
  password?: string;
  role: string;
  passportStatus: string;
  status: string;
  passportNo: string;
  enquired: string;
  experienceInMonths: number | null;
  notificationPreference: AdminNotificationPreference;
  profilePic: AdminProfilePic | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponseData {
  admin: AdminUser;
  tokens: AuthTokens;
}

export interface ChangePasswordResponseData {
  id: string;
  firstName: string;
  lastname: string;   
  email: string;
  updatedAt: string;
}
