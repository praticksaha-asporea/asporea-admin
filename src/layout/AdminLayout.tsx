import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";


// const VIDEO_SOURCE = "https://www.pexels.com/download/video/34540815/"; 


const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans text-slate-800">

      {/* Sidebar Control Panel */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Layout Area Wrapper */}
      <div className="flex-1 flex flex-col w-full min-w-0 transition-all duration-300 ease-in-out">

        {/* Navigation Top Header */}
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />


        <main
          className="flex-1 overflow-y-auto relative z-0"
          style={{

            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >

          {/* <video
            src={VIDEO_SOURCE}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none -z-10 object-center"
          /> */}


          <div className="relative z-10 min-h-full w-full p-5">
            <Outlet />
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminLayout;