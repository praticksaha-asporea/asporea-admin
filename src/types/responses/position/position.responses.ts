export interface DocRef {
_id: string;
title: string;
section: string;
}
export interface CountryRef {
  _id: string;
  name: string;
  code?: string;
}

export interface CountryResponseData {
  _id: string;
  name: string;
  code?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PositionResponseData {
  _id: string;
  title: string;
  details?: string;
  requiredDocuments?: DocRef[];
  mandatoryDocuments?: DocRef[];
  positionBrochure?: string;
  type: string[] | undefined;

  programTypes?: string[];
  country?: string | CountryRef; 
  createdAt?: string;
  updatedAt?: string;
}