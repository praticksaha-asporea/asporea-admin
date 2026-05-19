import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, FileText, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useTypeForm } from "./useTypeForm";

const TypeForm = () => {
  const navigate = useNavigate();
  const { formik, loading, fetching, apiError, isEdit, toggleExtension, EXTENSION_OPTIONS } = useTypeForm();

  // ── Fetch skeleton ─────────────────────────────────────────────────────────
  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto pb-20 animate-pulse space-y-8">
        <div className="h-16 bg-white rounded-2xl border border-gray-100" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-72 bg-white rounded-3xl border border-gray-100" />
          <div className="h-64 bg-white rounded-3xl border border-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto pb-20">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <button
          onClick={() => navigate("/document-types")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold px-4 py-2 rounded-xl hover:bg-gray-50 transition-all"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-700 tracking-wider font-mono">
            {isEdit ? "Edit Document Type" : "Add Document Type"}
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
            {isEdit ? "Update type settings" : "Configure upload rules"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => formik.handleSubmit()}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0D80F2] text-white rounded-xl font-bold hover:bg-black hover:shadow-lg disabled:opacity-70 transition-all"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : isEdit ? "Update" : "Save"}
        </button>
      </div>

      {/* ── API error banner ── */}
      {apiError && (
        <div className="mb-6 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl text-sm font-bold text-red-600">
          {apiError}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left: Details ── */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0054a6]" />

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 text-[#0054a6] rounded-2xl"><FileText className="w-6 h-6" /></div>
              <h2 className="text-2xl font-medium tracking-wider text-gray-700">Type Details</h2>
            </div>

            <div className="space-y-6">

              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Resume / CV"
                  {...formik.getFieldProps("title")}
                  className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-800 transition-all ${
                    formik.touched.title && formik.errors.title
                      ? "border-red-400 focus:bg-white"
                      : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"
                  }`}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-500 text-xs font-bold pl-2">{formik.errors.title}</p>
                )}
              </div>

              {/* Sub Title */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                  Sub Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. (Aspect Ratio: 9:16)"
                  {...formik.getFieldProps("subTitle")}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#0054a6]/30 rounded-2xl outline-none font-bold text-gray-800 transition-all focus:bg-white"
                />
              </div>

              {/* Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                  Section <span className="text-red-500">*</span>
                </label>
                <select
                  {...formik.getFieldProps("section")}
                  className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-800 appearance-none transition-all ${
                    formik.touched.section && formik.errors.section
                      ? "border-red-400 focus:bg-white"
                      : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"
                  }`}
                >
                  <option value="" disabled>Select section...</option>
                  <option value="resume">Resume</option>
                  <option value="document">Document</option>
                  <option value="experience">Experience</option>
                  <option value="academic">Academic</option>
                  <option value="additional">Additional</option>
                </select>
                {formik.touched.section && formik.errors.section && (
                  <p className="text-red-500 text-xs font-bold pl-2">{formik.errors.section}</p>
                )}
              </div>

              {/* Supported Extensions */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                  Supported Extensions <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  {EXTENSION_OPTIONS.map((ext) => {
                    const isSelected = formik.values.supportedExtensions.includes(ext);
                    return (
                      <button
                        type="button"
                        key={ext}
                        onClick={() => toggleExtension(ext)}
                        className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all ${
                          isSelected
                            ? "bg-[#0054a6] text-white shadow-md"
                            : "bg-white text-gray-500 border border-gray-200 hover:border-[#0054a6]/30"
                        }`}
                      >
                        .{ext}
                      </button>
                    );
                  })}
                </div>
                {formik.touched.supportedExtensions && formik.errors.supportedExtensions && (
                  <p className="text-red-500 text-xs font-bold pl-2">
                    {formik.errors.supportedExtensions as string}
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* ── Right: Options ── */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fc7728]" />

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-orange-50 text-[#fc7728] rounded-2xl"><Settings className="w-6 h-6" /></div>
              <h2 className="text-2xl font-medium tracking-wider text-gray-700">Options</h2>
            </div>

            <div className="space-y-5">

              {/* Required toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="text-sm font-bold text-gray-700">Required</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Must be submitted</p>
                </div>
                <div
                  onClick={() => formik.setFieldValue("required", !formik.values.required)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                    formik.values.required ? "bg-[#fc7728]" : "bg-gray-200"
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    formik.values.required ? "translate-x-5" : "translate-x-0"
                  }`} />
                </div>
              </div>

              {/* Multiple toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="text-sm font-bold text-gray-700">Multiple Files</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Allow more than one</p>
                </div>
                <div
                  onClick={() => formik.setFieldValue("multiple", !formik.values.multiple)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                    formik.values.multiple ? "bg-[#fc7728]" : "bg-gray-200"
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    formik.values.multiple ? "translate-x-5" : "translate-x-0"
                  }`} />
                </div>
              </div>

            </div>
          </div>
        </div>

      </form>
    </motion.div>
  );
};

export default TypeForm;
