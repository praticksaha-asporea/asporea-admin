import { useState, useEffect } from "react";
import { Plus, Clock, Sun, Moon, Edit3, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

 
interface ScheduleObj {
  days: string[];
  startTime: string;
  endTime: string;
  breakTime: string;
}

interface Shift {
  id: number;
  shiftName: string;
  schedules: ScheduleObj[];
}

const ShiftList = () => {
  const navigate = useNavigate();
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("asporea_shifts");
    if (saved) setShifts(JSON.parse(saved));
  }, []);

   
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      const updatedShifts = shifts.filter(shift => shift.id !== id);
      setShifts(updatedShifts);
      localStorage.setItem("asporea_shifts", JSON.stringify(updatedShifts));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-50">
        <div>
          <h1 className="text-2xl font-medium tracking-wider text-gray-700">Shift Schedules</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Configure multi-day working hours and breaks.</p>
        </div>
        <button onClick={() => navigate("/shifts/add")} className="px-6 py-3 bg-[#0D80F2] text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
          <Plus className="w-5 h-5" /> Add Shift
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {shifts.length > 0 ? shifts.map((shift, i) => {
          
          const firstSchTime = shift.schedules && shift.schedules[0] ? shift.schedules[0].startTime : "";
          const isNight = firstSchTime.includes("PM") || Number(firstSchTime.split(":")[0]) >= 17;

          return (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              key={shift.id} 
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-[#0D80F2]/30 transition-all relative overflow-hidden group flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#0D80F2] to-[#0D80F2] opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-6 mt-2">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isNight ? 'bg-indigo-50 text-indigo-500' : 'bg-[#0D80F2] text-white'}`}>
                    {isNight ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800">{shift.shiftName}</h3>
                    <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">{shift.schedules?.length || 0} Rule(s) Applied</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-gray-400 hover:text-[#0D80F2] hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"><Edit3 className="w-4 h-4" /></button>
                  
                  <button onClick={() => handleDelete(shift.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

       
              {shift.schedules && shift.schedules.length > 0 ? (
                <div className="flex-1 space-y-2 bg-gray-50/50 p-2 rounded-2xl border border-gray-100">
                  {shift.schedules.map((sch, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl shadow-sm border border-gray-50 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-[#fc7728] uppercase tracking-wider mb-1">
                          {sch.days.join(", ")}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-black text-gray-700">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {sch.startTime} <span className="text-gray-300 font-normal">→</span> {sch.endTime}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Break</span>
                        <span className="text-xs font-bold text-[#0D80F2] bg-blue-50 px-2 py-0.5 rounded-md">{sch.breakTime || "None"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                
                <div className="flex-1 flex items-center justify-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100 border-dashed">
                  <p className="text-xs text-red-400 font-bold uppercase tracking-widest">Incomplete Setup</p>
                </div>
              )}

            </motion.div>
          )
        }) : (
           <div className="col-span-2 bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-500 font-bold">No shift configurations yet.</h3>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ShiftList;