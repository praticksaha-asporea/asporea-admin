export interface PositionPayload {
  title: string;
  details: string;
  requiredDocuments: string[];
  mandatoryDocuments: string[];
  programTypes?: string[];
  countries?: string[];   
  positionBrochure?: string;
}


export interface CountryPayload {
  name: string;
  code?: string;
  isActive?: boolean;
}