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
  candidateProfile?: {
    technicalQualification?: string;
    academic?: string;
    nationality?: string;
    workExp?: string;
  };
  tacProfile?: {
    designation?: string;
    areasOfExp?: string[] | string; 
    languagesKnown?: string[] | string;
    industryExp?: string[] | string;
    specialization?: string[] | string;
    mode?: string;
    rating?: number;
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
