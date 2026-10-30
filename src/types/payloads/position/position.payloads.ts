export interface PositionPayload {
  title: string;
  details: string;
  requiredDocuments: string[];
  mandatoryDocuments: string[];
  programTypes?: string[];
  country?: string;
  positionBrochure?: string;
  status: boolean;
}


export interface CountryPayload {
  name: string;
  code?: string;
  isActive?: boolean;
}