import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Sun, Moon } from "lucide-react";
import CustomTable, {
  defaultRowActions,
  type ColumnDef,
} from "../../components/UI/customTable/CustomTable";
import { getShiftsApi, deleteShiftApi, type ScheduleObj } from "../../service/apis/shift.api";
import useDebounce from "../../utils/useDebounce";
import { toast } from "react-hot-toast";
import { confirmToast } from "../../utils/confirmToast";

// ─── Types ────────────────────────────────────────────────────────────────────

type Shift = {
  _id: string;
  shiftName: string;
  schedules: ScheduleObj[];
};

// ─── Cell renderers ───────────────────────────────────────────────────────────

function ShiftNameCell({ shiftName, schedules }: { shiftName: string; schedules: ScheduleObj[] }) {
  const firstTime = schedules?.[0]?.startTime ?? "";
  const isNight = Number(firstTime.split(":")[0]) >= 17;
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isNight ? "bg-indigo-50 text-indigo-500" : "bg-[#0D80F2] text-white"}`}>
        {isNight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">{shiftName}</p>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">{schedules?.length ?? 0} rule(s)</p>
      </div>
    </div>
  );
}

function SchedulesCell({ schedules }: { schedules: ScheduleObj[] }) {
  if (!schedules?.length) return <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Incomplete</span>;
  return (
    <div className="space-y-1.5">
      {schedules.map((sch, i) => (
        <div key={i} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl w-fit">
          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="text-xs font-black text-gray-700">{sch.startTime} → {sch.endTime}</span>
          <span className="text-[10px] font-bold text-[#fc7728] bg-orange-50 px-2 py-0.5 rounded-md">
            {sch.days.slice(0, 3).join(", ")}{sch.days.length > 3 ? ` +${sch.days.length - 3}` : ""}
          </span>
        </div>
      ))}
    </div>
  );
}

function BreakCell({ schedules }: { schedules: ScheduleObj[] }) {
  const breaks = [...new Set(schedules?.map((s) => s.breakTime || "None"))];
  return (
    <div className="flex flex-wrap gap-1">
      {breaks.map((b) => (
        <span key={b} className="text-xs font-bold text-[#0D80F2] bg-blue-50 px-2 py-1 rounded-md">{b}</span>
      ))}
    </div>
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<Shift>[] = [
  { header: "Shift",     accessor: (row) => <ShiftNameCell shiftName={row.shiftName} schedules={row.schedules} /> },
  { header: "Schedules", accessor: (row) => <SchedulesCell schedules={row.schedules} /> },
  { header: "Break",     accessor: (row) => <BreakCell schedules={row.schedules} /> },
];

const PAGE_SIZE = 2;

// ─── Component ────────────────────────────────────────────────────────────────

const ShiftList = () => {
  const navigate = useNavigate();

  const [shifts, setShifts]         = useState<Shift[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState("");
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const handleSearch = (value: string) => { setSearch(value); setPage(1); };

  const fetchShifts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(PAGE_SIZE),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      };
      const res = await getShiftsApi(params);
      setShifts(res?.data?.data ?? []);
      setTotalCount(res?.data?.pagination?.total ?? 0);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load shifts.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchShifts(); }, [fetchShifts]);

  const handleEdit   = (shift: Shift) => navigate(`/shifts/edit/${shift._id}`);
  const handleDelete = async (shift: Shift) => {
    const confirmed = await confirmToast(`Delete shift "${shift.shiftName}"?`);
    if (!confirmed) return;
    console.log(confirmed,555);
    
    try {
      const res=await deleteShiftApi(shift._id);
      setShifts((prev) => prev.filter((s) => s._id !== shift._id));
      setTotalCount((c) => c - 1);
      // console.log(res,58);
      
      toast.success(res?.message);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete shift.");
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-red-500 font-bold text-sm">{error}</p>
        <button onClick={fetchShifts} className="px-5 py-2.5 bg-[#0D80F2] text-white text-sm font-bold rounded-xl hover:scale-[1.02] transition-all">Retry</button>
      </div>
    );
  }

  return (
    <CustomTable<Shift>
      title="Shift Schedules"
      subtitle="Configure multi-day working hours and breaks."
      addLabel="Add Shift"
      onAdd={() => navigate("/shifts/add")}
      columns={columns}
      data={shifts}
      totalCount={totalCount}
      currentPage={page}
      pageSize={PAGE_SIZE}
      onPageChange={setPage}
      searchValue={search}
      onSearchChange={handleSearch}
      rowActions={defaultRowActions(handleEdit, handleDelete)}
      loading={loading}
      emptyMessage="No shift configurations found."
    />
  );
};

export default ShiftList;
