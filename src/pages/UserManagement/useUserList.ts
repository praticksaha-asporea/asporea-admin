import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  type FilterConfig,
} from "../../components/UI/customTable/CustomTable";
import { getUsersApi } from "../../service/apis/user.api";
import useDebounce from "../../utils/useDebounce";
import type { UserResponseData } from "../../types/responses/user/user.responses";
 
const filterConfigs: FilterConfig[] = [
  {
    key: "role",
    placeholder: "All Roles",
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
      { label: "TAC", value: "tac" },
      { label: "TAC Head", value: "tac_head" },
      { label: "Foe", value: "foe" },
      { label: "Finance", value: "finance" },
      { label: "Coordinator", value: "coordinator" },
      { label: "Branch Head", value: "branch_head" },
    ],
  },
  {
    key: "status",
    placeholder: "All Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Deleted", value: "deleted" },
    ],
  },
];

const PAGE_SIZE = 10;

// ─── Custom Hook ─────────────────────────────────────────────────────────────
export const useUserList = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserResponseData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const handleSearch = (value: string) => { setSearch(value); setPage(1); };
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value === "all" ? "" : value }));
    setPage(1);
  };

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

  const handleEdit = (user: UserResponseData) => navigate(`/users/edit/${user._id}`);

  return { error, fetchUsers, users, totalCount, page, PAGE_SIZE, setPage, search, handleSearch, filters, handleFilterChange, filterConfigs, handleEdit, loading, navigate };
};