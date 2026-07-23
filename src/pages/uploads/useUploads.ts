import { useState, useEffect } from "react";
import { getUploadsListApi } from "../../service/apis/upload.api";
import { getUsersApi } from "../../service/apis/user.api";
import useDebounce from "../../utils/useDebounce";  
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
  const [userIdFilter, setUserIdFilter] = useState<string>("");
  const [roleUsers, setRoleUsers] = useState<any[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState<string>("");
  const [usersLoading, setUsersLoading] = useState<boolean>(false);

  const debouncedUserSearch = useDebounce(userSearchTerm, 400);
useEffect(() => {
    if (roleFilter) {
      setUsersLoading(true);
      
      const params: Record<string, string> = {
        role: roleFilter,
        limit: "10",  
      };

      if (debouncedUserSearch.trim()) {
        params.search = debouncedUserSearch.trim();  
      }

      getUsersApi(params)
        .then((res: any) => {
          const userList = res?.data?.data ?? res?.data ?? [];
          setRoleUsers(Array.isArray(userList) ? userList : []);
        })
        .catch((err) => {
          console.error("User list fetch error:", err);
          setRoleUsers([]);
        })
        .finally(() => {
          setUsersLoading(false);
        });
    } else {
      setRoleUsers([]);
      setUserIdFilter(""); 
      setUserSearchTerm("");
    }
  }, [roleFilter, debouncedUserSearch]);
  const fetchUploads = async () => {
    setLoading(true);
    try {
       
      const params: UploadListParams = {
        page: String(page), limit: "12",
        userId: ""
      };
      if (roleFilter) params.role = roleFilter;
      if (userIdFilter) params.userId = userIdFilter;
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
      console.error(error)    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
     
  }, [page, roleFilter,userIdFilter]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
    setUserIdFilter("");
    setUserSearchTerm("");
    setPage(1);
  };

  const handleUserChange = (val:string) => {
    setUserIdFilter(val);
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
    userIdFilter,
    handleUserChange,
    roleUsers,
    usersLoading,
    setUserSearchTerm,
    fetchUploads,
  };
};