import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import CustomTable, {
  defaultRowActions,
  type ColumnDef,
} from "../../components/UI/customTable/CustomTable";
import {
  getPositionsApi,
  deletePositionApi,
} from "../../service/apis/position.api";
import useDebounce from "../../utils/useDebounce";
import { confirmToast } from "../../utils/confirmToast";

import type {
  PositionResponseData,
  DocRef,
} from "../../types/responses/position/position.responses";

// ─── Cell Renderers ───────────────────────────────────────────────────────────

function PositionCell({ title, details }: { title: string; details?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-[#0054a6] border border-blue-100/50 shrink-0">
        <Briefcase className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">{title}</p>
        {details && (
          <p className="text-xs text-gray-400 font-medium mt-0.5 max-w-50 truncate">
            {details}
          </p>
        )}
      </div>
    </div>
  );
}

function DocListCell({ docs, color }: { docs: DocRef[]; color: string }) {
  if (!docs?.length)
    return <span className="text-xs text-gray-300 font-bold">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {docs.slice(0, 3).map((d) => (
        <span
          key={d._id}
          className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md ${color}`}
        >
          <FileText className="w-3 h-3" /> {d.title}
        </span>
      ))}
      {docs.length > 3 && (
        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
          +{docs.length - 3}
        </span>
      )}
    </div>
  );
}

// ─── Column Definitions Bound to Schema ───────────────────────────────────────

const columns: ColumnDef<PositionResponseData>[] = [
  {
    header: "Position",
    accessor: (row) => <PositionCell title={row.title} details={row.details} />,
  },
  {
    header: "Required Docs",
    accessor: (row) => (
      <DocListCell
        docs={row.requiredDocuments}
        color="text-[#0054a6] bg-blue-50"
      />
    ),
  },
  {
    header: "Mandatory Docs",
    accessor: (row) => (
      <DocListCell
        docs={row.mandatoryDocuments}
        color="text-[#fc7728] bg-orange-50"
      />
    ),
  },
];

const PAGE_SIZE = 10;

// ─── Component ────────────────────────────────────────────────────────────────

const PositionsList = () => {
  const navigate = useNavigate();

  const [positions, setPositions] = useState<PositionResponseData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const fetchPositions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(PAGE_SIZE),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      };
      const res = await getPositionsApi(params);
      setPositions(res?.data?.data ?? []);
      setTotalCount(res?.data?.pagination?.total ?? 0);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load positions.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const handleEdit = (pos: PositionResponseData) =>
    navigate(`/positions/edit/${pos._id}`);

  const handleDelete = async (pos: PositionResponseData) => {
    const confirmed = await confirmToast(`Delete "${pos.title}"?`);
    if (!confirmed) return;
    try {
      await deletePositionApi(pos._id);
      setPositions((prev) => prev.filter((p) => p._id !== pos._id));
      setTotalCount((c) => c - 1);
      toast.success("Position deleted.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete.");
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-red-500 font-bold text-sm">{error}</p>
        <button
          type="button"
          onClick={fetchPositions}
          className="px-5 py-2.5 bg-[#0D80F2] text-white text-sm font-bold rounded-xl hover:scale-[1.02] transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <CustomTable<PositionResponseData>
      title="Positions"
      subtitle="Manage job positions and their document requirements."
      addLabel="Add Position"
      onAdd={() => navigate("/positions/add")}
      columns={columns}
      data={positions}
      totalCount={totalCount}
      currentPage={page}
      pageSize={PAGE_SIZE}
      onPageChange={setPage}
      searchValue={search}
      onSearchChange={handleSearch}
      rowActions={defaultRowActions(handleEdit, handleDelete)}
      loading={loading}
      emptyMessage="No positions found."
    />
  );
};

export default PositionsList;
