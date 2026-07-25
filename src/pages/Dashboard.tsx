import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Building2,
  Briefcase,
  ClipboardList,
  Link2,
  ArrowUpRight,
  Clock,
  type LucideProps,
} from "lucide-react";
import { useDashboard } from "./useDashboard";
import { CamelCase } from "../utils/common";
import type { BranchStatus, DashboardStatCard, ExternalSource, RoleBreakdown, Timeline } from "../types/responses/dashboard/get-lists.responses";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

// ---- Component ----

export default function Dashboard() {
  const { ROLE_COLORS, roleBreakdown, inquiriesByBranch, externalSources, timelines, branchStatus, statCards, generalSetting } = useDashboard();

  const CARD_META = {
    "Total Users": {
      icon: Users,
      tint: "bg-blue-50 text-blue-600",
    },
    "Active Branches": {
      icon: Building2,
      tint: "bg-purple-50 text-purple-600",
    },
    "Total Inquiries": {
      icon: ClipboardList,
      tint: "bg-emerald-50 text-emerald-600",
    },
    "Open Positions": {
      icon: Briefcase,
      tint: "bg-amber-50 text-amber-600",
    },
  };


  const statCardsShow = statCards?.map((card: DashboardStatCard) => ({
    ...card,
    ...CARD_META[card.label as keyof typeof CARD_META],
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome back, Admin!
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Here's what's happening across your branches today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-white border border-gray-100 rounded-full px-4 py-2">
            <Clock size={16} />
            Last inquiry #{generalSetting?.lastInq} &middot; FY {generalSetting?.lastFy}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCardsShow?.map((card: DashboardStatCard) => {
            const Icon = card?.icon as ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
            return (
              <div
                key={card.label}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start justify-between"
              >
                <div>
                  <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {card.value}
                  </p>
                  {card.delta && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1 mt-2 font-medium">
                      <ArrowUpRight size={14} />
                      {card.delta}
                    </p>
                  )}
                  {card.sub && (
                    <p className="text-xs text-gray-400 mt-2">{card.sub}</p>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${card?.tint}`}>
                  <Icon size={22} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Inquiries by Branch
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Total inquiries logged per active branch
            </p>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={inquiriesByBranch}>
                  <XAxis
                    dataKey="branch"
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    axisLine={{ stroke: "#F3F4F6" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#F9FAFB" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #F3F4F6",
                      fontSize: 13,
                    }}
                  />
                  <Bar dataKey="inquiries" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Users by Role
            </h2>
            <p className="text-sm text-gray-400 mb-2">{roleBreakdown?.reduce((a: number, b: RoleBreakdown) => a + b.value, 0)} total users</p>
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={roleBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {roleBreakdown?.map((entry: RoleBreakdown, i: number) => (
                      <Cell key={entry.name} fill={ROLE_COLORS[i % ROLE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #F3F4F6",
                      fontSize: 13,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {roleBreakdown?.map((r: RoleBreakdown, i: number) => (
                <div key={r.name} className="flex items-center gap-2 text-xs text-gray-500">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: ROLE_COLORS[i % ROLE_COLORS.length] }}
                  />
                  {CamelCase(r.name)} &middot; {r.value}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Branch Status</h2>
              <Building2 size={18} className="text-gray-300" />
            </div>
            <div className="space-y-3">
              {branchStatus?.map((b: BranchStatus) => (
                <div
                  key={b.title}
                  className="flex items-center justify-between border-b border-gray-50 last:border-0 pb-3 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">{b.title}</p>
                    <p className="text-xs text-gray-400">{b.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{b.counters} counters</p>
                    {b.status !== false && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {b.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>


          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">External Sources</h2>
              <Link2 size={18} className="text-gray-300" />
            </div>
            <div className="space-y-3 mb-5">
              {externalSources?.map((s: ExternalSource) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{CamelCase(s.name)}</p>
                    <p className="text-xs text-gray-400">{CamelCase(s.type)}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold inline-flex items-center gap-1 ${s.status === "active" ? "text-emerald-600" : "text-orange-500"
                      }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${s.status === "active" ? "bg-emerald-500" : "bg-orange-500"
                        }`}
                    />
                    {CamelCase(s.status)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-50 pt-4">
              <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase mb-3">
                Timelines (hrs)
              </p>
              <div className="grid grid-cols-2 gap-3">
                {timelines?.map((t: Timeline) => (
                  <div key={t?.label} className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-400">{t?.label}</p>
                    <p className="text-sm font-semibold text-gray-700">{t?.hours}h</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
