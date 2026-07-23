
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  type ColumnDef, type FilterConfig,
} from "../../components/UI/customTable/CustomTable";
import { getBranchesApi } from "../../service/apis/branch.api";
import useDebounce from "../../utils/useDebounce";
import type { BranchResponseData } from "../../types/responses/branch/branch.responses";

export const useBranchList = ({ columns }: { columns: ColumnDef<BranchResponseData>[] }) => {

  const navigate = useNavigate();

  const [branches, setBranches] = useState<BranchResponseData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400);


  // ─── Filter config ────────────────────────────────────────────────────────────

  const filterConfigs: FilterConfig[] = [
    {
      key: "timeZone",
      placeholder: "All Timezones",
      options: [
        { label: "Asia / Kolkata", value: "Asia/Kolkata" },
        { label: "Asia / Kathmandu", value: "Asia/Kathmandu" },
        { label: "Asia / Dubai", value: "Asia/Dubai" },
      ],
    },
  ];

  const PAGE_SIZE = 10;
  const handleSearch = (value: string) => { setSearch(value); setPage(1); };
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value === "all" ? "" : value }));
    setPage(1);
  };

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(PAGE_SIZE),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
      };
      const res = await getBranchesApi(params);
      setBranches(res?.data?.data ?? []);
      setTotalCount(res?.data?.pagination?.total ?? 0);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load branches.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters]);

  useEffect(() => { fetchBranches(); }, [fetchBranches]);

  const handleEdit = (branch: BranchResponseData) => navigate(`/branches/edit/${branch._id}`);


  return { error, fetchBranches, navigate, columns, branches, totalCount, page, PAGE_SIZE, setPage, search, handleSearch, filters, handleFilterChange, filterConfigs, loading, handleEdit };
};