import { Briefcase, FileText } from "lucide-react";
import CustomTable, {
  defaultRowActions,
  type ColumnDef,
} from "../../components/UI/customTable/CustomTable";
import { usePositionsList, PAGE_SIZE } from "./usePositionsList";

import type {
  PositionResponseData,
  DocRef,
} from "../../types/responses/position/position.responses";

export function StatusBadge({ status }: { status: boolean }) {
  const config = {
    true: {
      label: "Active",
      dot: "bg-green-500",
      text: "text-green-600",
    },
    false: {
      label: "Inactive",
      dot: "bg-orange-400",
      text: "text-orange-500",
    },
  };

  const c = config[String(status) as "true" | "false"];

  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      <span className={`text-xs font-bold ${c.text} uppercase`}>
        {c.label}
      </span>
    </div>
  );
}

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
function DocListCell({ docs = [], color }: { docs?: DocRef[]; color: string }) {
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
    header: "Status",
    accessor: (row) => (
      <StatusBadge status={row.status} />
    ),
  },
];

const PositionsList = () => {
  const {
    positions,
    totalCount,
    page,
    setPage,
    search,
    handleSearch,
    loading,
    error,
    fetchPositions,
    handleEdit,
    handleDelete,
    handleAdd,
  } = usePositionsList();

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
      onAdd={handleAdd}
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
