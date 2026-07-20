import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getExternalSourcesApi, deleteExternalSourceApi } from "../../service/apis/externalSource.api";
import type { ExternalSource } from "../../types/responses/externalSource/externalSource.responses";

export type SourceType = "pca" | "pcra" | "institute";

export const useExternalSources = () => {
    const [activeType, setActiveType] = useState<SourceType>("pca");
    const [sources, setSources] = useState<ExternalSource[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const fetchSources = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getExternalSourcesApi({ type: activeType, page, limit: 10 });
            if (res.data?.success && res.data.data) {
                setSources(res.data.data.data);
                setTotalPages(res.data.data.pagination.totalPages);
            } else {
                setSources([]);
            }
        } catch (error) {
            toast.error("Failed to fetch external sources");
        } finally {
            setLoading(false);
        }
    }, [activeType, page]);

    useEffect(() => {
        fetchSources();
    }, [fetchSources]);

    const handleTypeChange = (type: SourceType) => {
        setActiveType(type);
        setPage(1);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this source?")) return;

        try {
            const res = await deleteExternalSourceApi(id);
            if (res.data?.success) {
                toast.success("Source deleted successfully");
                fetchSources();
            }
        } catch (error) {
            toast.error("Failed to delete source");
        }
    };

    return {
        activeType,
        handleTypeChange,
        sources,
        loading,
        page,
        setPage,
        totalPages,
        handleDelete,
        refreshList: fetchSources,
    };
};