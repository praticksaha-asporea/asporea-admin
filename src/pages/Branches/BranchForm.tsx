import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, MapPin, Clock, LayoutGrid, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { useBranchForm } from "./useBranchForm";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const BranchForm = () => {
  const navigate = useNavigate();
  const { formik, loading, fetching, apiError, isEdit, toggleDay } = useBranchForm();

  // ── Fetch skeleton ─────────────────────────────────────────────────────────
  if (fetching) {
    return (
      <div className="max-w-5xl mx-auto pb-20 animate-pulse space-y-8">
        <div className="h-16 bg-white rounded-2xl border border-gray-100" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-72 bg-white rounded-3xl border border-gray-100" />
          <div className="space-y-8">
            <div className="h-52 bg-white rounded-3xl border border-gray-100" />
            <div className="h-40 bg-white rounded-3xl border border-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto pb-20">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <button
          onClick={() => navigate("/branches")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold px-4 py-2 rounded-xl hover:bg-gray-50 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-700 tracking-wider font-mono">
            {isEdit ? "Edit Branch" : "Add New Branch"}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => formik.handleSubmit()}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0D80F2] text-white rounded-xl font-bold hover:bg-black hover:shadow-lg disabled:opacity-70 transition-all"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : isEdit ? "Update Branch" : "Save Branch"}
        </button>
      </div>

      {/* ── API error banner ── */}
      {apiError && (
        <div className="mb-6 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl text-sm font-bold text-red-600">
          {apiError}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left: General Information ── */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0D80F2]" />

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 text-[#0054a6] rounded-2xl"><LayoutGrid className="w-6 h-6" /></div>
              <h2 className="text-2xl font-medium tracking-wider text-gray-700">General Information</h2>
            </div>

            <div className="space-y-5">

              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                  Branch Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. South Extension HQ"
                  {...formik.getFieldProps("title")}
                  className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-800 transition-all ${
                    formik.touched.title && formik.errors.title
                      ? "border-red-400 focus:bg-white"
                      : "border-transparent focus:border-[#0D80F2]/30 focus:bg-white"
                  }`}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-500 text-xs font-bold pl-2">{formik.errors.title}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                  Full Location <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <textarea
                    rows={3}
                    placeholder="Enter complete address..."
                    {...formik.getFieldProps("location")}
                    className={`w-full pl-14 pr-5 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-800 transition-all resize-none ${
                      formik.touched.location && formik.errors.location
                        ? "border-red-400 focus:bg-white"
                        : "border-transparent focus:border-[#0D80F2]/30 focus:bg-white"
                    }`}
                  />
                </div>
                {formik.touched.location && formik.errors.location && (
                  <p className="text-red-500 text-xs font-bold pl-2">{formik.errors.location}</p>
                )}
              </div>

              {/* Lat / Long */}
              <div className="grid grid-cols-2 gap-4">
                {/* Latitude */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                    Latitude
                  </label>
                  <div className="relative group">
                    <Navigation className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                    <input
                      type="text"
                      placeholder="27.0360"
                      {...formik.getFieldProps("latitude")}
                      className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-800 transition-all ${
                        formik.touched.latitude && formik.errors.latitude
                          ? "border-red-400 focus:bg-white"
                          : "border-transparent focus:border-[#0D80F2]/30 focus:bg-white"
                      }`}
                    />
                  </div>
                  {formik.touched.latitude && formik.errors.latitude && (
                    <p className="text-red-500 text-xs font-bold pl-2">{formik.errors.latitude}</p>
                  )}
                </div>

                {/* Longitude */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                    Longitude
                  </label>
                  <div className="relative group">
                    <Navigation className="absolute left-5 top-4 w-5 h-5 rotate-90 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                    <input
                      type="text"
                      placeholder="88.2627"
                      {...formik.getFieldProps("longitude")}
                      className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-800 transition-all ${
                        formik.touched.longitude && formik.errors.longitude
                          ? "border-red-400 focus:bg-white"
                          : "border-transparent focus:border-[#0D80F2]/30 focus:bg-white"
                      }`}
                    />
                  </div>
                  {formik.touched.longitude && formik.errors.longitude && (
                    <p className="text-red-500 text-xs font-bold pl-2">{formik.errors.longitude}</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Right: Operations + Working Days ── */}
        <div className="space-y-8">

          {/* Operations */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fc7728]" />

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-orange-50 text-[#fc7728] rounded-2xl"><Clock className="w-6 h-6" /></div>
              <h2 className="text-2xl font-medium tracking-wider text-gray-700">Operations</h2>
            </div>

            <div className="space-y-6">

              {/* Time Zone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Time Zone</label>
                <select
                  {...formik.getFieldProps("timeZone")}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#fc7728]/30 rounded-2xl outline-none font-bold text-gray-700 appearance-none cursor-pointer focus:bg-white transition-all"
                >
                  <option value="Asia/Kolkata">Asia / Kolkata</option>
                  <option value="Asia/Kathmandu">Asia / Kathmandu</option>
                  <option value="Asia/Dubai">Asia / Dubai</option>
                </select>
              </div>

              {/* Active Counters */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Active Counters</label>
                <div className="flex items-center bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-[#fc7728]/30 transition-all overflow-hidden">
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue("counters", Math.max(0, formik.values.counters - 1))}
                    className="w-14 h-14 flex items-center justify-center bg-white border-r border-gray-100 font-black text-xl text-gray-500 hover:text-orange-500 transition-colors shrink-0"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-black text-xl text-gray-800">
                    {formik.values.counters}
                  </span>
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue("counters", formik.values.counters + 1)}
                    className="w-14 h-14 flex items-center justify-center bg-white border-l border-gray-100 font-black text-xl text-gray-500 hover:text-blue-500 transition-colors shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Working Days */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100">
            <h2 className="text-2xl font-medium tracking-wider text-gray-700 mb-2">Working Days</h2>
            {formik.touched.workDays && formik.errors.workDays && (
              <p className="text-red-500 text-xs font-bold mb-4">{formik.errors.workDays as string}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-5">
              {DAYS.map((day) => {
                const isSelected = formik.values.workDays.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isSelected
                        ? "bg-[#0D80F2] text-white shadow-md shadow-blue-100"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </form>
    </motion.div>
  );
};

export default BranchForm;
