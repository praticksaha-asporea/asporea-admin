
import CustomTable, {
  UserCell, RoleBadge, StatusBadge,
  defaultRowActions,
  type ColumnDef,
} from "../../components/UI/customTable/CustomTable";

// Centralized Response Imports
import type { UserResponseData } from "../../types/responses/user/user.responses";
import { useUserList } from "./useUserList";

// ─── Column definitions ───────────────────────────────────────────────────────
const columns: ColumnDef<UserResponseData>[] = [
  {
    header: "User Details",
    accessor: (row) => <UserCell firstName={row.firstName} lastName={row.lastName} email={row.email} profilePic={row.profilePic} />,
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

// ─── Component ────────────────────────────────────────────────────────────────
const UserList = () => {
  const { error, fetchUsers, users, totalCount, page, PAGE_SIZE, setPage, search, handleSearch, filters, handleFilterChange, filterConfigs, handleEdit, loading, navigate } = useUserList();

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
    <CustomTable<UserResponseData>

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