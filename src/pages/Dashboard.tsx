import { motion } from "framer-motion";
// import { 
//   Users, 
//   BookOpen, 
//   DollarSign, 
//   TrendingUp, 
//   ArrowUpRight,
//   MoreHorizontal
// } from "lucide-react";
 
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  
  
  // const revenueData = [
  //   { month: 'Jan', revenue: 10000 },
  //   { month: 'Feb', revenue: 8000 },
  //   { month: 'Mar', revenue: 7000 },
  //   { month: 'Apr', revenue: 12000 },
  //   { month: 'May', revenue: 8000 },
  //   { month: 'Jun', revenue: 8000 },
  //   { month: 'Jul', revenue: 8000 },
  //   { month: 'Aug', revenue: 10000 },
  //   { month: 'Sep', revenue: 9000 },
  //   { month: 'Oct', revenue: 10000 },
  //   { month: 'Nov', revenue: 9000 },
  //   { month: 'Dec', revenue: 11000 },
  // ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-wider font-medium text-gray-800">
            Welcome back, Admin!
          </h1>
        </div>
      </div>

      {/* 2. STATS CARDS ROW */}
      <div className="text-5xl">
        Coming Soon ... 
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0054a6]">
              <Users className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>
          <p className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-1">Total Users</p>
          <h3 className="text-3xl font-medium mt-3 text-gray-600">1,248</h3>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#fc7728]">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> +5%
            </span>
          </div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Leads</p>
          <h3 className="text-2xl font-medium mt-3 text-gray-600">Coming Soon ...</h3>
        </motion.div>

 
        <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" /> +18%
            </span>
          </div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Positions</p>
          <h3 className="text-2xl font-medium mt-3 text-gray-600">Coming soon</h3>
        </motion.div>

      </div>

 
      <div className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-gray-100 w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-3xl font-medium tracking-wider text-gray-800">Revenue Analytics</h3>
            <p className="text-sm text-gray-400 mt-3 tracking-wider">Monthly performance for 2026</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        
        <div className="w-full h-87.5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
             
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              
        
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
              
              
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ backgroundColor: '#0D80F2', borderRadius: '12px', color: '#fff', border: 'none' }}
                itemStyle={{ color: '#fff' }}
              />
              
         
              <Bar dataKey="revenue" fill="#0D80F2" radius={[6, 6, 0, 0]} barSize={49} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div> */}

    </motion.div>
  );
};

export default Dashboard;