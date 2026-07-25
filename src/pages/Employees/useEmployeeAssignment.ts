import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    getAssignmentsApi,
    deleteAssignmentApi,
} from "../../service/apis/assignment.api";
import { confirmToast } from "../../utils/confirmToast";
import useDebounce from "../../utils/useDebounce";


import type { AssignmentPayload } from "../../types/payloads/assignment/assignment.payloads";
import type { AssignmentResponseData } from "../../types/responses/assignment/assignment.responses";

export const PAGE_SIZE = 10;
import { type ApiErrorResponse } from "../../types/responses/errorResponse/error.response";

export type AssignmentFilterState = Partial<
    Record<keyof AssignmentPayload | "search" | "role", string>
>;

export const useEmployeeAssignment = () => {
    const navigate = useNavigate();

    const [assignments, setAssignments] = useState<AssignmentResponseData[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");
    const [filters, setFilters] = useState<AssignmentFilterState>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearch = useDebounce(search, 400);

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value === "all" ? "" : value }));
        setPage(1);
    };


    const fetchAssignments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([, v]) => Boolean(v))
            ) as Record<string, string>;

            const params: Record<string, string> = {
                page: String(page),
                limit: String(PAGE_SIZE),
                ...(debouncedSearch ? { search: debouncedSearch } : {}),
                ...activeFilters,
            };

            const res = await getAssignmentsApi(params);
            setAssignments(res?.data?.data ?? []);
            setTotalCount(res?.data?.pagination?.total ?? 0);
        } catch (err: unknown) {
            const errorObj = err as ApiErrorResponse;
            setError(
                errorObj?.response?.data?.message ?? "Failed to load assignments."
            );
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, filters]);

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);


    const handleDelete = async (assignment: AssignmentResponseData) => {
        const confirmed = await confirmToast("Remove this assignment?");
        if (!confirmed) return;
        try {
            await deleteAssignmentApi(assignment._id);
            setAssignments((prev) => prev.filter((a) => a._id !== assignment._id));
            setTotalCount((c) => c - 1);
            toast.success("Assignment removed.");
        } catch (err: unknown) {
            const errorObj = err as ApiErrorResponse;
            toast.error(
                errorObj?.response?.data?.message ?? "Failed to delete assignment."
            );
        }
    };

    const handleAdd = () => navigate("/employees/add");

    return {
        assignments,
        totalCount,
        page,
        setPage,
        search,
        handleSearch,
        filters,
        handleFilterChange,
        loading,
        error,
        fetchAssignments,
        handleDelete,
        handleAdd,
    };
};