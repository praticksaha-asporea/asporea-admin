import type { GeneralSettingsPayload } from "../../payloads/general/generalSettings.payloads";

export interface GeneralSettingsResponseData extends Omit<GeneralSettingsPayload, 'inquiryBrochures'> {
  tacAssignment?: "random" | "counterwise";
  lastInq?: number;
  lastFy?: string;
  inquiryBrochures?: {
    name: string;
    uploadId: { _id: string; path: string; publicId?: string };
  }[];
}