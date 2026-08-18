import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Briefcase,
  FileText,
  ShieldCheck,
  Upload,
  X,
  FileCheck,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";
import { usePositionForm } from "./usePositionForm";
import MultiSelectSearch, {
  type SelectOption,
} from "../../components/UI/multiSelect/MultiSelectSearch";

const PositionForm = () => {
  const navigate = useNavigate();
  const {
    formik,
    loading,
    fetching,
    isEdit,
    docTypes,
    countriesList,
    pathwaysList,
    brochureFile,
    brochurePreview,
    handleBrochureChange,
    clearBrochure,
  } = usePositionForm();

  if (fetching) {
    return (
      <div className="max-w-5xl mx-auto pb-20 animate-pulse space-y-8">
        <div className="h-16 bg-white rounded-2xl border border-gray-100" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-72 bg-white rounded-3xl border border-gray-100" />
          <div className="h-64 bg-white rounded-3xl border border-gray-100" />
        </div>
      </div>
    );
  }

  const docOptions: SelectOption[] = docTypes.map((d) => ({
    value: d._id,
    label: d.title,
    meta: d.section,
  }));

  const typeOptions: SelectOption[] = [];
  const parentPathways = pathwaysList.filter(
    (p) => !p.underPathway || p.underPathway === "",
  );

  parentPathways.forEach((parent) => {
    const children = pathwaysList.filter((p) => p.underPathway === parent._id);

    if (children.length > 0) {
      children.forEach((child) => {
        typeOptions.push({
          value: child._id,
          label: child.title,
          meta: parent.title,
        });
      });
    } else {
      typeOptions.push({
        value: parent._id,
        label: parent.title,
        meta: "Main Pathway",
      });
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto pb-20"
    >
      {/* ── Top Bar Control Identity ── */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <button
          type="button"
          onClick={() => navigate("/positions")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold px-4 py-2 rounded-xl hover:bg-gray-50 transition-all"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-700 tracking-wider font-mono">
            {isEdit ? "Edit Position" : "Add Position"}
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
            {isEdit ? "Update position details" : "Configure role & documents"}
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

      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* ── Left Side Layout: Main Inputs ── */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Position Details */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0054a6]" />

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 text-[#0054a6] rounded-2xl">
                <Briefcase className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-medium tracking-wider text-gray-700">
                Position Details
              </h2>
            </div>

            <div className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cashier"
                  {...formik.getFieldProps("title")}
                  className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-800 transition-all ${
                    formik.touched.title && formik.errors.title
                      ? "border-red-400 focus:bg-white"
                      : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"
                  }`}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-500 text-xs font-bold pl-2">
                    {formik.errors.title}
                  </p>
                )}
              </div>

              {/* Textarea Details Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                  Details
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the position responsibilities..."
                  {...formik.getFieldProps("details")}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#0054a6]/30 rounded-2xl outline-none font-bold text-gray-800 transition-all resize-none focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* 2. Documents Configuration (Required & Mandatory Combined) */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0D80F2] rounded-l-3xl" />

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 text-[#0D80F2] rounded-2xl">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-medium tracking-wider text-gray-700">
                Document Requirements
              </h2>
            </div>

            {/* Grid for Required and Mandatory side-by-side on md screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Required Documents Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#0D80F2]" /> Required Documents
                </label>
                <MultiSelectSearch
                  options={docOptions}
                  value={formik.values.requiredDocuments}
                  onChange={(vals) =>
                    formik.setFieldValue("requiredDocuments", vals)
                  }
                  placeholder="Search & select required docs..."
                  accentColor="bg-[#0D80F2]"
                />
              </div>

              {/* Mandatory Documents Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#fc7728]" /> Mandatory Documents
                </label>
                <MultiSelectSearch
                  options={docOptions}
                  value={formik.values.mandatoryDocuments}
                  onChange={(vals) =>
                    formik.setFieldValue("mandatoryDocuments", vals)
                  }
                  placeholder="Search & select mandatory docs..."
                  accentColor="bg-[#fc7728]"
                />
              </div>
            </div>
          </div>

          {/* 3. Position Classification (Types & Country) */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#10b981] rounded-l-3xl" />

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-emerald-50 text-[#10b981] rounded-2xl">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-medium tracking-wider text-gray-700">
                Classification
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Program Type Multi-Select Dropdown */}
              <div className="relative">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 mb-2 block">
                  Program Type
                </label>
                <MultiSelectSearch
                  options={typeOptions}
                  value={formik.values.programTypes || []}
                  onChange={(vals) =>
                    formik.setFieldValue("programTypes", vals)
                  }
                  placeholder="Select Program Types..."
                  accentColor="bg-[#10b981]"
                />
              </div>

              {/* Country Selection */}
              <div className="relative">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 mb-2 block">
                  Country
                </label>
                <select
                  value={formik.values.country || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    formik.setFieldValue("country", val);
                  }}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#10b981]/40 focus:bg-white rounded-2xl outline-none font-bold text-gray-800 transition-all cursor-pointer appearance-none"
                >
                  <option value="">Select Country...</option>
                  {countriesList.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} {c.code ? `(${c.code})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Side Layout: Overview & Attachments ── */}
        <div className="space-y-8">
          {/* Summary Card */}
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
              Summary
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500">Required</span>
              <span className="text-xs font-black text-[#0D80F2] bg-blue-50 px-3 py-1 rounded-full">
                {formik.values.requiredDocuments.length} doc(s)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500">Mandatory</span>
              <span className="text-xs font-black text-[#fc7728] bg-orange-50 px-3 py-1 rounded-full">
                {formik.values.mandatoryDocuments.length} doc(s)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500">
                Program Types
              </span>
              <span className="text-xs font-black text-[#10b981] bg-emerald-50 px-3 py-1 rounded-full">
                {formik.values.programTypes?.length || 0} selected
              </span>
            </div>
          </div>

          {/* Position Brochure Upload */}
          <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gray-300" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
              Position Brochure
            </p>

            {brochureFile || brochurePreview ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl">
                <FileCheck className="w-5 h-5 text-green-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-green-700 truncate">
                    {brochureFile ? brochureFile.name : "Existing brochure"}
                  </p>
                  {brochureFile && (
                    <p className="text-xs text-green-500 font-medium mt-0.5">
                      {(brochureFile.size / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={clearBrochure}
                  className="p-1.5 text-green-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="brochure-upload"
                className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-[#0054a6]/40 hover:bg-blue-50/30 transition-all group"
              >
                <div className="p-3 bg-gray-100 group-hover:bg-blue-100 rounded-2xl transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#0054a6] transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-500 group-hover:text-gray-700 transition-colors">
                    Click to upload brochure
                  </p>
                  <p className="text-xs text-gray-400 font-medium mt-1">
                    PDF, DOCX, PNG, JPG
                  </p>
                </div>
              </label>
            )}

            <input
              id="brochure-upload"
              type="file"
              accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleBrochureChange}
            />
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default PositionForm;