import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CustomTable, {
  UserCell, RoleBadge, StatusBadge,
  defaultRowActions,
  type ColumnDef, type FilterConfig,
} from "../../components/UI/customTable/CustomTable";
import { getUsersApi } from "../../service/apis/user.api";
import useDebounce from "../../utils/useDebounce";

// ─── Types ────────────────────────────────────────────────────────────────────

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

// ─── Column definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<User>[] = [
  {
    header: "User Details",
    accessor: (row) => <UserCell firstName={row.firstName} lastName={row.lastName} email={row.email} />,
  },
  {
    header: "Role",
    accessor: (row) => <RoleBadge role={row.role} />,
  },
  {
    header: "Status",
    accessor: (row) => <StatusBadge status={row.status} />,
  },
  {
    header: "Joined Date",
    accessor: (row) => (
      <span className="text-sm text-gray-500 font-medium">
        {new Date(row.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
      </span>
    ),
  },
];

// ─── Filter config ────────────────────────────────────────────────────────────

const filterConfigs: FilterConfig[] = [
  {
    key: "role",
    placeholder: "All Roles",
    options: [
      { label: "Admin",       value: "admin" },
      { label: "User",        value: "user" },
      { label: "TAC",         value: "tac" },
      { label: "TAC Head",    value: "tac_head" },
      { label: "Foe",         value: "foe" },
      { label: "Finance",     value: "finance" },
      { label: "Coordinator", value: "coordinator" },
      { label: "PCA",         value: "pca" },
      { label: "Sub PCA",     value: "sub_pca" },
      { label: "PCRA",        value: "pcra" },
      { label: "Institute",   value: "institute" },
      { label: "Branch Head", value: "branch_head" },
    ],
  },
  {
    key: "status",
    placeholder: "All Statuses",
    options: [
      { label: "Active",   value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Deleted",  value: "deleted" },
    ],
  },
];

const PAGE_SIZE = 10;

// ─── Component ────────────────────────────────────────────────────────────────

const UserList = () => {
  const navigate = useNavigate();

  const [users, setUsers]           = useState<User[]>([]);
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

  // ── Fetch — depends on debounced search, not raw input ────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(PAGE_SIZE),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
      };
      const res = await getUsersApi(params);
      setUsers(res?.data?.data ?? []);
      setTotalCount(res?.data?.pagination?.total ?? 0);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleEdit = (user: User) => navigate(`/users/edit/${user._id}`);

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-red-500 font-bold text-sm">{error}</p>
        <button onClick={fetchUsers} className="px-5 py-2.5 bg-[#0D80F2] text-white text-sm font-bold rounded-xl hover:scale-[1.02] transition-all">
          Retry
        </button>
      </div>
    );
  }

  return (
    <CustomTable<User>
      title="User Management"
      subtitle="Manage your team members and their account permissions."
      addLabel="Add New User"
      onAdd={() => navigate("/users/add")}
      columns={columns}
      data={users}
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
      emptyMessage="No users found matching your search / filter."
    />
  );
};

export default UserList;
