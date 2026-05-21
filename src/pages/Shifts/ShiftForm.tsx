import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Save, CheckCircle2,
  CalendarDays, Plus, Edit3, Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useShiftForm } from "./useShiftForm";
import TimePicker from "../../components/UI/timePicker/TimePicker";
import { toast } from "react-hot-toast";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ShiftForm = () => {
  const navigate = useNavigate();
  const {
    formik, loading, fetching, isEdit,
    currentSchedule, setCurrentSchedule, editingIndex,
    toggleScheduleDay, addOrUpdateSchedule,
    editSchedule, removeSchedule, cancelEditSchedule,
  } = useShiftForm();

  // ── Fetch skeleton ─────────────────────────────────────────────────────────
  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto pb-20 animate-pulse space-y-8">
        <div className="h-12 bg-white rounded-2xl border border-gray-100" />
        <div className="h-28 bg-white rounded-[32px] border border-gray-100" />
        <div className="h-80 bg-white rounded-[32px] border border-gray-100" />
      </div>
    );
  }

  const handleAddSchedule = () => {
    const ok = addOrUpdateSchedule();
    if (!ok) toast.error("Please select at least one day and fill Start / End time.");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto pb-20">

      {/* ── Top Bar ── */}
      <div className="mb-8 flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <button
          type="button"
          onClick={() => navigate("/shifts")}
          className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-right">
          <h1 className="text-2xl font-medium font-mono text-gray-800 tracking-wide">
            {isEdit ? "Edit Shift" : "Shift Configuration"}
          </h1>
          <p className="text-sm text-gray-400 tracking-wider mt-1 font-medium">
            {isEdit ? "Update shift rules" : "Create a multi-schedule shift rule"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => formik.handleSubmit()}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0D80F2] text-white rounded-xl font-bold hover:bg-black hover:shadow-lg disabled:opacity-70 transition-all"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : isEdit ? "Update Shift" : "Deploy Shift"}
        </button>
      </div>

      {/* ── API error banner ── */}
      {/* {apiError && (
        <div className="mb-6 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl text-sm font-bold text-red-600">
          {apiError}
        </div>
      )} */}

      <div className="space-y-8">

        {/* ── Shift Name ── */}
        <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0054a6]" />

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
              Shift Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Developer Regular Shift"
              {...formik.getFieldProps("shiftName")}
              className={`w-full px-6 py-4 bg-gray-50 focus:bg-white border-2 rounded-2xl outline-none font-black text-xl text-gray-800 transition-all ${
                formik.touched.shiftName && formik.errors.shiftName
                  ? "border-red-400"
                  : "border-transparent focus:border-gray-200"
              }`}
            />
            {formik.touched.shiftName && formik.errors.shiftName && (
              <p className="text-red-500 text-xs font-bold pl-2">{formik.errors.shiftName}</p>
            )}
          </div>
        </div>

        {/* ── Schedule Builder ── */}
        <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fc7728]" />

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-50 text-[#fc7728] rounded-2xl">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-medium tracking-wider text-gray-700">
                {editingIndex !== null ? "Edit Schedule" : "Add Schedule"}
              </h2>
            </div>
            {editingIndex !== null && (
              <button
                type="button"
                onClick={cancelEditSchedule}
                className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="space-y-8">

            {/* Time + Break */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TimePicker
                label="Start Time"
                required
                value={currentSchedule.startTime}
                onChange={(val) => setCurrentSchedule((p) => ({ ...p, startTime: val }))}
              />

              <TimePicker
                label="End Time"
                required
                value={currentSchedule.endTime}
                onChange={(val) => setCurrentSchedule((p) => ({ ...p, endTime: val }))}
              />

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Break</label>
                <select
                  value={currentSchedule.breakTime}
                  onChange={(e) => setCurrentSchedule((p) => ({ ...p, breakTime: e.target.value }))}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-gray-200 rounded-2xl outline-none font-bold text-gray-700 appearance-none cursor-pointer focus:bg-white transition-all"
                >
                  <option value="" disabled>Select Break</option>
                  <option value="None">No Break</option>
                  <option value="15 Mins">15 Mins</option>
                  <option value="30 Mins">30 Mins</option>
                  <option value="45 Mins">45 Mins</option>
                  <option value="1 Hour">1 Hour</option>
                </select>
              </div>
            </div>

            {/* Applicable Days */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Applicable Days</label>
              <div className="flex flex-wrap gap-3 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                {DAYS.map((d) => {
                  const isSelected = currentSchedule.days.includes(d);
                  return (
                    <button
                      type="button"
                      key={d}
                      onClick={() => toggleScheduleDay(d)}
                      className={`flex-1 min-w-[70px] py-3.5 rounded-2xl text-sm font-bold transition-all flex flex-col items-center gap-1 ${
                        isSelected
                          ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100 border border-transparent"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#fc7728]" />}
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add / Update schedule button */}
            <button
              type="button"
              onClick={handleAddSchedule}
              className="flex items-center gap-2 mx-auto px-10 py-3.5 bg-[#0D80F2] text-white font-bold rounded-xl hover:-translate-y-0.5 transition-all"
            >
              {editingIndex !== null ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingIndex !== null ? "Update Schedule" : "Add Schedule"}
            </button>

          </div>
        </div>

        {/* ── Schedule cards ── */}
        {formik.values.schedules.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-2">
              Schedules in this Shift
            </h3>
            {formik.errors.schedules && typeof formik.errors.schedules === "string" && (
              <p className="text-red-500 text-xs font-bold pl-2">{formik.errors.schedules}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {formik.values.schedules.map((sch, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative group"
                  >
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {sch.days.map((d) => (
                        <span key={d} className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md uppercase">
                          {d}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Timings</p>
                        <p className="text-sm font-black text-gray-800">
                          {sch.startTime} <span className="text-gray-400 mx-1">→</span> {sch.endTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Break</p>
                        <p className="text-sm font-bold text-[#0D80F2]">{sch.breakTime || "None"}</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => editSchedule(idx)}
                        className="p-2 bg-blue-50 text-[#0054a6] hover:bg-blue-100 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSchedule(idx)}
                        className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ── Schedules required error (shown when trying to submit with none) ── */}
        {formik.touched.schedules && formik.errors.schedules &&
          typeof formik.errors.schedules === "string" &&
          formik.values.schedules.length === 0 && (
          <p className="text-red-500 text-sm font-bold text-center">{formik.errors.schedules}</p>
        )}

      </div>
    </motion.div>
  );
};

export default ShiftForm;
