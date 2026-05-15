import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Building, Clock, Timer, Hash, Trash2 } from "lucide-react";
import CustomTable, {
  RoleBadge,
  type ColumnDef,
  type FilterConfig,
  type RowAction,
} from "../../components/UI/customTable/CustomTable";
import { getAssignmentsApi, deleteAssignmentApi } from "../../service/apis/assignment.api";

// ─── Types ────────────────────────────────────────────────────────────────────

type Assignment = {
  _id: string;
  employeeId: { _id: string; firstName: string; lastName: string, role: string } | string;
  branchId: { _id: string; title: string } | string;
  shiftId: { _id: string; shiftName: string } | string;
  effectiveFrom: string;
  minuteOfSlots: number;
  counterNo?: number;
  role: string;
};

// ─── Cell renderers ───────────────────────────────────────────────────────────

function EmployeeCell({ assignment }: { assignment: Assignment }) {

  const emp = assignment.employeeId;
  const name = typeof emp === "object"
    ? `${emp.firstName} ${emp.lastName}`
    : emp;
  const role = typeof emp === "object"
    ? `${emp.role}`
    : emp;
  return (
    <div>
      <p className="text-sm font-bold text-gray-800">{name}</p>
      <RoleBadge role={role} />
    </div>
  );
}

function LocationShiftCell({ assignment }: { assignment: Assignment }) {
  const branch = assignment.branchId;
  const shift = assignment.shiftId;
  const branchName = typeof branch === "object" ? branch.title : branch;
  const shiftName = typeof shift === "object" ? shift.shiftName : shift;
  return (
    <div className="space-y-1">
      <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
        <Building className="w-3.5 h-3.5 text-[#0054a6] shrink-0" /> {branchName}
      </p>
      <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-orange-400 shrink-0" /> {shiftName}
      </p>
    </div>
  );
}

function ConfigCell({ minuteOfSlots, counterNo }: { minuteOfSlots: number; counterNo?: number }) {
  return (
    <div className="flex gap-2">
      <span className="flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg border border-gray-200">
        <Timer className="w-3 h-3" /> {minuteOfSlots}m
      </span>

      {counterNo && (<span className="flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg border border-gray-200">
        <Hash className="w-3 h-3" /> C-{counterNo}
      </span>)}
    </div>
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<Assignment>[] = [
  {
    header: "Employee",
    accessor: (row) => <EmployeeCell assignment={row} />,
  },
  {
    header: "Location & Shift",
    accessor: (row) => <LocationShiftCell assignment={row} />,
  },
  {
    header: "Effective From",
    accessor: (row) => (
      <span className="text-sm text-gray-500 font-medium">
        {new Date(row.effectiveFrom).toLocaleDateString("en-GB", {
          day: "2-digit", month: "short", year: "numeric",
        })}
      </span>
    ),
  },
  {
    header: "Config",
    accessor: (row) => <ConfigCell minuteOfSlots={row.minuteOfSlots} counterNo={row.counterNo} />,
  }
];

// ─── Filter config ────────────────────────────────────────────────────────────

const filters: FilterConfig[] = [
  {
    key: "role",
    placeholder: "All Roles",
    options: [
      { label: "Admin", value: "admin" },
      { label: "TAC", value: "tac" },
      { label: "TAC Head", value: "tac_head" },
      { label: "Reception", value: "reception" },
      { label: "Finance", value: "finance" },
      { label: "Coordinator", value: "coordinator" },
      { label: "PCA", value: "pca" },
      { label: "Sub PCA", value: "sub_pca" },
      { label: "PCRA", value: "pcra" },
      { label: "Branch Head", value: "branch_head" },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const EmployeeAssignment = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAssignmentsApi();
      setAssignments(res?.data?.data ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load assignments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleDelete = async (assignment: Assignment) => {
    if (!window.confirm("Remove this assignment?")) return;
    try {
      await deleteAssignmentApi(assignment._id);
      setAssignments((prev) => prev.filter((a) => a._id !== assignment._id));
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to delete assignment.");
    }
  };

  const rowActions: RowAction<Assignment>[] = [
    {
      icon: <Trash2 className="w-4 h-4" />,
      label: "Delete",
      onClick: handleDelete,
      colorClass: "hover:text-red-500 hover:bg-red-50",
    },
  ];

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded-xl" />
        <div className="h-14 bg-gray-100 rounded-2xl" />
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 px-6 py-4 border-b border-gray-50">
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
              </div>
              <div className="h-3 w-32 bg-gray-200 rounded self-center" />
              <div className="h-3 w-20 bg-gray-200 rounded self-center" />
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
          onClick={fetchAssignments}
          className="px-5 py-2.5 bg-[#0D80F2] text-white text-sm font-bold rounded-xl hover:scale-[1.02] transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Table ──────────────────────────────────────────────────────────────────
  return (
    <CustomTable<Assignment>
      title="Employee Assignment"
      subtitle="Assign employees to branches and shifts."
      addLabel="New Assignment"
      onAdd={() => navigate("/employees/add")}
      columns={columns}
      data={assignments}
      searchKeys={["role"]}
      filters={filters}
      rowActions={rowActions}
      pageSize={10}
      emptyMessage="No assignments found. Add one to get started."
    />
  );
};

export default EmployeeAssignment;
