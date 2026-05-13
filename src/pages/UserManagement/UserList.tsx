import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CustomTable, {
  UserCell,
  RoleBadge,
  StatusBadge,
  defaultRowActions,
  type ColumnDef,
  type FilterConfig,
} from "../../components/UI/customTable/CustomTable";
import { getUsersApi } from "../../service/apis/user.api";//,deleteUserApi

// ─── Types ────────────────────────────────────────────────────────────────────

type User = {
  _id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
};

// ─── Column definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<User>[] = [
  {
    header: "User Details",
    accessor: (row) => (
      <UserCell firstName={row.firstName} lastName={row.lastName} email={row.email} />
    ),
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
      <span className="text-sm text-gray-500 font-medium">{new Date(row.createdAt).toLocaleTimeString() }<br/>{new Date(row.createdAt).toLocaleDateString() }</span>
    ),
  },
];

// ─── Filter config ────────────────────────────────────────────────────────────

const filters: FilterConfig[] = [
  {
    key: "role",
    placeholder: "All Roles",
    options: [
      { label: "Admin",       value: "admin" },
      { label: "User",        value: "user" },
      { label: "TAC",         value: "tac" },
      { label: "TAC Head",    value: "tac_head" },
      { label: "Reception",   value: "reception" },
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

// ─── Component ────────────────────────────────────────────────────────────────

const UserList = () => {
  const navigate = useNavigate();

  const [users, setUsers]     = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsersApi();
      // console.log(data.data.data,66666);
      
      setUsers(data?.data?.data ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    // console.log(user);
    
  }, [fetchUsers]);

  // ── Actions ────────────────────────────────────────────────────────────────
  // const handleDelete = async (user: User) => {
  //   if (!window.confirm(`Delete ${user.firstName} ${user.lastName}?`)) return;
  //   try {
  //     await deleteUserApi(user.id);
  //     setUsers((prev) => prev.filter((u) => u.id !== user.id));
  //   } catch (err: any) {
  //     alert(err?.response?.data?.message ?? "Failed to delete user.");
  //   }
  // };

  const handleEdit = (user: User) => {
    navigate(`/users/edit/${user._id}`);
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded-xl" />
        <div className="h-14 bg-gray-100 rounded-2xl" />
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 px-6 py-4 border-b border-gray-50">
              <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 bg-gray-200 rounded" />
                <div className="h-3 w-56 bg-gray-100 rounded" />
              </div>
              <div className="h-3 w-20 bg-gray-200 rounded self-center" />
              <div className="h-3 w-16 bg-gray-200 rounded self-center" />
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
          onClick={fetchUsers}
          className="px-5 py-2.5 bg-[#0D80F2] text-white text-sm font-bold rounded-xl hover:scale-[1.02] transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Table ──────────────────────────────────────────────────────────────────
  return (
    <CustomTable<User>
      title="User Management"
      subtitle="Manage your team members and their account permissions."
      addLabel="Add New User"
      onAdd={() => navigate("/users/add")}
      columns={columns}
      data={users}
      searchKeys={["firstName", "lastName", "email"]}
      filters={filters}
      rowActions={defaultRowActions(handleEdit)}//, handleDelete
      pageSize={2}
      emptyMessage="No users found matching your search / filter."
    />
  );
};

export default UserList;
