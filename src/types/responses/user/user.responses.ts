export interface ProfilePicInfo {
  _id: string;
  path: string;
}

export interface UserResponseData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  address?: string;
  passportStatus?: string;
  passportNo?: string;
  enquired?: string;
  notificationPreference?: {
    sms: boolean;
    whatsapp: boolean;
    email: boolean;
  };
  profilePic?: ProfilePicInfo | null;
  createdAt: string;
  updatedAt: string;
}