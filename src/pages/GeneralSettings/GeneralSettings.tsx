import {
  Save,
  Settings,
  Hash,
  Users,
  Clock,
  FileText,
  Timer,
  FileIcon,
  UploadCloud,
  X,
  Eye,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import { useGeneralSettings } from "./useGeneralSettings";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

function StatRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
        {label}
      </span>
      <span className="text-sm font-black text-gray-700">
        {value !== undefined && value !== null && value !== ""
          ? String(value)
          : "—"}
      </span>
    </div>
  );
}
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:3000";
const getFileUrl = (pathStr?: string) => {
  if (!pathStr) return "";

  if (
    pathStr.startsWith("data:") ||
    pathStr.startsWith("http://") ||
    pathStr.startsWith("https://")
  ) {
    return pathStr;
  }

  const cleanPath = pathStr.startsWith("/") ? pathStr : `/${pathStr}`;
  return `${BACKEND_URL}${cleanPath}`;
};
const isPdfFile = (src?: string) => {
  if (!src) return false;
  return (
    src.startsWith("data:application/pdf") || src.toLowerCase().includes(".pdf")
  );
};

const isImageFile = (src?: string) => {
  if (!src) return false;
  return (
    src.startsWith("data:image/") || /\.(jpeg|jpg|gif|png|webp)$/i.test(src)
  );
};

