import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const ShiftForm = () => {
  const navigate = useNavigate();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const formik = useFormik({
    initialValues: { shiftName: "", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], startTime: "", endTime: "", breakTime: "" },
    validationSchema: Yup.object({
      shiftName: Yup.string().required("Shift name is required"),
      startTime: Yup.string().required("Required"),
      endTime: Yup.string().required("Required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      const saved = JSON.parse(localStorage.getItem("asporea_shifts") || "[]");
      localStorage.setItem("asporea_shifts", JSON.stringify([...saved, { ...values, id: Date.now() }]));
      setSubmitting(false); navigate("/shifts");
    },
  });

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto pb-20">
      
      <div className="mb-8 flex items-center justify-between">
         <button onClick={() => navigate("/shifts")} className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-right">
          <h1 className="text-2xl font-medium font-mono text-gray-800 tracking-wide">Shift Configuration</h1>
          <p className="text-sm text-gray-400 tracking-wider mt-2 font-medium">Create a new work schedule rule</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-50 overflow-hidden">
        
        {/* Banner */}
        <div className="h-32 bg-linear-to-r from-gray-900 to-gray-800 relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-size-[20px_20px]"></div>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-10 -mt-10 relative z-10 space-y-8">
          
           

          <div className="space-y-2 mt-4 ">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest  pl-2">Shift Name *</label>
            <input type="text" placeholder="e.g. Developer Night Shift" {...formik.getFieldProps('shiftName')} className="w-full mt-3 px-6 py-4 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border-2 border-transparent focus:border-gray-100 rounded-2xl outline-none font-black text-xl text-gray-800 transition-all placeholder:font-medium placeholder:text-gray-300" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Start Time *</label>
              <input type="time" {...formik.getFieldProps('startTime')} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-gray-100 rounded-2xl outline-none font-bold text-gray-700 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">End Time *</label>
              <input type="time" {...formik.getFieldProps('endTime')} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-gray-100 rounded-2xl outline-none font-bold text-gray-700 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Break Duration</label>
              <select {...formik.getFieldProps('breakTime')} className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-50 focus:bg-white border-2 border-transparent focus:border-gray-100 rounded-2xl outline-none font-bold text-gray-700 transition-all appearance-none cursor-pointer">
                <option value="" disabled>Select Break</option>
                <option value="None">No Break</option>
                <option value="15 Mins">15 Mins</option>
                <option value="30 Mins">30 Mins</option>
                <option value="45 Mins">45 Mins</option>
                <option value="1 Hour">1 Hour</option>
                <option value="1.5 Hours">1.5 Hours</option>
              </select>
            </div>
          </div>
          

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Applicable Days</label>
            <div className="flex flex-wrap gap-3 bg-gray-50 p-4 rounded-3xl border border-gray-100">
              {days.map(d => {
                const isSelected = formik.values.days.includes(d);
                return (
                  <button 
                    type="button" key={d}
                    onClick={() => {
                      const next = isSelected ? formik.values.days.filter(day => day !== d) : [...formik.values.days, d];
                      formik.setFieldValue('days', next);
                    }}
                    className={`flex-1 min-w-15 py-3 rounded-2xl text-sm font-bold transition-all flex flex-col items-center gap-1 ${isSelected ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {d}
                  </button>
                )
              })}
            </div>
            
          </div>

          

          <button type="submit" disabled={formik.isSubmitting} className="w-full py-4 bg-[#0D80F2] text-white font-medium tracking-widest text-lg rounded-2xl hover:bg-[#0D80F2] hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] transition-all">
            Deploy Shift Schedule
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ShiftForm;