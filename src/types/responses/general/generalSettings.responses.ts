import type { GeneralSettingsPayload } from "../../payloads/general/generalSettings.payloads";

export interface GeneralSettingsResponseData extends GeneralSettingsPayload {
  tacAssignment?: "random" | "counterwise";  
  lastInq?: number;
  lastFy?: string;
}