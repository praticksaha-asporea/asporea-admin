import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin } from "lucide-react";
import CustomTable, {
  StatusBadge,
  defaultRowActions,
  type ColumnDef,
  type FilterConfig,
} from "../../components/UI/customTable/CustomTable";
import { getBranchesApi } from "../../service/apis/branch.api";

// ─── Types ────────────────────────────────────────────────────────────────────

type Branch = {
  _id: string;
  title: string;
  location: string;
  timeZone: string;
  counters: number;
  workDays: string[];
  status?: string;
};

// ─── Cell renderers ───────────────────────────────────────────────────────────

function BranchCell({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-[#0054a6] border border-blue-100/50 shrink-0">
        <Building2 className="w-5 h-5" />
      </div>
      <p className="text-sm font-bold text-gray-800">{title}</p>
    </div>
  );
}

function LocationCell({ location, timeZone }: { location: string; timeZone: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-sm font-bold text-gray-600">
        <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
        <span className="truncate max-w-[160px]">{location}</span>
      </div>
      <p className="text-xs text-gray-400 font-medium mt-1 pl-5">{timeZone}</p>
    </div>
  );
}

function WorkDaysCell({ workDays }: { workDays: string[] }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {workDays.slice(0, 3).map((day) => (
        <span key={day} className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md uppercase">
          {day}
        </span>
      ))}
      {workDays.length > 3 && (
        <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md">
          +{workDays.length - 3}
        </span>
      )}
    </div>
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<Branch>[] = [
  {
    header: "Branch",
    accessor: (row) => <BranchCell title={row.title} />,
  },
  {
    header: "Location & Timezone",
    accessor: (row) => <LocationCell location={row.location} timeZone={row.timeZone} />,
  },
  {
    header: "Counters",
    accessor: (row) => (
      <span className="text-lg font-black text-gray-700 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
        {row.counters ?? 0}
      </span>
    ),
  },
  {
    header: "Work Days",
    accessor: (row) => <WorkDaysCell workDays={row.workDays ?? []} />,
  },
  {
    header: "Status",
    accessor: (row) => <StatusBadge status={row.status ?? "active"} />,
  },
];

// ─── Filter config ────────────────────────────────────────────────────────────

const filters: FilterConfig[] = [
  {
    key: "timeZone",
    placeholder: "All Timezones",
    options: [
      { label: "Asia / Kolkata",   value: "Asia/Kolkata" },
      { label: "Asia / Kathmandu", value: "Asia/Kathmandu" },
      { label: "Asia / Dubai",     value: "Asia/Dubai" },
    ],
  }
];

// ─── Component ────────────────────────────────────────────────────────────────

const BranchList = () => {
  const navigate = useNavigate();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchBranches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBranchesApi();
      setBranches(res?.data?.data ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load branches.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleEdit = (branch: Branch) => {
    navigate(`/branches/edit/${branch._id}`);
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded-xl" />
        <div className="h-14 bg-gray-100 rounded-2xl" />
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 px-6 py-4 border-b border-gray-50">
              <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 bg-gray-200 rounded" />
                <div className="h-3 w-56 bg-gray-100 rounded" />
              </div>
              <div className="h-3 w-20 bg-gray-200 rounded self-center" />
              <div className="h-3 w-16 bg-gray-200 rounded self-center" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-red-500 font-bold text-sm">{error}</p>
        <button
          onClick={fetchBranches}
          className="px-5 py-2.5 bg-[#0D80F2] text-white text-sm font-bold rounded-xl hover:scale-[1.02] transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Table ──────────────────────────────────────────────────────────────────
  return (
    <CustomTable<Branch>
      title="Branches"
      subtitle="Manage physical locations and operations."
      addLabel="Add Branch"
      onAdd={() => navigate("/branches/add")}
      columns={columns}
      data={branches}
      searchKeys={["title", "location"]}
      filters={filters}
      rowActions={defaultRowActions(handleEdit)}
      pageSize={10}
      emptyMessage="No branches found matching your search / filter."
    />
  );
};

export default BranchList;
