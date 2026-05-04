import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users,   Building, Clock} from "lucide-react";
import logo from '../assets/asporeaLogo.png'

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({ isOpen }:SidebarProps) => {
  // Menu items array jisse baar-baar code na likhna pade
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "User Management", icon: Users, path: "/users" },
    { name: "Branches", icon: Building, path: "/branches" },
  { name: "Shifts", icon: Clock, path: "/shifts" },
   
    
  ];
  return (
    <aside
      className={`bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out z-20 ${
        isOpen ? "w-64" : "w-20"
      }`}
    > 
      <div className="h-20 flex items-center justify-center border-b border-gray-50">
        <img
          src={logo}
          alt="Asporea Logo"
          className={`transition-all mt-4 duration-300 object-contain ${
            isOpen ? "w-48" : "w-14"
          }`}
        />
      </div>

      <div className="flex justify-end px-4 py-2">
  
</div>

      
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4 custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-3 rounded-xl transition-all font-medium ${
                isActive
                  ? "bg-[#0D80F2] text-white shadow-lg shadow-blue-200"
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#0D80F2]"
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            
            <span
              className={`whitespace-nowrap transition-all duration-300 ${
                isOpen ? "opacity-100 block" : "opacity-0 hidden"
              }`}
            >
              {item.name}
            </span>
          </NavLink>
        ))}
      </div>

       
     
    </aside>
  );
};

export default Sidebar;