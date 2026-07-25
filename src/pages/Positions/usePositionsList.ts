import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    getPositionsApi,
    deletePositionApi,
} from "../../service/apis/position.api";
import useDebounce from "../../utils/useDebounce";
import { confirmToast } from "../../utils/confirmToast";
import type { PositionPayload } from "../../types/payloads/position/position.payloads";
import type { PositionResponseData } from "../../types/responses/position/position.responses";
import type { ApiErrorResponse } from "../../types/responses/errorResponse/error.response";
export const PAGE_SIZE = 10;
export type PositionFilterState = Partial<
    Record<keyof PositionPayload | "search", string>
>;

export const usePositionsList = () => {
    const navigate = useNavigate();

    const [positions, setPositions] = useState<PositionResponseData[]>([]);
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

    const fetchPositions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params: Record<string, string> = {
                page: String(page),
                limit: String(PAGE_SIZE),
                ...(debouncedSearch ? { search: debouncedSearch } : {}),
            };

            const res = await getPositionsApi(params);
            setPositions(res?.data?.data ?? []);
            setTotalCount(res?.data?.pagination?.total ?? 0);
        } catch (err: unknown) {
            const errorObj = err as ApiErrorResponse;
            setError(
                errorObj?.response?.data?.message ?? "Failed to load positions."
            );
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => {
        fetchPositions();
    }, [fetchPositions]);


    const handleEdit = (pos: PositionResponseData) =>
        navigate(`/positions/edit/${pos._id}`);

    const handleDelete = async (pos: PositionResponseData) => {
        const confirmed = await confirmToast(`Delete "${pos.title}"?`);
        if (!confirmed) return;
        try {
            await deletePositionApi(pos._id);
            setPositions((prev) => prev.filter((p) => p._id !== pos._id));
            setTotalCount((c) => c - 1);
            toast.success("Position deleted.");
        } catch (err: unknown) {
            const errorObj = err as ApiErrorResponse;
            toast.error(errorObj?.response?.data?.message ?? "Failed to delete.");
        }
    };

    const handleAdd = () => navigate("/positions/add");

    return {
        positions,
        totalCount,
        page,
        setPage,
        search,
        handleSearch,
        loading,
        error,
        fetchPositions,
        handleEdit,
        handleDelete,
        handleAdd,
    };
};