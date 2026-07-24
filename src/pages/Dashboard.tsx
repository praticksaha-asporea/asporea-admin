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
  UploadCloud,
  Link2,
  ArrowUpRight,
  Clock,
} from "lucide-react";

// ---- Mock data (wire these up to your real endpoints) ----

const statCards = [
  {
    label: "Total Users",
    value: "24",
    delta: "+3 this week",
    trend: "up",
    icon: Users,
    tint: "bg-blue-50 text-blue-600",
  },
  {
    label: "Active Branches",
    value: "6",
    sub: "of 7 total",
    icon: Building2,
    tint: "bg-purple-50 text-purple-600",
  },
  {
    label: "Total Inquiries",
    value: "164",
    sub: "FY 2026-27",
    icon: ClipboardList,
    tint: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Open Positions",
    value: "3",
    sub: "2 with mandatory docs",
    icon: Briefcase,
    tint: "bg-amber-50 text-amber-600",
  },
];

const roleBreakdown = [
  { name: "USER", value: 9 },
  { name: "TAC", value: 6 },
  { name: "TAC HEAD", value: 2 },
  { name: "PCA", value: 4 },
  { name: "ADMIN", value: 3 },
];

const ROLE_COLORS = ["#3B82F6", "#8B5CF6", "#F59E0B", "#10B981", "#EF4444"];

const inquiriesByBranch = [
  { branch: "Dubai", inquiries: 28 },
  { branch: "Dehradun", inquiries: 41 },
  { branch: "Guwahati", inquiries: 19 },
  { branch: "Kalimpong", inquiries: 33 },
  { branch: "Kolkata", inquiries: 43 },
];

const recentUploads = [
  { name: "Pratik De...", role: "TAC", date: "23 Jul 2026" },
  { name: "Anil Yadav", role: "USER", date: "23 Jul 2026" },
  { name: "Pratick A...", role: "ADMIN", date: "23 Jul 2026" },
];

const externalSources = [
  { name: "Arijit Singh", type: "PCA", status: "ACTIVE" },
  { name: "vishal mishra", type: "PCA", status: "INACTIVE" },
];

const timelines = [
  { label: "Escalation", hours: 3 },
  { label: "Inq. Resolution", hours: 3 },
  { label: "Pre-Counselling", hours: 3 },
  { label: "Assessment", hours: 3 },
];

const branchStatus = [
  { name: "Dubai", location: "Asia/Dubai", counters: 0, status: "ACTIVE" },
  { name: "Dehradun", location: "Asia/Kolkata", counters: 1, status: "ACTIVE" },
  { name: "Guwahati", location: "Asia/Kolkata", counters: 1, status: "ACTIVE" },
];

// ---- Component ----

export default function Dashboard() {
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
            Last inquiry #164 &middot; FY 2026-27
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
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
                <div className={`p-3 rounded-xl ${card.tint}`}>
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
            <p className="text-sm text-gray-400 mb-2">24 total users</p>
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
                    {roleBreakdown.map((entry, i) => (
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
              {roleBreakdown.map((r, i) => (
                <div key={r.name} className="flex items-center gap-2 text-xs text-gray-500">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: ROLE_COLORS[i % ROLE_COLORS.length] }}
                  />
                  {r.name} &middot; {r.value}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Branch status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Branch Status</h2>
              <Building2 size={18} className="text-gray-300" />
            </div>
            <div className="space-y-3">
              {branchStatus.map((b) => (
                <div
                  key={b.name}
                  className="flex items-center justify-between border-b border-gray-50 last:border-0 pb-3 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">{b.name}</p>
                    <p className="text-xs text-gray-400">{b.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{b.counters} counters</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent uploads */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Uploads</h2>
              <UploadCloud size={18} className="text-gray-300" />
            </div>
            <div className="space-y-3">
              {recentUploads.map((u, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-gray-50 last:border-0 pb-3 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">{u.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* External sources + timelines */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">External Sources</h2>
              <Link2 size={18} className="text-gray-300" />
            </div>
            <div className="space-y-3 mb-5">
              {externalSources.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.type}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold inline-flex items-center gap-1 ${s.status === "ACTIVE" ? "text-emerald-600" : "text-orange-500"
                      }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${s.status === "ACTIVE" ? "bg-emerald-500" : "bg-orange-500"
                        }`}
                    />
                    {s.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-50 pt-4">
              <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase mb-3">
                Timelines (hrs)
              </p>
              <div className="grid grid-cols-2 gap-3">
                {timelines.map((t) => (
                  <div key={t.label} className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-400">{t.label}</p>
                    <p className="text-sm font-semibold text-gray-700">{t.hours}h</p>
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
