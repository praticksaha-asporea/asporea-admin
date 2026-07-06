import { useState } from "react";
import { Outlet } from "react-router-dom";
 
import Sidebar from "./Sidebar"; 
import Header from "./Header";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans text-slate-800">
      
       
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

       
      <div className="flex-1 flex flex-col w-full min-w-0 transition-all duration-300 ease-in-out">
        
        
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <main
  className="flex-1 overflow-y-auto"
  style={{
    backgroundImage:
      "url('https://images.pexels.com/photos/7668041/pexels-photo-7668041.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  <Outlet />
</main>
      </div>
    </div>
  );
};

export default AdminLayout;