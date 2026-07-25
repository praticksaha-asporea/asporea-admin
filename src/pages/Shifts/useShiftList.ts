import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getShiftsApi, deleteShiftApi } from "../../service/apis/shift.api";
import useDebounce from "../../utils/useDebounce";
import { confirmToast } from "../../utils/confirmToast";
import type { ShiftPayload } from "../../types/payloads/shift/shift.payloads";
import type { ShiftResponseData } from "../../types/responses/shift/shift.responses";
import type { ApiErrorResponse } from "../../types/responses/errorResponse/error.response";
export const PAGE_SIZE = 10;
 
export type ShiftFilterState = Partial<
  Record<keyof ShiftPayload | "search", string>
>;

export const useShiftList = () => {
  const navigate = useNavigate();

  const [shifts, setShifts] = useState<ShiftResponseData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  // ── Fetch Operations ───────────────────────────────────────────────────────
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
    } catch (err: unknown) {
      const errorObj = err as ApiErrorResponse;
      setError(
        errorObj?.response?.data?.message ?? "Failed to load shifts."
      );
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleEdit = (shift: ShiftResponseData) =>
    navigate(`/shifts/edit/${shift._id}`);

  const handleDelete = async (shift: ShiftResponseData) => {
    const confirmed = await confirmToast(`Delete shift "${shift.shiftName}"?`);
    if (!confirmed) return;

    try {
      const res = await deleteShiftApi(shift._id);
      setShifts((prev) => prev.filter((s) => s._id !== shift._id));
      setTotalCount((c) => c - 1);
      toast.success(res?.message || "Shift deleted successfully");
    } catch (err: unknown) {
      const errorObj = err as ApiErrorResponse;
      toast.error(
        errorObj?.response?.data?.message ?? "Failed to delete shift."
      );
    }
  };

  const handleAdd = () => navigate("/shifts/add");

  return {
    shifts,
    totalCount,
    page,
    setPage,
    search,
    handleSearch,
    loading,
    error,
    fetchShifts,
    handleEdit,
    handleDelete,
    handleAdd,
  };
};