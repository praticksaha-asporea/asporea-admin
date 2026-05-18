import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowLeft, CheckCircle2, Clock, CalendarDays, Plus, Edit3, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ScheduleObj {
  days: string[];
  startTime: string;
  endTime: string;
  breakTime: string;
}

const ShiftForm = () => {
  const navigate = useNavigate();
  const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

 
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleObj>({
    days: [], startTime: "", endTime: "", breakTime: ""
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const formik = useFormik({
    initialValues: { shiftName: "", schedules: [] as ScheduleObj[] },
    validationSchema: Yup.object({
      shiftName: Yup.string().required("Shift name is required"),
      schedules: Yup.array().min(1, "Add at least one schedule configuration"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      const saved = JSON.parse(localStorage.getItem("asporea_shifts") || "[]");
      localStorage.setItem("asporea_shifts", JSON.stringify([...saved, { ...values, id: Date.now() }]));
      setSubmitting(false); 
      navigate("/shifts");
    },
  });

 
  const handleAddSchedule = () => {
    if (!currentSchedule.startTime || !currentSchedule.endTime || currentSchedule.days.length === 0) {
      alert("Please select at least one day and fill the Start/End time.");
      return;
    }

    const newSchedules = [...formik.values.schedules];
    if (editingIndex !== null) {
      newSchedules[editingIndex] = currentSchedule;  
      setEditingIndex(null);
    } else {
      newSchedules.push(currentSchedule);  
    }
    
    formik.setFieldValue("schedules", newSchedules);
    
    setCurrentSchedule({ days: [], startTime: "", endTime: "", breakTime: "" });
  };

  
  const handleEdit = (index: number) => {
    setCurrentSchedule(formik.values.schedules[index]);
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });  
  };

  const handleRemove = (index: number) => {
    const updated = formik.values.schedules.filter((_, i) => i !== index);
    formik.setFieldValue("schedules", updated);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto pb-20">
      
      <div className="mb-8 flex items-center justify-between">
         <button type="button" onClick={() => navigate("/shifts")} className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-right">
          <h1 className="text-2xl font-medium font-mono text-gray-800 tracking-wide">Shift Configuration</h1>
          <p className="text-sm text-gray-400 tracking-wider mt-2 font-medium">Create a multi-schedule shift rule</p>
        </div>
      </div>

      <div className="space-y-8">
        
        
        <div className="bg-white p-8 rounded-4xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0054a6]"></div>
         

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Shift Name *</label>
            <input type="text" placeholder="e.g. Developer Regular Shift" {...formik.getFieldProps('shiftName')} 
              className={`w-full px-6 py-4 bg-gray-50 hover:bg-gray-50 focus:bg-white border-2 rounded-2xl outline-none font-black text-xl text-gray-800 transition-all ${formik.touched.shiftName && formik.errors.shiftName ? 'border-red-400' : 'border-transparent focus:border-gray-200'}`} 
            />
            {formik.touched.shiftName && formik.errors.shiftName && <p className="text-red-500 text-xs font-bold pl-2">{formik.errors.shiftName}</p>}
          </div>
        </div>
 
        <div className="bg-white p-8 rounded-4xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fc7728]"></div>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-50 text-[#fc7728] rounded-2xl"><CalendarDays className="w-5 h-5" /></div>
              <h2 className="text-xl font-medium tracking-wider text-gray-700">{editingIndex !== null ? "Edit Schedule" : "Schedule "}</h2>
            </div>
            {editingIndex !== null && (
              <button type="button" onClick={() => { setEditingIndex(null); setCurrentSchedule({ days: [], startTime: "", endTime: "", breakTime: "" }); }} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg">Cancel Edit</button>
            )}
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Start Time *</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input type="time" value={currentSchedule.startTime} onChange={(e) => setCurrentSchedule({...currentSchedule, startTime: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-gray-200 rounded-2xl outline-none font-bold text-gray-700 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">End Time *</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input type="time" value={currentSchedule.endTime} onChange={(e) => setCurrentSchedule({...currentSchedule, endTime: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-gray-200 rounded-2xl outline-none font-bold text-gray-700 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Break</label>
                <select value={currentSchedule.breakTime} onChange={(e) => setCurrentSchedule({...currentSchedule, breakTime: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-gray-200 rounded-2xl outline-none font-bold text-gray-700 appearance-none cursor-pointer">
                  <option value="" disabled>Select Break</option>
                  <option value="None">No Break</option>
                  <option value="15 Mins">15 Mins</option>
                  <option value="30 Mins">30 Mins</option>
                  <option value="45 Mins">45 Mins</option>
                  <option value="1 Hour">1 Hour</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Applicable Days</label>
              <div className="flex flex-wrap gap-3 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                {daysList.map(d => {
                  const isSelected = currentSchedule.days.includes(d);
                  return (
                    <button 
                      type="button" key={d}
                      onClick={() => {
                        const next = isSelected ? currentSchedule.days.filter(day => day !== d) : [...currentSchedule.days, d];
                        setCurrentSchedule({...currentSchedule, days: next});
                      }}
                      className={`flex-1 min-w-17.5 py-3.5 rounded-2xl text-sm font-bold transition-all flex flex-col items-center gap-1 ${isSelected ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 border border-transparent'}`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#fc7728]" />}
                      {d}
                    </button>
                  )
                })}
              </div>
            </div>

          
            <button type="button" onClick={handleAddSchedule} className="w-fit mx-auto  py-3.5 px-10 bg-[#0D80F2] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#0D80F2] transition-all cursor-pointer transform hover:-translate-y-0.5">
              {editingIndex !== null ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingIndex !== null ? "Update Schedule " : "Add Schedule"}
            </button>
          </div>
        </div>

     
        {formik.values.schedules.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-2">Schedules in this Shift</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {formik.values.schedules.map((sch, idx) => (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative group">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {sch.days.map(d => (
                        <span key={d} className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md uppercase">{d}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Timings</p>
                        <p className="text-sm font-black text-gray-800">{sch.startTime} <span className="text-gray-400 mx-1">→</span> {sch.endTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Break</p>
                        <p className="text-sm font-bold text-[#0D80F2]">{sch.breakTime || "None"}</p>
                      </div>
                    </div>
               
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => handleEdit(idx)} className="p-2 bg-blue-50 text-[#0054a6] hover:bg-blue-100 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                      <button type="button" onClick={() => handleRemove(idx)} className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

       
        <div className="pt-6">
          {formik.errors.schedules && typeof formik.errors.schedules === 'string' && (
            <p className="text-red-500 text-sm font-bold text-center mb-4">{formik.errors.schedules}</p>
          )}
          <button type="button" onClick={() => formik.handleSubmit()} disabled={formik.isSubmitting}  className="w-fit mx-auto  py-3.5 px-14 bg-[#0D80F2] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#0D80F2] transition-all cursor-pointer transform hover:-translate-y-0.5">
            Deploy Shifts
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default ShiftForm;