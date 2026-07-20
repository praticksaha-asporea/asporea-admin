
import { useExternalSources, type SourceType } from "./useExternalSources";
import { Plus, Edit2, Trash2 } from "lucide-react";
import SourceActionModal from "./SourceActionModal";  
import { useState } from "react";
 
const ExternalSources = () => {
  const {
    activeType,
    handleTypeChange,
    sources,
    loading,
    page,
    setPage,
    totalPages,
    handleDelete,
    refreshList
  } = useExternalSources();
const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // Tabs structure
  const tabs: { label: string; value: SourceType }[] = [
    { label: "PCA", value: "pca" },
    { label: "PCRA", value: "pcra" },
    { label: "Institute", value: "institute" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">External Sources</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}  
          className="flex items-center gap-2 bg-[#0D80F2] text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all shadow-md shadow-blue-200"
        >
          <Plus className="w-4 h-4" />
          Add Source
        </button>
      </div>

      {/* Tabs / Role Filter */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTypeChange(tab.value)}
            className={`px-4 py-2 font-medium text-sm transition-all rounded-t-lg ${
              activeType === tab.value
                ? "text-[#0D80F2] border-b-2 border-[#0D80F2] bg-blue-50"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Date Added</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : sources.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-400">
                  No {activeType.toUpperCase()} sources found.
                </td>
              </tr>
            ) : (
              sources.map((source) => (
                <tr key={source._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                    {source.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      source.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {source.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(source.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex items-center justify-end gap-3">
                    <button 
                      onClick={() => console.log("Open Edit Modal for", source._id)}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(source._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    
      <SourceActionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={refreshList} 
        defaultType={activeType} 
      />

      {/* Pagination (Simple Example) */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-white border border-gray-200 rounded text-sm text-gray-600 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-white border border-gray-200 rounded text-sm text-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ExternalSources;