import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowLeft, Save } from "lucide-react";
import { motion } from "framer-motion";

const BranchForm = () => {
  const navigate = useNavigate();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const formik = useFormik({
    initialValues: { title: "", location: "", counters: 0, timeZone: "Asia/Kolkata", workDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      location: Yup.string().required("Location is required"),
      workDays: Yup.array().min(1, "Select at least one day"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      const saved = JSON.parse(localStorage.getItem("asporea_branches") || "[]");
      localStorage.setItem("asporea_branches", JSON.stringify([...saved, { ...values, id: Date.now() }]));
      setSubmitting(false); navigate("/branches");
    },
  });

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto pb-20">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <button onClick={() => navigate("/branches")} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold px-4 py-2 rounded-xl hover:bg-gray-50 transition-all">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button onClick={() => formik.handleSubmit()} disabled={formik.isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-[#0D80F2] text-white rounded-xl font-bold hover:bg-black hover:shadow-lg transition-all">
          <Save className="w-4 h-4" /> Save Branch
        </button>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0D80F2]"></div>
            <h2  className="text-2xl font-medium tracking-wider text-gray-700">General Information</h2>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 mt-5 block">Branch Title *</label>
                <input type="text" placeholder="e.g. South Extension HQ" {...formik.getFieldProps('title')} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#0D80F2]/30 rounded-2xl outline-none font-bold text-gray-800 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Full Location *</label>
                <textarea rows={3} placeholder="Enter complete address..." {...formik.getFieldProps('location')} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#0D80F2]/30 rounded-2xl outline-none font-bold text-gray-800 transition-all resize-none"></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Operations */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100">
            <h2  className="text-2xl font-medium tracking-wider text-gray-700">Operations</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 mt-4 block">Time Zone</label>
                <select {...formik.getFieldProps('timeZone')} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#fc7728]/30 rounded-2xl outline-none font-bold text-gray-700 appearance-none cursor-pointer">
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Active Counters</label>
                <div className="flex items-center bg-gray-50 rounded-2xl p-1 border-2 border-transparent focus-within:border-[#fc7728]/30 transition-all">
                  <button type="button" onClick={() => formik.setFieldValue('counters', Math.max(0, formik.values.counters - 1))} className="w-12 h-12 flex items-center p-4 justify-center bg-white rounded-xl shadow-sm font-black text-gray-500 hover:text-orange-500">-</button>
                  <input type="number" readOnly {...formik.getFieldProps('counters')} className="flex-1 bg-transparent text-center -translate-x-17 font-black text-xl outline-none" />
                  <button type="button" onClick={() => formik.setFieldValue('counters', formik.values.counters + 1)} className="w-12 h-12 p-4 -translate-x-35 flex items-center justify-center bg-white rounded-xl shadow-sm font-black text-gray-500 hover:text-blue-500">+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100">
            <h2  className="text-2xl font-medium tracking-wider text-gray-700 mb-5">Working Days</h2>
            <div className="flex flex-wrap gap-2">
              {days.map(d => {
                const isSelected = formik.values.workDays.includes(d);
                return (
                  <button 
                    type="button" key={d}
                    onClick={() => {
                      const next = isSelected ? formik.values.workDays.filter(day => day !== d) : [...formik.values.workDays, d];
                      formik.setFieldValue('workDays', next);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${isSelected ? 'bg-[#0D80F2] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

      </form>
    </motion.div>
  );
};

export default BranchForm;