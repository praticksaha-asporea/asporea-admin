export interface DocumentTypePayload {
  title: string;
  subTitle: string;
  section: string;
  supportedExtensions: string[];
  required: boolean;
  multiple: boolean;
}