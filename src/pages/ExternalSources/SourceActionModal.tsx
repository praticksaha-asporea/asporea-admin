import React, { useState } from "react";
import toast from "react-hot-toast";
import { X, Loader2 } from "lucide-react";
import { createExternalSourceApi } from "../../service/apis/externalSource.api";
import type { SourceType } from "./useExternalSources";

interface SourceActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultType: SourceType;
}

const SourceActionModal: React.FC<SourceActionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultType,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<SourceType>(defaultType);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter a source name");

    setLoading(true);
    try {
      const res = await createExternalSourceApi({ name, type });
      if (res.data?.success) {
        toast.success(`${type.toUpperCase()} Source added successfully!`);
        setName("");
        onSuccess();
        onClose();
      } else {
        toast.error(res.data?.message || "Failed to create source");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "An error occurred while creating",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Source
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as SourceType)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#0D80F2] focus:border-[#0D80F2] outline-none transition-all"
            >
              <option value="pca">PCA</option>
              <option value="pcra">PCRA</option>
              <option value="institute">Institute</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Global Tech Institute"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#0D80F2] focus:border-[#0D80F2] outline-none transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-all"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center min-w-30 px-5 py-2.5 bg-[#0D80F2] text-white font-medium rounded-xl hover:bg-blue-600 transition-all shadow-md shadow-blue-200 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Save Source"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SourceActionModal;
