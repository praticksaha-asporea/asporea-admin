import { useState, useEffect } from "react";
import { Search, Plus, MapPin, Building2, Edit3, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

 
interface Branch {
  id: number;
  title: string;
  location: string;
  timeZone: string;
  counters: number;
  workDays: string[];
  status?: string;
}

const BranchList = () => {
  const navigate = useNavigate();
 
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("asporea_branches");
    if (saved) setBranches(JSON.parse(saved));
  }, []);

  const filtered = branches.filter((b) => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-50">
        <div>
          <h1 className="text-3xl font-mono text-gray-800 tracking-wider">Branches</h1>
          <p className="text-sm text-gray-500 tracking-wider font-medium mt-3">Manage physical locations and operations.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
            <input 
              type="text" placeholder="Search branches..." 
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border-2 border-transparent focus:border-[#0D80F2]/30 rounded-2xl outline-none transition-all text-sm font-bold"
            />
          </div>
          <button onClick={() => navigate("/branches/add")} className="px-6 py-3 bg-[#0D80F2] text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-5 h-5" /> <span className="hidden sm:block">Add Branch</span>
          </button>
        </div>
      </div>

      {/* MODERN DETACHED TABLE */}
      <div className="space-y-3">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-[11px] font-black text-gray-400 uppercase tracking-widest">
          <div className="col-span-4">Branch Details</div>
          <div className="col-span-3">Location & TimeZone</div>
          <div className="col-span-2">Counters</div>
          <div className="col-span-2">Work Days</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {/* Table Rows */}
        {filtered.length > 0 ? filtered.map((branch, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            key={branch.id} 
            className="grid grid-cols-12 gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all group"
          >
            <div className="col-span-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-[#0054a6] border border-blue-100/50 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-base">{branch.title}</p>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md uppercase tracking-wider">Active</span>
              </div>
            </div>
            
            <div className="col-span-3">
              <div className="flex items-center gap-1.5 text-sm font-bold text-gray-600">
                <MapPin className="w-4 h-4 text-orange-400" /> {branch.location}
              </div>
              <p className="text-xs text-gray-400 font-medium mt-1">{branch.timeZone}</p>
            </div>

            <div className="col-span-2">
              <span className="text-lg font-black text-gray-700 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">{branch.counters || 0}</span>
            </div>

            <div className="col-span-2 flex items-center gap-1 flex-wrap">
              {branch.workDays?.slice(0,3).map((day: string) => (
                <span key={day} className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md uppercase">{day}</span>
              ))}
              {(branch.workDays?.length || 0) > 3 && <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md">+{branch.workDays.length - 3}</span>}
            </div>

            <div className="col-span-1 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 text-gray-400 hover:text-[#0D80F2] bg-gray-50 hover:bg-blue-50 rounded-xl transition-all"><Edit3 className="w-4 h-4" /></button>
              <button className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )) : (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"><Building2 className="w-8 h-8 text-gray-300" /></div>
            <h3 className="text-gray-500 font-bold">No branches found.</h3>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BranchList;