const GeneralSettings = () => {
  const [previewModal, setPreviewModal] = useState<{
    name: string;
    path: string;
  } | null>(null);
  const [activeFormatTab, setActiveFormatTab] = useState<
    "inquiry" | "appointment"
  >("inquiry");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { formik, loading, fetching, stats, fileInputRef, handleFileUpload } =
    useGeneralSettings();

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const removeBrochure = (index: number) => {
    const updated = [...(formik.values.inquiryBrochures || [])];
    updated.splice(index, 1);
    formik.setFieldValue("inquiryBrochures", updated);
  };

  if (fetching) {
    return (
      <div className="max-w-5xl mx-auto pb-20 animate-pulse space-y-8">
        <div className="h-20 bg-white rounded-3xl border border-gray-50" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-56 bg-white rounded-3xl border border-gray-100" />
            <div className="h-40 bg-white rounded-3xl border border-gray-100" />
          </div>
          <div className="h-80 bg-white rounded-3xl border border-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto pb-20"
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 bg-white p-4 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-50 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-gray-100 to-slate-100 flex items-center justify-center text-gray-600 shrink-0">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-700 tracking-wider font-mono">
              General Settings
            </h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
              System-wide configuration
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => formik.handleSubmit()}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 bg-[#0D80F2] text-white font-bold rounded-2xl hover:scale-105 hover:rotate-1 hover:shadow-lg disabled:opacity-70 transition-all duration-300 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* ── Left Side: Editable Settings ── */}
        <div className="lg:col-span-2 space-y-8">
          {/* TAC Assignment */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0054a6]" />

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 text-[#0054a6] rounded-2xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-medium tracking-wider text-gray-700">
                  TAC Assignment
                </h2>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  How inquiries are assigned to TAC officers
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(["random", "counterwise"] as const).map((mode) => {
                const isSelected = formik.values.tacAssignmentType === mode;
                return (
                  <button
                    type="button"
                    key={mode}
                    onClick={() =>
                      formik.setFieldValue("tacAssignmentType", mode)
                    }
                    className={`flex flex-col gap-2 p-5 rounded-2xl   text-left transition-all ${
                      isSelected
                        ? "border-[#0054a6] bg-blue-50"
                        : "border-gray-100 bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full  shadow-2xl flex items-center justify-center ${
                        isSelected ? "border-[#0054a6]" : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-[#0054a6]" />
                      )}
                    </div>
                    <p
                      className={`text-sm font-black capitalize ${
                        isSelected ? "text-[#0054a6]" : "text-gray-600"
                      }`}
                    >
                      {mode === "counterwise" ? "Counter-wise" : "Random"}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">
                      {mode === "random"
                        ? "Assign inquiries randomly to available TAC officers"
                        : "Assign inquiries in round-robin counter order"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

           
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fc7728]" />

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-50 text-[#fc7728] rounded-2xl">
                <Hash className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-medium tracking-wider text-gray-700">
                  System Number Formats
                </h2>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  Pattern used to generate automated IDs
                </p>
              </div>
            </div>

           
            <div className="flex p-1 bg-gray-50 rounded-xl mb-6  shadow-2xl">
              <button
                type="button"
                onClick={() => setActiveFormatTab("inquiry")}
                className={`flex-1 py-2.5 text-xs sm:text-lg font-medium tracking-wide rounded-lg transition-all ${
                  activeFormatTab === "inquiry"
                    ? "bg-white text-orange-500 shadow-2xl "
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                }`}
              >
                Inquiry No Format
              </button>
              <button
                type="button"
                onClick={() => setActiveFormatTab("appointment")}
                className={`flex-1 py-2.5 text-xs sm:text-lg   font-medium tracking-wide rounded-lg transition-all ${
                  activeFormatTab === "appointment"
                    ? "bg-white text-blue-400 shadow-2xl "
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                }`}
              >
                Appointment No Format
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                  Format Pattern (
                  {activeFormatTab === "inquiry" ? "Inquiry" : "Appointment"})
                </label>
                <div className="relative group">
                  <Hash className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#fc7728] transition-colors" />

                  {activeFormatTab === "inquiry" ? (
                    <input
                      type="text"
                      placeholder="ASP-INQ-00000"
                      {...formik.getFieldProps("inquiryNumberFormat")}
                      className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-black text-gray-800 tracking-widest transition-all ${
                        formik.touched.inquiryNumberFormat &&
                        formik.errors.inquiryNumberFormat
                          ? "border-red-400 focus:bg-white"
                          : "border-transparent focus:border-[#fc7728]/30 focus:bg-white"
                      }`}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder="ASP-APMNT-00000"
                      {...formik.getFieldProps("appointmentNumberFormat")}
                      className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-black text-gray-800 tracking-widest transition-all ${
                        formik.touched.appointmentNumberFormat &&
                        formik.errors.appointmentNumberFormat
                          ? "border-red-400 focus:bg-white"
                          : "border-transparent focus:border-[#fc7728]/30 focus:bg-white"
                      }`}
                    />
                  )}
                </div>

                {activeFormatTab === "inquiry" &&
                  formik.touched.inquiryNumberFormat &&
                  formik.errors.inquiryNumberFormat && (
                    <p className="text-red-500 text-xs font-bold pl-2">
                      {formik.errors.inquiryNumberFormat}
                    </p>
                  )}
                {activeFormatTab === "appointment" &&
                  formik.touched.appointmentNumberFormat &&
                  formik.errors.appointmentNumberFormat && (
                    <p className="text-red-500 text-xs font-bold pl-2">
                      {formik.errors.appointmentNumberFormat}
                    </p>
                  )}
              </div>

              {/* Live Preview */}
              <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 rounded-2xl shadow-2xl ">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Preview
                </span>
                <span
                  className={`text-sm font-medium tracking-widest transition-colors duration-200 ${
                    activeFormatTab === "inquiry"
                      ? "text-orange-500"
                      : "text-blue-400"
                  }`}
                >
                  {activeFormatTab === "inquiry"
                    ? formik.values.inquiryNumberFormat || "—"
                    : formik.values.appointmentNumberFormat || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Inquiry Brochures Upload */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3b82f6]" />

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                <FileIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-medium tracking-wider text-gray-700">
                  Inquiry Brochures
                </h2>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  Upload brochures attached dynamically on inquiry creation.
                </p>
              </div>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32  shadow-2xl border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-blue-400 transition-all mb-6"
            >
              <UploadCloud className="w-8 h-8 text-blue-400 mb-2" />
              <p className="text-sm font-medium tracking-wide text-gray-500">
                Click or drag files here to upload
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.png,.jpg"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>

            {/* Inquiry Brochures Grid */}
            {formik.values.inquiryBrochures &&
              formik.values.inquiryBrochures.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6  shadow-2xl p-6 rounded-2xl">
                  {formik.values.inquiryBrochures.map((brochure, index) => (
                    <div
                      key={index}
                      className="bg-white/10 border border-white/20 p-3 rounded-2xl flex flex-col gap-3 relative group"
                    >
                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeBrochure(index)}
                        className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-20 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Preview Box with Hover Eye Overlay */}
                      <div
                        onClick={() =>
                          brochure.path &&
                          setPreviewModal({
                            name: brochure.name,
                            path: getFileUrl(brochure.path),
                          })
                        }
                        className="w-full h-28 bg-white/20 rounded-xl overflow-hidden relative cursor-pointer flex flex-col items-center justify-center text-white text-center p-1 border border-white/10 hover:border-white/40 transition-all"
                      >
                        {isPdfFile(brochure.path) ? (
                          <iframe
                            src={getFileUrl(brochure.path)}
                            className="w-full h-full object-cover pointer-events-none rounded-lg"
                            title={brochure.name}
                          />
                        ) : isImageFile(brochure.path) ? (
                          <img
                            src={getFileUrl(brochure.path)}
                            alt={brochure.name}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1.5 p-2">
                            <FileIcon className="w-8 h-8 text-white/80" />
                            <p className="text-xs font-semibold truncate max-w-35">
                              {brochure.name}
                            </p>
                          </div>
                        )}

                        {/* Hover Overlay (Eye Icon) */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl backdrop-blur-[2px]">
                          <div className="p-2 bg-white text-gray-800 rounded-full shadow-md hover:scale-110 transition-transform">
                            <Eye className="w-5 h-5" />
                          </div>
                        </div>
                      </div>

                      {/* Name Input */}
                      <input
                        type="text"
                        placeholder="Brochure Name"
                        name={`inquiryBrochures[${index}].name`}
                        value={brochure.name}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 bg-white/80 focus:bg-white rounded-lg border-none outline-none text-sm font-bold text-gray-800 text-center transition-all"
                      />
                    </div>
                  ))}
                </div>
              )}

            {/* Array Field Errors */}
            {typeof formik.errors.inquiryBrochures === "string" && (
              <p className="text-red-500 text-xs font-bold mt-2">
                {formik.errors.inquiryBrochures}
              </p>
            )}
          </div>
        </div>

        {/* ── Right Side: Stats & Timelines ── */}
        <div className="space-y-8">
          {/* System Stats Card */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gray-300" />
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gray-50 text-gray-500 rounded-2xl">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-medium tracking-wider text-gray-700">
                System Stats
              </h2>
            </div>
            <StatRow label="Last Inquiry #" value={stats.lastInq} />
            <StatRow label="Last FY" value={stats.lastFy} />
          </div>

          {/* Timelines Configuration Card */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0054a6]" />
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 text-[#0054a6] rounded-2xl">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-medium tracking-wider text-gray-700">
                  Timelines
                </h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  In hours
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {(
                [
                  { field: "escalationTimelineHours", label: "Escalation" },
                  { field: "inqResTimelineHours", label: "Inq. Resolution" },
                  {
                    field: "preCounsellingTimelineHours",
                    label: "Pre-Counselling",
                  },
                  { field: "assessmentTimelineHours", label: "Assessment" },
                ] as const
              ).map(({ field, label }) => (
                <div key={field} className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                    {label}
                  </label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      {...formik.getFieldProps(field)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#0054a6]/30 rounded-2xl outline-none font-bold text-gray-800 transition-all focus:bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assessment Rule Configuration */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-600" />
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-medium tracking-wider text-gray-700">
                Assessment
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                  Full Marks
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="100"
                  {...formik.getFieldProps("assessment.fullMarks")}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-purple-600/30 rounded-2xl outline-none font-bold text-gray-800 transition-all focus:bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                  Passing Marks
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="40"
                  {...formik.getFieldProps("assessment.passingMarks")}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-purple-600/30 rounded-2xl outline-none font-bold text-gray-800 transition-all focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Technical Rule Configuration */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600" />
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-medium tracking-wider text-gray-700">
                Technical
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                  Full Marks
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="100"
                  {...formik.getFieldProps("technical.fullMarks")}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-emerald-600/30 rounded-2xl outline-none font-bold text-gray-800 transition-all focus:bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                  Passing Marks
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="40"
                  {...formik.getFieldProps("technical.passingMarks")}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-emerald-600/30 rounded-2xl outline-none font-bold text-gray-800 transition-all focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* ⚡ 3. Fullscreen Document Preview Portal Modal */}
      {mounted &&
        previewModal &&
        createPortal(
          <div
            onClick={() => setPreviewModal(null)} // Backdrop click par close hoga
            className="fixed inset-0 z-999999 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()} // Prevent inside click from closing backdrop
              className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh] max-h-[85vh] my-auto relative border border-gray-200"
            >
              {/* Fixed Modal Header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-gray-200 bg-gray-50 shrink-0 z-10">
                {/* Title & Icon */}
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                    <FileIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-medium text-gray-600 text-lg tracking-widest sm:text-base truncate">
                    {previewModal.name}
                  </h3>
                </div>

                {/* Action Buttons: Download & Close */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <a
                    href={previewModal.path}
                    download={previewModal.name}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 sm:px-4 py-2 bg-green-500  shadow-2xl  text-gray-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4 text-white" />
                    <span className="hidden sm:inline text-white text-sm font-mono font-medium tracking-wider">
                      Download
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setPreviewModal(null)}
                    className="p-2 bg-red-500 hover:bg-red-500 text-white  rounded-xl transition-all font-bold flex items-center justify-center cursor-pointer"
                    title="Close Preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body - PDF / Image Viewer Container */}
              <div className="p-2 sm:p-3 bg-gray-900 flex-1 overflow-hidden flex items-center justify-center w-full h-full">
                {isPdfFile(previewModal.path) ? (
                  <iframe
                    src={getFileUrl(previewModal.path)}
                    className="w-full h-full rounded-2xl border-0 bg-white"
                    title={previewModal.name}
                  />
                ) : isImageFile(previewModal.path) ? (
                  <img
                    src={getFileUrl(previewModal.path)}
                    alt={previewModal.name}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-md"
                  />
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <FileIcon className="w-16 h-16 mx-auto mb-2 text-gray-500" />
                    <p className="text-sm">
                      Preview not supported for this file type.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </motion.div>
  );
};

export default GeneralSettings;
