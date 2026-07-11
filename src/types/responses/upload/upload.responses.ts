export interface UploadUserRef {
  _id: string;
  firstName: string;
  lastName?: string;
  profilePic?: string;
  role?: string;
}

export interface UploadResponseData {
  _id: string;
  path: string;
  role?: string;
  user?: UploadUserRef | null;
  userId?: UploadUserRef | null;
  createdAt: string;
  updatedAt?: string;
}