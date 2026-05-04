import { useState, useEffect } from "react";
import { Plus, Clock, Sun, Moon, Edit3, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// 👇 TS FIX: Interface define kiya 👇
interface Shift {
  id: number;
  shiftName: string;
  days: string[];
  startTime: string;
  endTime: string;
  breakTime: string;
}

const ShiftList = () => {
  const navigate = useNavigate();
 
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("asporea_shifts");
    if (saved) setShifts(JSON.parse(saved));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-50">
        <div>
          <h1  className="text-2xl font-medium tracking-wider text-gray-700">Shift Schedules</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Configure global working hours and breaks.</p>
        </div>
        <button onClick={() => navigate("/shifts/add")} className="px-6 py-3 bg-[#0D80F2] text-white rounded-2xl font-bold shadow-lg   hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Shift
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {shifts.length > 0 ? shifts.map((shift, i) => {
          // TS safe string check
          const startTimeString = shift.startTime || "";
          const isNight = startTimeString.includes("PM") || Number(startTimeString.split(":")[0]) >= 17;

          return (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              key={shift.id} 
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100   hover:border-[#0D80F2]/30 transition-all relative overflow-hidden group"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-[#0D80F2] to-[#0D80F2] opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-6 mt-2">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isNight ? 'bg-indigo-50 text-indigo-500' : 'bg-[#0D80F2] text-white'}`}>
                    {isNight ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800">{shift.shiftName}</h3>
                    <div className="flex gap-1 mt-1">
                      {shift.days?.map((d: string) => <span key={d} className="w-2 h-2 rounded-full bg-gray-300" title={d}></span>)}
                      <span className="text-xs text-gray-400 font-bold ml-2">({shift.days?.length || 0} Days)</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-gray-400 hover:text-[#0D80F2] hover:bg-blue-50 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between border border-gray-100">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Timings</p>
                    <p className="text-sm font-black text-gray-700">{shift.startTime} <span className="text-gray-300 mx-1">→</span> {shift.endTime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Break</p>
                  <p className="text-sm font-bold text-[#0D80F2]">{shift.breakTime || "None"}</p>
                </div>
              </div>
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