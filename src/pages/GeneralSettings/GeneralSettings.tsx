import {
  Save,
  Settings,
  Hash,
  Users,
  Clock,
  FileText,
  Timer,
} from "lucide-react";
import { motion } from "framer-motion";
import { useGeneralSettings } from "./useGeneralSettings";

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

const GeneralSettings = () => {
  const { formik, loading, fetching, stats } = useGeneralSettings();

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
          <div className="w-14 h-14 rounded-2xl bg-linear-to-brrom-gray-100 to-slate-100 flex items-center justify-center text-gray-600 shrink-0">
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
          className="flex items-center gap-2 px-8 py-3 bg-[#0D80F2] text-white font-bold rounded-2xl hover:scale-105 hover:rotate-1 hover:shadow-lg disabled:opacity-70 transition-all duration-300"
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
                // ✅ Strictly bound to tacAssignmentType control bounds
                const isSelected = formik.values.tacAssignmentType === mode;
                return (
                  <button
                    type="button"
                    key={mode}
                    onClick={() =>
                      formik.setFieldValue("tacAssignmentType", mode)
                    }
                    className={`flex flex-col gap-2 p-5 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? "border-[#0054a6] bg-blue-50/60"
                        : "border-gray-100 bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-[#0054a6]" : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-[#0054a6]" />
                      )}
                    </div>
                    <p
                      className={`text-sm font-black capitalize ${isSelected ? "text-[#0054a6]" : "text-gray-600"}`}
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

          {/* Inquiry Number Format */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fc7728]" />

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-orange-50 text-[#fc7728] rounded-2xl">
                <Hash className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-medium tracking-wider text-gray-700">
                  Inquiry Number Format
                </h2>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  Pattern used to generate inquiry IDs
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                  Format Pattern
                </label>
                <div className="relative group">
                  <Hash className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#fc7728] transition-colors" />
                  <input
                    type="text"
                    placeholder="ASP-INQ-0000"
                    {...formik.getFieldProps("inquiryNumberFormat")}
                    className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-black text-gray-800 tracking-widest transition-all ${
                      formik.touched.inquiryNumberFormat &&
                      formik.errors.inquiryNumberFormat
                        ? "border-red-400 focus:bg-white"
                        : "border-transparent focus:border-[#fc7728]/30 focus:bg-white"
                    }`}
                  />
                </div>
                {formik.touched.inquiryNumberFormat &&
                  formik.errors.inquiryNumberFormat && (
                    <p className="text-red-500 text-xs font-bold pl-2">
                      {formik.errors.inquiryNumberFormat}
                    </p>
                  )}
              </div>

              {/* Live Preview */}
              <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Preview
                </span>
                <span className="text-sm font-black text-[#fc7728] tracking-widest">
                  {formik.values.inquiryNumberFormat || "—"}
                </span>
              </div>
            </div>
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
    </motion.div>
  );
};

export default GeneralSettings;
