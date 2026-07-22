import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";  
import { confirmToast } from "../../utils/confirmToast";
import CustomTable, {
  RoleBadge, StatusBadge,
  type ColumnDef, type FilterConfig,
} from "../../components/UI/customTable/CustomTable";
import { getExternalSourcesApi, toggleExternalSourceApi } from "../../service/apis/externalSource.api"; 
import useDebounce from "../../utils/useDebounce";
import type { ExternalSource } from "../../types/responses/externalSource/externalSource.responses";
import { Edit2 } from "lucide-react"; 

const filterConfigs: FilterConfig[] = [
  {
    key: "type",
    placeholder: "All Types",
    options: [
      { label: "PCA", value: "pca" },
      { label: "PCRA", value: "pcra" },
      { label: "Institute", value: "institute" },
    ],
  },
  {
    key: "status",
    placeholder: "All Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
];

const PAGE_SIZE = 10;

const ExternalSourcesList = () => {
  const navigate = useNavigate();
  const [sources, setSources] = useState<ExternalSource[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const handleSearch = (value: string) => { setSearch(value); setPage(1); };
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value === "all" ? "" : value }));
    setPage(1);
  };

  const fetchSources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(PAGE_SIZE),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
      };
      
      const res: any = await getExternalSourcesApi(params);
      const rawPayload = res?.data?.data ?? res?.data ?? res;
      const listArray = Array.isArray(rawPayload?.data) ? rawPayload.data : (Array.isArray(rawPayload) ? rawPayload : []);
      
      setSources(listArray);
      setTotalCount(rawPayload?.pagination?.total ?? listArray.length);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load external sources.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters]);

  useEffect(() => { fetchSources(); }, [fetchSources]);

  const handleEdit = (source: ExternalSource) => navigate(`/external-sources/edit/${source._id}`);
  
 
  const handleToggle = async (source: ExternalSource) => {
    const isCurrentlyActive = source.status === "active";
    const targetStatus = isCurrentlyActive ? "inactive" : "active";
    const isParentInactive = typeof source.subOf === 'object' && source.subOf !== null && (source.subOf as any).status === 'inactive';
    if (!isCurrentlyActive && isParentInactive) {
      toast.error("Parent account is inactive.Please activate the parent before the sub-account",{
        id: "parent-inactive-warning",
      });
      return;
    }
    const ok = await confirmToast(`Are you sure you want to ${isCurrentlyActive ? 'deactivate' : 'activate'} ${source.name}?`);
    if (!ok) return;  

    try {
      await toggleExternalSourceApi(source._id, targetStatus);
      toast.success(`Source ${isCurrentlyActive ? 'deactivated' : 'activated'} successfully`);
      fetchSources(); 
    } catch (err: any) {
    //   toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

 
  const columns = useMemo<ColumnDef<ExternalSource>[]>(() => [
    {
      header: "Source Name",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">{row.name}</span>
          {row.subOf && <span className="text-xs text-gray-400">Sub-account</span>}
        </div>
      ),
    },
    {
      header: "Type / Role",
      accessor: (row) => <RoleBadge role={row.type} />,
    },
    {
      header: "Status",
      accessor: (row) => <StatusBadge status={row.status || 'active'} />,
    },
    {
      header: "Added On",
      accessor: (row) => (
        <span className="text-sm text-gray-500 font-medium">
          {new Date(row.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row) => {
       
        const isParentInactive = typeof row.subOf === 'object' && row.subOf !== null && (row.subOf as any).status === 'inactive';
        const isRowActive = row.status === 'active';

        return (
          <div className="flex items-center justify-end gap-3 px-2">
            {/* Edit Button */}
            <button
              type="button"
              onClick={() => handleEdit(row)}
              className="p-1.5 text-gray-400 hover:text-[#0054a6] hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
              title="Edit Source"
            >
              <Edit2 className="w-4.5 h-4.5" />
            </button>

            {/* Status Toggle Switch */}
            <button
              type="button"
              onClick={() => !isParentInactive && handleToggle(row)}
              disabled={isParentInactive}
              title={isParentInactive ? "Parent is inactive. Cannot activate." : "Toggle Status"}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none 
                ${isRowActive ? 'bg-green-500' : 'bg-gray-300'} 
                ${isParentInactive ? 'opacity-40 blur-[1px] cursor-not-allowed grayscale' : 'cursor-pointer hover:shadow-md'}`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition duration-300 ease-in-out 
                  ${isRowActive ? 'translate-x-4.5' : 'translate-x-1'}`}
              />
            </button>
          </div>
        );
      },
    },
  ], []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-red-500 font-bold text-sm">{error}</p>
        <button onClick={fetchSources} className="px-5 py-2.5 bg-[#0D80F2] text-white text-sm font-bold rounded-xl hover:scale-[1.02] transition-all">
          Retry
        </button>
      </div>
    );
  }

  return (
    <CustomTable<ExternalSource>
      title="External Sources"
      subtitle="Manage your PCAs, PCRAs, and Institutes."
      addLabel="Add New Source"
      onAdd={() => navigate("/external-sources/add")}
      columns={columns}
      data={sources}
      totalCount={totalCount}
      currentPage={page}
      pageSize={PAGE_SIZE}
      onPageChange={setPage}
      searchValue={search}
      onSearchChange={handleSearch}
      filterValues={filters}
      onFilterChange={handleFilterChange}
      filters={filterConfigs}
      loading={loading}
      emptyMessage="No sources found."
    />
  );
};

export default ExternalSourcesList;