
export interface NotificationPreference {
    sms?: boolean;
    whatsapp?: boolean;
    email?: boolean;
}

export interface ExternalSourcePayload {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    whatsappNumber: string;
    address: string;
    password?: string;
    role: "pca" | "pcra" | "institute";
    subOf?: string | null;
    notificationPreference: NotificationPreference
}

export type UpdateExternalSourcePayload = Partial<ExternalSourcePayload>;


export type ExternalSourceStatus = "active" | "inactive";

export interface ToggleStatusPayload {
    targetStatus?: ExternalSourceStatus;
}

export interface ExternalSourceQueryParams {
    page?: string | number;
    limit?: string | number;
    search?: string;
    type?: string;
    status?: string;
    [key: string]: string | number | boolean | undefined;
}



