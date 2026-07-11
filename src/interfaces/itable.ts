
export interface IUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  address?: string;

  password?: string;
  role?: "admin" | "tac" | "user" | "foe" | "finance" | "coordinator" | "pca" | "pcra" | "institute" | "sub_pca" | "branch_head" | "tac_head";  passportStatus?: "having" | "not" | "applied";
  passportNo: string;
  enquired?: "yes" | "no";

  status?: "active" | "inactive" | "deleted";

 profilePic?: {
    _id: string;
    path: string;
  } | null;

  notificationPreference?: {
    sms?: boolean;
    whatsapp?: boolean;
    email?: boolean;
  };

  reviewer?: string;
  createdBy?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}