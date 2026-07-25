import { useCallback, useEffect, useState } from "react";
import { getDashboardItemsApi } from "../service/apis/dashboard.api";
import type { BranchStatus, DashboardResponse, DashboardStatCard, positionWithMandatoryDocs, Timeline } from "../types/responses/dashboard/get-lists.responses";
import type { GeneralSettingsResponseData } from "../types/responses/general/generalSettings.responses";

const initialDashboard: DashboardResponse = {
    statCards: [],
    roleBreakdown: [],
    inquiriesByBranch: [],
    recentUploads: [],
    externalSources: [],
    timelines: [],
    branchStatus: [],
    generalSetting: {} as GeneralSettingsResponseData,
};
export const useDashboard = () => {
    // const {statCards,inquiriesByBranch}

    const [dashboard, setDashboard] =
        useState<DashboardResponse>(initialDashboard);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const ROLE_COLORS = ["#3B82F6", "#8B5CF6", "#F59E0B", "#10B981", "#EF4444"];
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getDashboardItemsApi();
            const dashboardData = res?.data?.data;
            // console.log(dashboardData, 588);

            if (dashboardData) {
                const totalBranches = dashboardData?.branches.length;
                const totalLeads = dashboardData?.leads;
                const totalPositions = dashboardData?.positions.length;
                const totalActiveBranches = dashboardData?.branches.filter((branch: BranchStatus) => branch.status !== false).length;

                const statCards: DashboardStatCard[] = [
                    {
                        label: "Total Users",
                        value: dashboardData?.totalUsers,
                        delta: dashboardData?.registeredThisWeek > 0 ? `+${dashboardData?.registeredThisWeek} this week` : ``,
                    },
                    {
                        label: "Active Branches",
                        value: totalActiveBranches,
                        sub: `of ${totalBranches} total`
                    },
                    {
                        label: "Total Inquiries",
                        value: totalLeads,
                        sub: `Till date`,
                    },
                    {
                        label: "Open Positions",
                        value: totalPositions,
                        sub: `${dashboardData?.positions.filter((position: positionWithMandatoryDocs) => position?.mandatoryDocuments?.length > 0).length} with mandatory docs`,
                    },
                ];
                setDashboard({ statCards, roleBreakdown: dashboardData?.roleBreakdown, generalSetting: dashboardData?.generalSetting, branchStatus: dashboardData?.branches, inquiriesByBranch: dashboardData?.inquiriesByBranch, externalSources: dashboardData?.externalSources })
            }
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Failed to load users.");
        } finally {
            setLoading(false);
        }
    }, []);

    const timelines = [
        { label: "Escalation", hours: dashboard?.generalSetting?.escalationTimelineHours },
        { label: "Inq. Resolution", hours: dashboard?.generalSetting?.inqResTimelineHours },
        { label: "Pre-Counselling", hours: dashboard?.generalSetting?.preCounsellingTimelineHours },
        { label: "Assessment", hours: dashboard?.generalSetting?.assessmentTimelineHours },
    ] as Timeline[];

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    return {
        ROLE_COLORS,
        loading,
        error,
        refresh: fetchUsers,
        timelines,
        ...dashboard,
    };
} 