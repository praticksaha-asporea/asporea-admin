import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { GeneralSettingsResponseData } from "../general/generalSettings.responses";
import type { LucideProps } from "lucide-react";

export interface DashboardStatCard {
    // label: string;
    // value: string | number;
    // delta?: string;
    // // trend?: "up" | "down";
    // sub?: string;
    // icon?: string;
    icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    tint?: string;
    label: string;
    value: string | number;
    delta?: string;
    sub?: string;
}

export interface RoleBreakdown {
    name: string;
    value: number;
}

export interface InquiryByBranch {
    branch: string;
    inquiries: number;
}

export interface RecentUpload {
    name: string;
    role: string;
    date: string;
}

export interface ExternalSource {
    _id: string;
    name: string;
    type: string;
    status: string;
    createdAt: string;
}

export interface Timeline {
    label: string;
    hours: number;
}

export interface BranchStatus {
    _id: string;
    title: string;
    location: string;
    counters: number;
    status: boolean;
    timeZone: string;
}

export interface positionWithMandatoryDocs {
    _id: string;
    mandatoryDocuments: string[];
}

export interface DashboardData {
    totalUsers: number;
    registeredThisWeek: number;
    roleBreakdown: RoleBreakdown[];
    branches: BranchStatus[];
    leads: number;
    inquiriesByBranch: InquiryByBranch[];
    positions: positionWithMandatoryDocs[];
    generalSetting: GeneralSettingsResponseData;
    externalSources: ExternalSource[];
}

export interface DashboardResponse {
    statCards?: DashboardStatCard[];
    roleBreakdown?: RoleBreakdown[];
    inquiriesByBranch?: InquiryByBranch[];
    recentUploads?: RecentUpload[];
    externalSources?: ExternalSource[];
    timelines?: Timeline[];
    branchStatus?: BranchStatus[];
    generalSetting?: GeneralSettingsResponseData;
}