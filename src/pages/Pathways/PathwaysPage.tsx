import { usePathway } from "./usePathway";
import { GitFork, Save, X, Edit2, Trash2, Layers } from "lucide-react";
import { motion } from "framer-motion";

const PathwaysPage = () => {
  const {
    formik,
    pathways,
    parentOptions,
    loading,
    fetching,
    editId,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    handleToggleStatus,
  } = usePathway();

  const parentMap = parentOptions.map((parent) => {
    const children = pathways.filter((p) => p.underPathway === parent._id);
    return { parent, children };
  });

  const standaloneChildren = pathways.filter(
    (p) =>
      p.underPathway !== "" &&
      !parentOptions.some((parent) => parent._id === p.underPathway),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto pb-20"
    >
      {/* ── Top Header ── */}
      <div className="flex items-center gap-3 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
          <GitFork className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-700 tracking-wider font-mono">
            Manage Pathways
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
            Configure Parent Programs & Sub-Pathways
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── FORM SECTION (Left) ── */}
        <div className="lg:col-span-1">
          <form
            onSubmit={formik.handleSubmit}
            className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600 rounded-l-3xl" />

            <h2 className="text-lg font-bold text-gray-700 mb-6">
              {editId ? "Edit Pathway" : "Add New Pathway"}
            </h2>

            <div className="space-y-5">
              {/* Parent Selector */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 block mb-1">
                  Parent Category
                </label>
                <select
                  {...formik.getFieldProps("underPathway")}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-indigo-500/40 rounded-xl outline-none font-bold text-gray-800 transition-all focus:bg-white cursor-pointer"
                >
                  <option value="">-- None (Main Parent Type) --</option>
                  {parentOptions
                    .filter((p) => p._id !== editId)
                    .map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title}
                      </option>
                    ))}
                </select>
                <p className="text-[10px] text-gray-400 font-medium mt-1 pl-2">
                  Select "None" if creating a top-level category.
                </p>
              </div>

              {/* Title Input */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 block mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mobility - Career Pathway Program"
                  {...formik.getFieldProps("title")}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-indigo-500/40 rounded-xl outline-none font-bold text-gray-800 transition-all focus:bg-white"
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-500 text-xs mt-1 pl-2">
                    {formik.errors.title}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-70 transition-all"
                >
                  <Save className="w-4 h-4" />{" "}
                  {loading ? "Saving..." : editId ? "Update" : "Save"}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* ── LIST/HIERARCHY VIEW (Right) ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-700">
                Pathway Structure
              </h2>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {pathways.length} Total
              </span>
            </div>

            {fetching ? (
              <div className="p-8 text-center text-gray-400 font-bold">
                Loading pathways...
              </div>
            ) : pathways.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-bold">
                No pathways configured yet.
              </div>
            ) : (
              <div className="max-h-150 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {/* Parent Categories with nested children */}
                {parentMap.map(({ parent, children }) => (
                  <div
                    key={parent._id}
                    className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-3"
                  >
                    {/* Parent Row */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200/80 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-base">
                            {parent.title}
                          </h3>
                          <span className="text-[10px] font-extrabold uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">
                            Parent Category ({children.length} Sub-pathways)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                      <button
                          type="button"
                          onClick={() => handleToggleStatus(parent._id, parent.isActive)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            parent.isActive ? "bg-indigo-600" : "bg-gray-300"
                          }`}
                          title={parent.isActive ? "Deactivate Pathway" : "Activate Pathway"}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              parent.isActive ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleEdit(parent)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(parent._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Sub-Pathways List */}
                    {children.length > 0 && (
                      <div className="pl-6 space-y-2 border-l-2 border-indigo-100 ml-4">
                        {children.map((child) => (
                          <div
                            key={child._id}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                              child.isActive
                                ? "bg-white border-gray-100 hover:border-indigo-200"
                                : "bg-gray-100/60 border-gray-200 opacity-60"
                            }`}
                          >
                            <span className="font-semibold text-gray-700 text-sm">
                              {child.title}
                            </span>

                            <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => handleToggleStatus(child._id, child.isActive)}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                  child.isActive ? "bg-indigo-600" : "bg-gray-300"
                                }`}
                                title={child.isActive ? "Deactivate Sub-Pathway" : "Activate Sub-Pathway"}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                    child.isActive ? "translate-x-4" : "translate-x-0"
                                  }`}
                                />
                              </button>
                              <button
                                onClick={() => handleEdit(child)}
                                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-all"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(child._id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Standalone items fallback */}
                {standaloneChildren.length > 0 && (
                  <div className="border border-orange-100 rounded-2xl p-4 bg-orange-50/30 space-y-2">
                    <p className="text-xs font-bold text-orange-600 uppercase mb-2">
                      Unlinked Sub-Pathways
                    </p>
                    {standaloneChildren.map((child) => (
                      <div
                        key={child._id}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-orange-200"
                      >
                        <span className="font-semibold text-gray-700 text-sm">
                          {child.title}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleEdit(child)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(child._id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PathwaysPage;
