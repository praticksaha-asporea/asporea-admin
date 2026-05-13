import { useState, useMemo } from "react";
import { Search, Filter, Plus, Edit2, Trash2, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterConfig = {
  /** key in the row data to filter against */
  key: string;
  placeholder: string;
  options: FilterOption[];
};

export type ColumnDef<T> = {
  header: string;
  /** key of T or a render function */
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
};

export type RowAction<T> = {
  icon: React.ReactNode;
  label: string;
  onClick: (row: T) => void;
  colorClass?: string; // e.g. "hover:text-red-500 hover:bg-red-50"
};

interface CustomTableProps<T extends { _id: number | string }> {
  /** Page / section title */
  title: string;
  /** Subtitle below the title */
  subtitle?: string;
  /** Label for the primary CTA button */
  addLabel?: string;
  /** Called when the CTA button is clicked */
  onAdd?: () => void;
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Full data array */
  data: T[];
  /** Keys of T to include in the text search */
  searchKeys?: (keyof T)[];
  /** Filter dropdowns to render */
  filters?: FilterConfig[];
  /** Row-level action buttons (edit, delete, etc.) */
  rowActions?: RowAction<T>[];
  /** Rows per page (default 10) */
  pageSize?: number;
  /** Empty state message */
  emptyMessage?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCellValue<T>(row: T, accessor: ColumnDef<T>["accessor"]): React.ReactNode {
  if (typeof accessor === "function") return accessor(row);
  const val = row[accessor as keyof T];
  // console.log(val,251);
  
  return val as React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

function CustomTable<T extends { _id: number | string }>({
  title,
  subtitle,
  addLabel = "Add New",
  onAdd,
  columns,
  data,
  searchKeys = [],
  filters = [],
  rowActions = [],
  pageSize = 10,
  emptyMessage = "No records found matching your search / filter.",
}: CustomTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(filters.map((f) => [f.key, "all"]))
  );
  const [currentPage, setCurrentPage] = useState(1);

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    // console.log(data);
    
    return data.filter((row) => {
      // text search
      const matchesSearch =
        searchKeys.length === 0 ||
        searchKeys.some((key) => {
          const val = row[key];
          return String(val ?? "").toLowerCase().includes(searchTerm.toLowerCase());
        });

      // dropdown filters
      const matchesFilters = filters.every((f) => {
        const selected = filterValues[f.key];
        if (!selected || selected === "all") return true;
        return String((row as any)[f.key] ?? "") === selected;
      });

      return matchesSearch && matchesFilters;
    });
    
  }, [data, searchTerm, filterValues, searchKeys, filters]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-widest text-gray-700">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-3 font-medium">{subtitle}</p>
          )}
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0D80F2] text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:scale-[1.02] transition-all whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            {addLabel}
          </button>
        )}
      </div>

      {/* Search + Filters bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent focus:bg-white focus:border-[#0D80F2]/30 border-2 rounded-xl outline-none text-sm transition-all"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">
            <Filter className="w-4 h-4" /> Filters
          </button> */}

          {filters.map((f) => (
            <select
              key={f.key}
              value={filterValues[f.key] ?? "all"}
              onChange={(e) => handleFilterChange(f.key, e.target.value)}
              className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm outline-none cursor-pointer"
            >
              <option value="all">{f.placeholder}</option>
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest ${col.className ?? ""}`}
                  >
                    {col.header}
                  </th>
                ))}
                {rowActions.length > 0 && (
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length > 0 ? (
                paginated.map((row, index) => (
                  <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                    {columns.map((col, i) => (
                      <td key={i} className={`px-6 py-4 ${col.className ?? ""}`}>
                        {getCellValue(row, col.accessor)}
                      </td>
                    ))}
                    {rowActions.length > 0 && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {rowActions.map((action, ai) => (
                            <button
                              key={ai}
                              title={action.label}
                              onClick={() => action.onClick(row)}
                              className={`p-2 text-gray-400 rounded-lg transition-all ${action.colorClass ?? "hover:bg-gray-100"}`}
                            >
                              {action.icon}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (rowActions.length > 0 ? 1 : 0)}
                    className="text-center py-10 text-gray-500 font-bold"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium">
              Showing {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    page === safePage
                      ? "bg-[#0D80F2] text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default CustomTable;

// ─── Pre-built cell renderers (optional helpers) ──────────────────────────────

/** Avatar + name + email cell */
export function UserCell({ firstName, lastName, email }: { firstName: string; lastName?: string; email: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-[#0054a6] font-bold text-sm uppercase">
        {firstName ? firstName.charAt(0) : "U"}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">{firstName} {lastName}</p>
        <p className="text-xs text-gray-500 font-medium">{email}</p>
      </div>
    </div>
  );
}

/** Role badge */
export function RoleBadge({ role }: { role: string }) {
  const label = role.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return (
    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-tighter">
      {label}
    </span>
  );
}

/** Active / inactive / deleted status dot */
export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { dot: string; text: string }> = {
    active:   { dot: "bg-green-500",  text: "text-green-600" },
    inactive: { dot: "bg-orange-400", text: "text-orange-500" },
    deleted:  { dot: "bg-red-500",    text: "text-red-600" },
  };
  const c = colors[status] ?? { dot: "bg-gray-400", text: "text-gray-500" };
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      <span className={`text-xs font-bold ${c.text} uppercase`}>{status}</span>
    </div>
  );
}

/** Standard edit / delete / more action set */
export function defaultRowActions<T>(
  onEdit: (row: T) => void,
  // onDelete: (row: T) => void
): RowAction<T>[] {
  return [
    {
      icon: <Edit2 className="w-4 h-4" />,
      label: "Edit",
      onClick: onEdit,
      colorClass: "hover:text-[#0D80F2] hover:bg-blue-50",
    },
    // {
    //   icon: <Trash2 className="w-4 h-4" />,
    //   label: "Delete",
    //   onClick: onDelete,
    //   colorClass: "hover:text-red-500 hover:bg-red-50",
    // },
    // {
    //   icon: <MoreVertical className="w-4 h-4" />,
    //   label: "More",
    //   onClick: () => {},
    //   colorClass: "hover:bg-gray-100",
    // },
  ];
}
