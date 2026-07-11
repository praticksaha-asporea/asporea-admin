export interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  password?: string;
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
}

export interface ProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  whatsappNumber: string;
  address: string;
  passportStatus: string;
  passportNo: string;
  enquired: string;
  notificationPreference: {
    sms: boolean;
    whatsapp: boolean;
    email: boolean;
  };
  profilePicData?: string;
  id: string;
}
