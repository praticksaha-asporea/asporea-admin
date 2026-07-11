import { useState, useEffect } from "react";
import { getUploadsListApi } from "../../service/apis/upload.api";
import { toast } from "react-hot-toast";

// Centralized Type Imports
import type { UploadResponseData } from "../../types/responses/upload/upload.responses";
import type { UploadListParams } from "../../types/payloads/upload/upload.payloads";

export const useUploads = () => {
  const [data, setData] = useState<UploadResponseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [roleFilter, setRoleFilter] = useState<string>("");

  const fetchUploads = async () => {
    setLoading(true);
    try {
      // Strictly typed query payload mapping
      const params: UploadListParams = { page: String(page), limit: "12" };
      if (roleFilter) params.role = roleFilter;

      const res = await getUploadsListApi(params);
      const responseData = res?.data;

      if (res?.success !== false && responseData) {
         
        const dynamicData = responseData as any;
        const finalArray: UploadResponseData[] = dynamicData?.data ?? dynamicData?.types ?? [];
        const pages: number = dynamicData?.pagination?.totalPages ?? 1;

        setData(finalArray);
        setTotalPages(pages);
      } else {
        toast.error(res?.message ?? "Failed to fetch uploads");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Something went wrong while loading uploads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roleFilter]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
    setPage(1);
  };

  return {
    data,
    loading,
    page,
    setPage,
    totalPages,
    roleFilter,
    handleRoleChange,
    fetchUploads,
  };
};