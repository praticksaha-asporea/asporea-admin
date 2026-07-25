import { useState } from "react";
import { SearchableSelect } from "../../components/UI/SearchableSelect";

import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  FileText,
  ChevronLeft,
  ChevronRight,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useUploads } from "./useUploads";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { confirmToast } from "../../utils/confirmToast";
import { deleteUploadApi } from "../../service/apis/upload.api";

// Centralized Response and Ref Imports
import type { UploadResponseData, UploadUserRef } from "../../types/responses/upload/upload.responses";

const Uploads = () => {
  const {
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
    fetchUploads
  } = useUploads();

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  let BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
  if (!BACKEND_BASE_URL || BACKEND_BASE_URL === "undefined") {
    BACKEND_BASE_URL = "http://localhost:3000";
  }

  const VALID_ROLES = [
    "admin",
    "tac",
    "user",
    "foe",
    "finance",
    "coordinator",
    "pca",
    "pcra",
    "institute",
    "sub_pca",
    "branch_head",
    "tac_head",
  ];

  const isImageFile = (path: string | undefined): boolean => {
    if (!path || typeof path !== "string") return false;
    if (path.startsWith("data:image") || path.includes("base64")) return true;
    return /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(path);
  };

  const isPdfFile = (path: string | undefined): boolean => {
    if (!path || typeof path !== "string") return false;
    return /\.pdf$/i.test(path);
  };

  const resolveFileSrc = (path: string | undefined): string => {
    if (!path) return "";
    if (
      path.startsWith("data:") ||
      path.startsWith("http://") ||
      path.startsWith("https://")
    ) {
      return path;
    }
    const safePath = path.startsWith("/") ? path : `/${path}`;
    return `${BACKEND_BASE_URL}${safePath}`;
  };

  const handleDeleteClick = async (id: string) => {
    const ok = await confirmToast("Are you sure you want to delete this file permanently?");
    if (!ok) return;

    try {
      const res = await deleteUploadApi(id);
      if (res?.success !== false) {
        toast.success("File deleted successfully.");
        fetchUploads();
      } else {
        toast.error(res?.message || "Failed to delete file.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header Panel Control */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-[#0D80F2]" /> User Uploads
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage files uploaded by users
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <Filter className="w-5 h-5 text-gray-400 ml-2" />
            <select
              value={roleFilter}
              onChange={handleRoleChange}
              className="bg-transparent capitalize border-none outline-none text-sm font-medium text-gray-600 cursor-pointer pr-4"
            >
              <option value="">All Roles</option>
              {VALID_ROLES.map((role) => (
                <option key={role} value={role} className="capitalize">
                  {role.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          {roleFilter && (
            <SearchableSelect
              options={roleUsers.map((u) => ({
                label: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email,
                value: u._id,
              }))}
              value={userIdFilter}
              onChange={handleUserChange}
              onSearchChange={setUserSearchTerm}
              loading={usersLoading}
              placeholder="All Users in Role"
            />
          )}
        </div>
      </div>
      {/* Media Board Grid Area Boundaries */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl h-64 border border-gray-100 animate-pulse p-4 flex flex-col justify-between shadow-sm"
            >
              <div className="w-full h-32 bg-gray-100 rounded-2xl mb-4" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-2 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <FileText className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No uploads found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((item: UploadResponseData, index: number) => {
            const isImage = isImageFile(item.path);
            const targetSrc = resolveFileSrc(item.path);

            const userData: UploadUserRef | null =
              item.user && typeof item.user === "object" && item.user.firstName
                ? item.user
                : item.userId && typeof item.userId === "object" && item.userId.firstName
                  ? item.userId
                  : null;

            const profilePicPath = userData?.profilePic || null;
            const resolvedUserAvatar = profilePicPath ? resolveFileSrc(profilePicPath) : null;

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={item._id}
                className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-lg transition-shadow group flex flex-col"
              >
                <div
                  className="relative w-full h-40 bg-gray-50 overflow-hidden cursor-pointer flex items-center justify-center border-b border-gray-100/50"
                  onClick={() => {
                    if (isImage) {
                      setPreviewImage(targetSrc);
                    } else {
                      window.open(targetSrc, "_blank");
                    }
                  }}
                >
                  {isImage ? (
                    <img
                      src={targetSrc}
                      alt="Upload preview"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `${BACKEND_BASE_URL}${item.path}`;
                      }}
                    />
                  ) : isPdfFile(item.path) ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50/50 select-none group">
                      <div className="relative w-20 h-24 bg-white rounded-lg border border-gray-200 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                        <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-center">
                          <FileText className="w-8 h-8 text-red-500/90 mx-auto stroke-[1.8]" />
                        </div>
                        <div className="bg-red-600 text-white text-[11px] font-black tracking-wider text-center py-1 uppercase shadow-inner">
                          PDF
                        </div>
                        <div className="absolute top-0 right-0 w-3 h-3 bg-gray-100 border-b border-l border-gray-300 rounded-bl-sm"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50/50">
                      <div className="relative w-20 h-24 bg-white rounded-lg border border-blue-100 flex flex-col justify-between overflow-hidden p-3">
                        <FileText className="w-8 h-8 text-blue-400 mx-auto mt-4" />
                        <div className="text-[9px] text-blue-500 font-bold text-center mt-2 truncate">DOC</div>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-black text-gray-600 shadow-sm z-10">
                    {dayjs(item.createdAt).format("DD MMM YYYY")}
                  </div>
                </div>

                {/* Card Contextual User Footprint Info */}
                <div className="p-4 flex items-center justify-between gap-3 mt-auto">
                  <div className="flex items-center gap-3 overflow-hidden flex-1">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 shrink-0 border border-gray-100 flex items-center justify-center overflow-hidden">
                      {resolvedUserAvatar ? (
                        <img
                          src={resolvedUserAvatar}
                          alt="User profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="text-[#0054a6] font-black text-sm uppercase">
                          {userData?.firstName?.charAt(0) || "U"}
                        </span>
                      )}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-sm font-bold text-gray-800 truncate capitalize">
                        {userData?.firstName || "Unknown"}{" "}
                        {userData?.lastName || ""}
                      </p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider truncate mt-0.5">
                        {item.role || userData?.role?.replace("_", " ") || "User"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteClick(item._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 cursor-pointer shrink-0"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar Controller */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      
    <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-9999 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-lg w-full mt-23 ml-45   rounded-3xl p-2    overflow-hidden flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
            

          
              <div className="w-full flex items-center justify-center  overflow-hidden rounded-2xl">
                <img
                  src={previewImage}
                  alt="Full preview"
                  className="max-h-[75vh] w-auto max-w-full object-contain block rounded-xl"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Uploads;