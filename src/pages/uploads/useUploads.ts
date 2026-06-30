import { useState, useEffect } from "react";
import { getUploadsListApi } from "../../service/apis/upload.api";
import { toast } from "react-hot-toast";

export const useUploads = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>("");

  const fetchUploads = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 12 };
      if (roleFilter) params.role = roleFilter;

      console.log("--- 1. FIRING API WITH PARAMS ---", params);
      const res = await getUploadsListApi(params);

      console.log("--- 2. RAW API RESPONSE IN HOOK ---", res);

      const responseData = res?.data || res;
      console.log("--- 3. UNWRAPPED RESPONSE DATA ---", responseData);

      if (responseData?.success !== false) {
        const finalArray = responseData?.data?.data || responseData?.data || [];
        const pages =
          responseData?.data?.pagination?.totalPages ||
          responseData?.pagination?.totalPages ||
          1;

        console.log("--- 4. FINAL ARRAY SETTING TO STATE ---", finalArray);
        console.log("--- 5. TOTAL PAGES SETTING TO STATE ---", pages);

        setData(finalArray);
        setTotalPages(pages);
      } else {
        console.warn("--- BACKEND RETURNED SUCCESS FALSE ---", responseData);
        toast.error(responseData?.message || "Failed to fetch uploads");
      }
    } catch (error) {
      console.error("--- ❌ CRITICAL API FETCH ERROR IN HOOK ---", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
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
