// import { useState } from "react";
// import { Outlet } from "react-router-dom";
 
// import Sidebar from "./Sidebar"; 
// import Header from "./Header";

// const AdminLayout = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  

//   return (
//     <div className="flex h-screen bg-white overflow-hidden font-sans text-slate-800">
      
       
//       <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

       
//       <div className="flex-1 flex flex-col w-full min-w-0 transition-all duration-300 ease-in-out">
        
        
//         <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

//       <main
//   className="flex-1 overflow-y-auto"
//   style={{
//     backgroundImage:
//       "url('https://images.unsplash.com/photo-1684369175833-4b445ad6bfb5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2hpdGUlMjBiZyUyMGFkbWluJTIwcm9ib3R8ZW58MHx8MHx8fDA%3D')",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//   }}
// >
//   <Outlet />
// </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;


import { useState } from "react";
import { Outlet } from "react-router-dom";
 
import Sidebar from "./Sidebar"; 
import Header from "./Header";

 
const VIDEO_SOURCE = "https://www.pexels.com/download/video/34540815/"; 

const FALLBACK_IMAGE = "https://images.pexels.com/photos/7334502/pexels-photo-7334502.jpeg";

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
            backgroundImage: `url('${FALLBACK_IMAGE}')`,  
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
           
          <video
            src={VIDEO_SOURCE}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none -z-10 object-center"
          />

          
          <div className="relative z-10 min-h-full w-full">
            <Outlet />
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminLayout;