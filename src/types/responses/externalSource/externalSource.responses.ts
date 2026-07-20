
export interface ExternalSource {
    _id: string;
    name: string;
    type: "pca" | "pcra" | "institute";
    status: "active" | "inactive";
    createdAt: string;
    updatedAt: string;
}


export interface ExternalSourceListResponse {
    data: ExternalSource[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}