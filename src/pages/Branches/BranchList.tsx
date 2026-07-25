import { Building2, MapPin } from "lucide-react";
import CustomTable, {
  defaultRowActions,
  StatusBadge,
  type ColumnDef
} from "../../components/UI/customTable/CustomTable";
import type { BranchResponseData } from "../../types/responses/branch/branch.responses";
import { useBranchList } from "./useBranchList";

function BranchCell({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3" >
      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-[#0054a6] border border-blue-100/50 shrink-0" >
        <Building2 className="w-5 h-5" />
      </div>
      <p className="text-sm font-bold text-gray-800" > {title} </p>
    </div>
  );
}


function LocationCell({ location, timeZone }: { location: string; timeZone: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-sm font-bold text-gray-600" >
        <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
        <span className="truncate max-w-40" > {location} </span>
      </div>
      < p className="text-xs text-gray-400 font-medium mt-1 pl-5" > {timeZone} </p>
    </div>
  );
}

function WorkDaysCell({ workDays }: { workDays: string[] }) {
  return (
    <div className="flex items-center gap-1 flex-wrap" >
      {
        workDays.slice(0, 3).map((day) => (
          <span key={day} className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md uppercase" > {day} </span>
        ))
      }
      {
        workDays.length > 3 && (
          <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md" > +{workDays.length - 3} </span>
        )
      }
    </div>
  );
}

const BranchList = () => {

  // ─── Column definitions ───────────────────────────────────────────────────────

  const columns: ColumnDef<BranchResponseData>[] = [
    { header: "Branch", accessor: (row) => <BranchCell title={row.title} /> },
    { header: "Location & Timezone", accessor: (row) => <LocationCell location={row.location} timeZone={row.timeZone} /> },
    { header: "Counters", accessor: (row) => <span className="text-lg font-black text-gray-700 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100" > {row.counters ?? 0} </span> },
    { header: "Work Days", accessor: (row) => <WorkDaysCell workDays={row.workDays ?? []} /> },
    { header: "Status", accessor: (row) => <StatusBadge status={row.status !== false ? "active" : "inactive"} /> },
  ];

  const { error, fetchBranches, navigate, branches, totalCount, page, PAGE_SIZE, setPage, search, handleSearch, filters, handleFilterChange, filterConfigs, loading, handleEdit } = useBranchList({ columns });
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