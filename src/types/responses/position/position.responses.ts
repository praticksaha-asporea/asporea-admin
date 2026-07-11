export interface DocRef {
_id: string;
title: string;
section: string;
}

export interface PositionResponseData {
_id: string;
title: string;
details?: string;
requiredDocuments: DocRef[];
mandatoryDocuments: DocRef[];
positionBrochure?: string;
createdAt?: string;
updatedAt?: string;
}