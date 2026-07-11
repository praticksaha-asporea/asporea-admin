export interface DocumentTypeResponseData {
  _id: string;
  title: string;
  subTitle?: string;
  section: string;
  supportedExtensions: string[];
  required: boolean;
  multiple: boolean;
  createdAt?: string;
  updatedAt?: string;
}