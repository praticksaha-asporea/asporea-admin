import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import CustomTable, {
  defaultRowActions,
  type ColumnDef, type FilterConfig,
} from "../../../components/UI/customTable/CustomTable";
import { getDocumentTypesApi, deleteDocumentTypeApi } from "../../../service/apis/documentType.api";
import useDebounce from "../../../utils/useDebounce";
import { confirmToast } from "../../../utils/confirmToast";

// ─── Types ────────────────────────────────────────────────────────────────────

type DocumentType = {
  _id: string;
  title: string;
  subTitle?: string;
  section: string;
  supportedExtensions: string[];
  required: boolean;
  multiple: boolean;
};

// ─── Cell renderers ───────────────────────────────────────────────────────────

function TypeCell({ title, subTitle, section }: { title: string; subTitle?: string; section: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-[#0054a6] border border-blue-100/50 shrink-0">
        <FileText className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">{title}</p>
        {subTitle && <p className="text-xs text-gray-400 font-medium mt-0.5">{subTitle}</p>}
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider mt-0.5">{section}</p>
      </div>
    </div>
  );
}

function ExtensionsCell({ extensions }: { extensions: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {extensions.map((ext) => (
        <span key={ext} className="text-[10px] font-black text-[#0054a6] bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">
          .{ext}
        </span>
      ))}
    </div>
  );
}

function BoolBadge({ value, trueLabel, falseLabel }: { value: boolean; trueLabel: string; falseLabel: string }) {
  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
      value ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-100"
    }`}>
      {value ? trueLabel : falseLabel}
    </span>
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<DocumentType>[] = [
  {
    header: "Document Type",
    accessor: (row) => <TypeCell title={row.title} subTitle={row.subTitle} section={row.section} />,
  },
  {
    header: "Extensions",
    accessor: (row) => <ExtensionsCell extensions={row.supportedExtensions ?? []} />,
  },
  {
    header: "Required",
    accessor: (row) => <BoolBadge value={row.required} trueLabel="Required" falseLabel="Optional" />,
  },
  {
    header: "Multiple",
    accessor: (row) => <BoolBadge value={row.multiple} trueLabel="Multiple" falseLabel="Single" />,
  },
];

// ─── Filter config ────────────────────────────────────────────────────────────

const filterConfigs: FilterConfig[] = [
  {
    key: "section",
    placeholder: "All Sections",
    options: [
      { label: "Resume",     value: "resume" },
      { label: "Document",   value: "document" },
      { label: "Experience", value: "experience" },
      { label: "Academic",   value: "academic" },
      { label: "Additional", value: "additional" },
    ],
  },
  {
    key: "required",
    placeholder: "All Types",
    options: [
      { label: "Required", value: "true" },
      { label: "Optional", value: "false" },
    ],
  },
];

const PAGE_SIZE = 10;

// ─── Component ────────────────────────────────────────────────────────────────

const TypesList = () => {
  const navigate = useNavigate();

  const [types, setTypes]           = useState<DocumentType[]>([]);
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

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(PAGE_SIZE),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
      };
      const res = await getDocumentTypesApi(params);
      // API returns data.types (not data.data)
      setTypes(res?.data?.types ?? []);
      setTotalCount(res?.data?.pagination?.total ?? 0);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load document types.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters]);

  useEffect(() => { fetchTypes(); }, [fetchTypes]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleEdit = (type: DocumentType) => navigate(`/document-types/edit/${type._id}`);

  const handleDelete = async (type: DocumentType) => {
    const confirmed = await confirmToast(`Delete "${type.title}"?`);
    if (!confirmed) return;
    try {
      await deleteDocumentTypeApi(type._id);
      setTypes((prev) => prev.filter((t) => t._id !== type._id));
      setTotalCount((c) => c - 1);
      toast.success("Document type deleted.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete.");
    }
  };

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-red-500 font-bold text-sm">{error}</p>
        <button onClick={fetchTypes} className="px-5 py-2.5 bg-[#0D80F2] text-white text-sm font-bold rounded-xl hover:scale-[1.02] transition-all">
          Retry
        </button>
      </div>
    );
  }

  return (
    <CustomTable<DocumentType>
      title="Document Types"
      subtitle="Define document categories and their upload rules."
      addLabel="Add Type"
      onAdd={() => navigate("/document-types/add")}
      columns={columns}
      data={types}
      totalCount={totalCount}
      currentPage={page}
      pageSize={PAGE_SIZE}
      onPageChange={setPage}
      searchValue={search}
      onSearchChange={handleSearch}
      filterValues={filters}
      onFilterChange={handleFilterChange}
      filters={filterConfigs}
      rowActions={defaultRowActions(handleEdit, handleDelete)}
      loading={loading}
      emptyMessage="No document types found."
    />
  );
};

export default TypesList;
