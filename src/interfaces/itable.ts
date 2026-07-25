
export interface IUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  address?: string;

  password?: string;
  role?: "admin" | "tac" | "user" | "foe" | "finance" | "coordinator" | "pca" | "pcra" | "institute" | "sub_pca" | "branch_head" | "tac_head"; passportStatus?: "having" | "not" | "applied";
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

export interface ILead {
  fullName?: string;

  contact?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
  };

  address?: string;

  preferences?: {
    branchId?: string;
    consultantId?: string;
    visitType?: "online" | "offline";
  };

  source?: {
    type?: "web_app" | "telecall" | "social" | "refer" | "none";
    refType?: "pca" | "pcra" | "institute" | "other";
    refName?: string;
  };

  status?: string;
  inqNo?: string;
  inqFy?: string;

  experience?: {
    type?: "fresher" | "domestic" | "abroad" | "free";
    submittedOn?: Date;
    status?: "selected" | "verified" | "rejected" | "request_technical";
    actionBy?: IUser;
  };

  documents?: {
    submittedOn?: Date;
    status?: "na" | "uploaded" | "verified" | "rejected" | "re_uploaded" | "re_verified" | "awaiting_approval";
    actionBy?: IUser;
    remarks?: string;
  };

  technical?: {
    required?: boolean;
    status?: "na" | "refered" | "passed" | "failed";
  };

  passport?: {
    status?: "no" | "applied" | "having";
    no?: string;
  };

  createdBy?: {
    id?: string;
    type?: "self" | "tac" | "pca" | "pcra" | "sub_pca" | "institute";
  };

  escalatedTo?: string;

  createdAt: Date;
  updatedAt: Date;
}
