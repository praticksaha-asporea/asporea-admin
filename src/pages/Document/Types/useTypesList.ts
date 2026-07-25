import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    getDocumentTypesApi,
    deleteDocumentTypeApi,
} from "../../../service/apis/documentType.api";
import useDebounce from "../../../utils/useDebounce";
import { confirmToast } from "../../../utils/confirmToast";
import type { DocumentTypePayload } from "../../../types/payloads/document/documentType.payloads";
import type { DocumentTypeResponseData } from "../../../types/responses/document/documentType.responses";
import { type ApiErrorResponse } from "../../../types/responses/errorResponse/error.response";
export const PAGE_SIZE = 10;
 
interface DocumentTypePaginatedBackendData {
    types?: DocumentTypeResponseData[];
    pagination?: {
        total: number;
    };
}


export type DocumentTypeFilterState = Partial<
    Record<keyof DocumentTypePayload | "search", string>
>;

export const useTypesList = () => {
    const navigate = useNavigate();

    const [types, setTypes] = useState<DocumentTypeResponseData[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");
    const [filters, setFilters] = useState<DocumentTypeFilterState>({});
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


    const fetchTypes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([, value]) => Boolean(value))
            ) as Record<string, string>;

            const params: Record<string, string> = {
                page: String(page),
                limit: String(PAGE_SIZE),
                ...(debouncedSearch ? { search: debouncedSearch } : {}),
                ...activeFilters,
            };

            const res = await getDocumentTypesApi(params);
            const backendData = res?.data as unknown as DocumentTypePaginatedBackendData;

            setTypes(backendData?.types ?? []);
            setTotalCount(backendData?.pagination?.total ?? 0);
        } catch (err: unknown) {
            const errorObj = err as ApiErrorResponse;
            setError(
                errorObj?.response?.data?.message ?? "Failed to load document types."
            );
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, filters]);

    useEffect(() => {
        fetchTypes();
    }, [fetchTypes]);


    const handleEdit = (type: DocumentTypeResponseData) =>
        navigate(`/document-types/edit/${type._id}`);

    const handleDelete = async (type: DocumentTypeResponseData) => {
        const confirmed = await confirmToast(`Delete "${type.title}"?`);
        if (!confirmed) return;
        try {
            await deleteDocumentTypeApi(type._id);
            setTypes((prev) => prev.filter((t) => t._id !== type._id));
            setTotalCount((c) => c - 1);
            toast.success("Document type deleted.");
        } catch (err: unknown) {
            const errorObj = err as ApiErrorResponse;
            toast.error(errorObj?.response?.data?.message ?? "Failed to delete.");
        }
    };

    const handleAdd = () => navigate("/document-types/add");

    return {
        types,
        totalCount,
        page,
        setPage,
        search,
        handleSearch,
        filters,
        handleFilterChange,
        loading,
        error,
        fetchTypes,
        handleEdit,
        handleDelete,
        handleAdd,
    };
};