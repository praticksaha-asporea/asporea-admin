import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin } from "lucide-react";
import CustomTable, {
  StatusBadge, defaultRowActions,
  type ColumnDef, type FilterConfig,
} from "../../components/UI/customTable/CustomTable";
import { getBranchesApi } from "../../service/apis/branch.api";
import useDebounce from "../../utils/useDebounce";
import type { BranchResponseData } from "../../types/responses/branch/branch.responses";

// ─── Cell renderers ───────────────────────────────────────────────────────────

function BranchCell({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-[#0054a6] border border-blue-100/50 shrink-0">
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
        <span className="truncate max-w-40">{location}</span>
      </div>
      <p className="text-xs text-gray-400 font-medium mt-1 pl-5">{timeZone}</p>
    </div>
  );
}

function WorkDaysCell({ workDays }: { workDays: string[] }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {workDays.slice(0, 3).map((day) => (
        <span key={day} className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md uppercase">{day}</span>
      ))}
      {workDays.length > 3 && (
        <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md">+{workDays.length - 3}</span>
      )}
    </div>
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<BranchResponseData>[] = [
  { header: "Branch",              accessor: (row) => <BranchCell title={row.title} /> },
  { header: "Location & Timezone", accessor: (row) => <LocationCell location={row.location} timeZone={row.timeZone} /> },
  { header: "Counters",            accessor: (row) => <span className="text-lg font-black text-gray-700 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">{row.counters ?? 0}</span> },
  { header: "Work Days",           accessor: (row) => <WorkDaysCell workDays={row.workDays ?? []} /> },
  { header: "Status",              accessor: (row) => <StatusBadge status={row.status ?? "active"} /> },
];

// ─── Filter config ────────────────────────────────────────────────────────────

const filterConfigs: FilterConfig[] = [
  {
    key: "timeZone",
    placeholder: "All Timezones",
    options: [
      { label: "Asia / Kolkata",   value: "Asia/Kolkata" },
      { label: "Asia / Kathmandu", value: "Asia/Kathmandu" },
      { label: "Asia / Dubai",     value: "Asia/Dubai" },
    ],
  },
];

const PAGE_SIZE = 10;

// ─── Component ────────────────────────────────────────────────────────────────

const BranchList = () => {
  const navigate = useNavigate();

  const [branches, setBranches]     = useState<BranchResponseData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState("");
  const [filters, setFilters]       = useState<Record<string, string>>({});
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const handleSearch = (value: string) => { setSearch(value); setPage(1); };
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value === "all" ? "" : value }));
    setPage(1);
  };

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(PAGE_SIZE),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
      };
      const res = await getBranchesApi(params);
      setBranches(res?.data?.data ?? []);
      setTotalCount(res?.data?.pagination?.total ?? 0);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load branches.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters]);

  useEffect(() => { fetchBranches(); }, [fetchBranches]);

  const handleEdit = (branch: BranchResponseData) => navigate(`/branches/edit/${branch._id}`);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-red-500 font-bold text-sm">{error}</p>
        <button onClick={fetchBranches} className="px-5 py-2.5 bg-[#0D80F2] text-white text-sm font-bold rounded-xl hover:scale-[1.02] transition-all">Retry</button>
      </div>
    );
  }

  return (
    <CustomTable<BranchResponseData>
      title="Branches"
      subtitle="Manage physical locations and operations."
      addLabel="Add Branch"
      onAdd={() => navigate("/branches/add")}
      columns={columns}
      data={branches}
      totalCount={totalCount}
      currentPage={page}
      pageSize={PAGE_SIZE}
      onPageChange={setPage}
      searchValue={search}
      onSearchChange={handleSearch}
      filterValues={filters}
      onFilterChange={handleFilterChange}
      filters={filterConfigs}
      rowActions={defaultRowActions(handleEdit)}
      loading={loading}
      emptyMessage="No branches found matching your search / filter."
    />
  );
};

export default BranchList;