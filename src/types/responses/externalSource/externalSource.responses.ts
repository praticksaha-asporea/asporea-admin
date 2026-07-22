export interface PopulatedUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    whatsappNumber?: string;
    address?: string;
    notificationPreference?: {
        sms: boolean;
        whatsapp: boolean;
        email: boolean;
    };
}

export interface PopulatedSubOf {
    _id: string;
    name: string;
}

export interface ExternalSource {
    _id: string;
    name: string;
    type: "pca" | "pcra" | "institute";
    status: "active" | "inactive";
    userId?: PopulatedUser | string;
    subOf?: PopulatedSubOf | string | null;
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