import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Save, Briefcase, UserPlus,
  Building, Clock, Calendar, Hash, Timer,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAssignmentForm } from "./useAssignmentForm";

const AssignmentForm = () => {
  const navigate = useNavigate();
  const {
    formik, loading, fetching, apiError, isEdit,
    branches, shifts, filteredUsers, usersLoading, uniqueRoles, fetchUsersByRole,
  } = useAssignmentForm();
  
  // ── Fetch skeleton ─────────────────────────────────────────────────────────
  if (fetching) {
    return (
      <div className="max-w-5xl mx-auto pb-20 animate-pulse space-y-8">
        <div className="h-16 bg-white rounded-2xl border border-gray-100" />
        <div className="h-72 bg-white rounded-[32px] border border-gray-100" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto pb-20">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <button
          onClick={() => navigate("/employees")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold px-4 py-2 rounded-xl hover:bg-gray-50 transition-all"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-700 tracking-wider font-mono">
            {isEdit ? "Edit Assignment" : "New Assignment"}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => formik.handleSubmit()}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0054a6] text-white rounded-xl font-bold hover:bg-black hover:shadow-lg disabled:opacity-70 transition-all"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : isEdit ? "Update" : "Assign Roster"}
        </button>
      </div>

      {/* ── API error banner ── */}
      {apiError && (
        <div className="mb-6 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl text-sm font-bold text-red-600">
          {apiError}
        </div>
      )}

      {/* ── Form card ── */}
      <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0054a6]" />

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-50 text-[#0054a6] rounded-2xl"><UserPlus className="w-6 h-6" /></div>
          <h2 className="text-2xl font-medium tracking-wider text-gray-700">Assignment Details</h2>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Role filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                Filter by Role <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                <select
                  {...formik.getFieldProps("role")}
                  onChange={(e) => {
                    formik.handleChange(e);
                    formik.setFieldValue("employeeId", "");
                    fetchUsersByRole(e.target.value);
                  }}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 appearance-none transition-all ${
                    formik.touched.role && formik.errors.role
                      ? "border-red-400 focus:bg-white"
                      : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"
                  }`}
                >
                  <option value="" disabled>Select Role...</option>
                  {uniqueRoles.map((r) => (
                    <option key={r} value={r}>{r.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              {formik.touched.role && formik.errors.role && (
                <p className="text-red-500 text-xs font-bold pl-2">{formik.errors.role}</p>
              )}
            </div>

            {/* Employee */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                Employee <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <UserPlus className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                <select
                  {...formik.getFieldProps("employeeId")}
                  disabled={!formik.values.role || usersLoading}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 appearance-none transition-all disabled:opacity-50 ${
                    formik.touched.employeeId && formik.errors.employeeId
                      ? "border-red-400 focus:bg-white"
                      : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"
                  }`}
                >
                  <option value="" disabled>
                    {usersLoading
                      ? "Loading..."
                      : formik.values.role
                      ? filteredUsers.length === 0
                        ? "No employees found"
                        : "Select Employee..."
                      : "Select role first"}
                  </option>
                  {filteredUsers.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.firstName} {u.lastName}
                    </option>
                  ))}
                </select>
              </div>
              {formik.touched.employeeId && formik.errors.employeeId && (
                <p className="text-red-500 text-xs font-bold pl-2">{formik.errors.employeeId}</p>
              )}
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                Branch <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Building className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                <select
                  {...formik.getFieldProps("branchId")}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 appearance-none transition-all ${
                    formik.touched.branchId && formik.errors.branchId
                      ? "border-red-400 focus:bg-white"
                      : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"
                  }`}
                >
                  <option value="" disabled>Select Branch...</option>
                  {branches.map((b) => (
                    <option key={b._id} value={b._id}>{b.title}</option>
                  ))}
                </select>
              </div>
              {formik.touched.branchId && formik.errors.branchId && (
                <p className="text-red-500 text-xs font-bold pl-2">{formik.errors.branchId}</p>
              )}
            </div>

            {/* Shift */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                Shift <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Clock className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                <select
                  {...formik.getFieldProps("shiftId")}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 appearance-none transition-all ${
                    formik.touched.shiftId && formik.errors.shiftId
                      ? "border-red-400 focus:bg-white"
                      : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"
                  }`}
                >
                  <option value="" disabled>Select Shift...</option>
                  {shifts.map((s) => (
                    <option key={s._id} value={s._id}>{s.shiftName}</option>
                  ))}
                </select>
              </div>
              {formik.touched.shiftId && formik.errors.shiftId && (
                <p className="text-red-500 text-xs font-bold pl-2">{formik.errors.shiftId}</p>
              )}
            </div>

            {/* Effective From */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Effective From</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                <input
                  type="date"
                  {...formik.getFieldProps("effectiveFrom")}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#0054a6]/30 rounded-2xl outline-none font-bold text-gray-700 transition-all focus:bg-white"
                />
              </div>
            </div>

            {/* Slot Minutes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Slot Mins</label>
              <div className="relative group">
                <Timer className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                <input
                  type="number"
                  step={15}
                  {...formik.getFieldProps("minuteOfSlots")}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${
                    formik.touched.minuteOfSlots && formik.errors.minuteOfSlots
                      ? "border-red-400 focus:bg-white"
                      : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"
                  }`}
                />
              </div>
              {formik.touched.minuteOfSlots && formik.errors.minuteOfSlots && (
                <p className="text-red-500 text-xs font-bold pl-2">{formik.errors.minuteOfSlots}</p>
              )}
            </div>

            {/* Counter No */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Counter No.</label>
              <div className="relative group">
                <Hash className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                <input
                  type="number"
                  min={1}
                  {...formik.getFieldProps("counterNo")}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${
                    formik.touched.counterNo && formik.errors.counterNo
                      ? "border-red-400 focus:bg-white"
                      : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"
                  }`}
                />
              </div>
              {formik.touched.counterNo && formik.errors.counterNo && (
                <p className="text-red-500 text-xs font-bold pl-2">{formik.errors.counterNo}</p>
              )}
            </div>

          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AssignmentForm;
