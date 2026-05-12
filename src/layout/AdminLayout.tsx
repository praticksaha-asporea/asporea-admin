import { useState } from "react";
import { Outlet } from "react-router-dom";
// Inko hum next step mein banayenge
import Sidebar from "./Sidebar"; 
import Header from "./Header";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  

  return (
    <div className="flex h-screen bg-[#f3f6fc] overflow-hidden font-sans text-slate-800">
      
      {/* LEFT NAVIGATION (Sidebar) */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col w-full min-w-0 transition-all duration-300 ease-in-out">
        
        {/* TOP HEADER */}
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* PAGE CONTENT (Yahan tumhare Tables aur Forms aayenge) */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          <div className="mx-auto max-w-7xl">
            {/* React Router ka Outlet jo current page render karega */}
            <Outlet /> 
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;