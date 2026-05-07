import  { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { 
  Briefcase, UserPlus, Building, Clock, Calendar, 
  Hash, Timer, ShieldCheck, Trash2, User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 👇 Interfaces (Taaki TypeScript rote na)
interface User { id: number; firstName: string; lastName: string; role: string; }
interface Branch { id: number; title: string; }
interface Shift { id: number; shiftName: string; }
interface Assignment {
  id: number;
  employeeId: string;
  branchId: string;
  shiftId: string;
  effectiveFrom: string;
  minuteOfSlots: number;
  counterNo: number;
  role?: string;
}

const EmployeeAssignment = () => {
  // Data States
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  // Load Data from LocalStorage
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("asporea_users") || "[]");
    const savedBranches = JSON.parse(localStorage.getItem("asporea_branches") || "[]");
    const savedShifts = JSON.parse(localStorage.getItem("asporea_shifts") || "[]");
    const savedAssignments = JSON.parse(localStorage.getItem("asporea_assignments") || "[]");

    setUsers(savedUsers);
    setBranches(savedBranches);
    setShifts(savedShifts);
    setAssignments(savedAssignments);
  }, []);

  // Formik Logic
  const formik = useFormik({
    initialValues: {
      role: "", // UI Filter ke liye
      employeeId: "",
      branchId: "",
      shiftId: "",
      effectiveFrom: new Date().toISOString().split("T")[0], // Aaj ki date
      minuteOfSlots: 30,
      counterNo: 1,
    },
    validationSchema: Yup.object({
      role: Yup.string().required("Role is required to filter"),
      employeeId: Yup.string().required("Please select an employee"),
      branchId: Yup.string().required("Please select a branch"),
      shiftId: Yup.string().required("Please select a shift"),
      effectiveFrom: Yup.date().required("Date is required"),
      minuteOfSlots: Yup.number().min(5, "Min 5 mins").required("Required"),
      counterNo: Yup.number().min(1, "Min counter 1").required("Required"),
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setErrorMsg("");

      // TL ka Backend Check: Same employee, same branch, same shift duplicate na ho
      const isDuplicate = assignments.some(
        (a) => a.employeeId === values.employeeId && a.branchId === values.branchId && a.shiftId === values.shiftId
      );

      if (isDuplicate) {
        setErrorMsg("This employee is already assigned to this branch and shift!");
        setSubmitting(false);
        return;
      }

      const newAssignment = { ...values, id: Date.now() };
      const updatedAssignments = [...assignments, newAssignment];
      
      localStorage.setItem("asporea_assignments", JSON.stringify(updatedAssignments));
      setAssignments(updatedAssignments);
      
      alert("Employee Assigned Successfully! 🎉");
      // Reset form but keep defaults
      resetForm({ values: { ...formik.initialValues, role: "", employeeId: "", branchId: "", shiftId: "" } });
      setSubmitting(false);
    },
  });

  // 👇 LOGIC: Role ke hisaab se users filter karna 👇
  const filteredUsers = users.filter((u) => u.role === formik.values.role);

  // Helper function: Table mein ID ki jagah actual Naam dikhane ke liye
  const getEmployeeName = (id: string) => {
    const user = users.find((u) => String(u.id) === id);
    return user ? `${user.firstName} ${user.lastName || ""}` : "Unknown";
  };
  const getBranchName = (id: string) => branches.find((b) => String(b.id) === id)?.title || "Unknown";
  const getShiftName = (id: string) => shifts.find((s) => String(s.id) === id)?.shiftName || "Unknown";

  const handleDelete = (id: number) => {
    if(window.confirm("Are you sure you want to remove this assignment?")) {
      const updated = assignments.filter(a => a.id !== id);
      setAssignments(updated);
      localStorage.setItem("asporea_assignments", JSON.stringify(updated));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto pb-20 space-y-8">
      
      {/* 🌟 HEADER 🌟 */}
      <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-50 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-700 tracking-wide">Employee Assignment</h1>
          <p className="text-sm text-gray-500 font-medium mt-2">Assign employees to branches and shifts.</p>
        </div>
      </div>

      {/* 🌟 TOP SECTION: THE FORM 🌟 */}
      <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0054a6]"></div>
        
        <h2 className="text-xl font-medium text-gray-700 tracking-wider mb-6 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-[#0054a6]" /> New Assignment
        </h2>

        {errorMsg && (
          <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. ROLE (Filter) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Filter by Role</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <select 
                  {...formik.getFieldProps('role')}
                  onChange={(e) => {
                    formik.handleChange(e);
                    formik.setFieldValue('employeeId', ""); // Role change hone pe employee clear kar do
                  }}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-50 border-2 rounded-xl outline-none font-bold text-gray-700 transition-all appearance-none ${formik.touched.role && formik.errors.role ? 'border-red-400 bg-white' : 'border-transparent focus:border-[#0054a6]/30'}`}
                >
                  <option value="" disabled>Select Role...</option>
                  {[...new Set(users.map(u => u.role))].map(r => ( // Unique roles from created users
                    <option key={r} value={r}>{r.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. EMPLOYEE NAME */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Employee *</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <select 
                  {...formik.getFieldProps('employeeId')}
                  disabled={!formik.values.role}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-50 border-2 rounded-xl outline-none font-bold text-gray-700 transition-all appearance-none disabled:opacity-50 ${formik.touched.employeeId && formik.errors.employeeId ? 'border-red-400 bg-white' : 'border-transparent focus:border-[#0054a6]/30'}`}
                >
                  <option value="" disabled>{formik.values.role ? "Select Employee..." : "Select role first"}</option>
                  {filteredUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. BRANCH */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Branch *</label>
              <div className="relative">
                <Building className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <select {...formik.getFieldProps('branchId')} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#0054a6]/30 rounded-xl outline-none font-bold text-gray-700 transition-all appearance-none">
                  <option value="" disabled>Select Branch...</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                </select>
              </div>
            </div>

            {/* 4. SHIFT */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Shift *</label>
              <div className="relative">
                <Clock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <select {...formik.getFieldProps('shiftId')} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#0054a6]/30 rounded-xl outline-none font-bold text-gray-700 transition-all appearance-none">
                  <option value="" disabled>Select Shift...</option>
                  {shifts.map(s => <option key={s.id} value={s.id}>{s.shiftName}</option>)}
                </select>
              </div>
            </div>

            {/* 5. EFFECTIVE FROM */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Effective From</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input type="date" {...formik.getFieldProps('effectiveFrom')} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#0054a6]/30 rounded-xl outline-none font-bold text-gray-700 transition-all" />
              </div>
            </div>

            {/* 6. SLOT DURATION */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Slot Mins</label>
              <div className="relative">
                <Timer className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input type="number" step={15} {...formik.getFieldProps('minuteOfSlots')} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#0054a6]/30 rounded-xl outline-none font-bold text-gray-700 transition-all" />
              </div>
            </div>

            {/* 7. COUNTER NO */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">For Counter</label>
              <div className="relative">
                <Hash className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input type="number" min="1" {...formik.getFieldProps('counterNo')} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#0054a6]/30 rounded-xl outline-none font-bold text-gray-700 transition-all" />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex items-end">
              <button type="submit" disabled={formik.isSubmitting} className="w-full h-[52px] bg-[#0054a6] text-white font-black rounded-xl shadow-lg hover:bg-blue-800 transition-all">
                Assign Roster
              </button>
            </div>

          </div>
        </form>
      </div>

      {/* 🌟 BOTTOM SECTION: THE TABLE 🌟 */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-xl font-medium tracking-wider  text-gray-700">Current Assignments</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Location & Time</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Config</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {assignments.length > 0 ? assignments.map((assign, i) => (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={assign.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-800">{getEmployeeName(assign.employeeId)}</p>
                    <span className="text-[10px] font-bold text-[#fc7728] bg-orange-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{assign.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-700 flex items-center gap-1"><Building className="w-3.5 h-3.5 text-[#0054a6]" /> {getBranchName(assign.branchId)}</p>
                    <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-orange-400" /> {getShiftName(assign.shiftId)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md border border-gray-200" title="Slot Mins">{assign.minuteOfSlots}m</span>
                      <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md border border-gray-200" title="Counter">C-{assign.counterNo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(assign.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-400 font-bold">No assignments found. Fill the form above to add one.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </motion.div>
  );
};

export default EmployeeAssignment;