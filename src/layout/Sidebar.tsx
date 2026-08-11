import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building,
  ChevronDown,
  HandCoins,
  ClipboardList,
  UploadCloud,
  Link2,
} from "lucide-react";
import logo from "../assets/asporeaLogo.png";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "User Management", icon: Users, path: "/users" },
    { name: "Uploads", icon: UploadCloud, path: "/uploads" },
    { name: "All Inquiries", icon: ClipboardList, path: "/all-inquiries" },

    {
      name: "Branch & Shift",
      icon: Building,
      subItems: [
        { name: "Branches", path: "/branches" },
        { name: "Shifts", path: "/shifts" },
        { name: "Employees", path: "/employees" },
        { name: "General", path: "/general-settings" },
      ],
    },

    {
      name: "Position & Docs",
      icon: HandCoins,
      subItems: [
        { name: "Document Type", path: "/document-types" },
        { name: "Positions", path: "/positions" },
        { name: "Countries", path: "/countries" }, 
      ],
    },

   {
      name: "Assessment",
      icon: ClipboardList,
      subItems: [
        { name: "Sections", path: "/assessment-sections" },  
        { name: "Questions", path: "/questions" }
      ],
    },
    { name: "External Sources", icon: Link2, path: "/external-sources" },
  ];

  useEffect(() => {
    if (
      location.pathname.includes("/branches") ||
      location.pathname.includes("/shifts")
    ) {
      setOpenDropdown("Branches & Shifts");
    }
  }, [location.pathname]);

  const toggleDropdown = (menuName: string) => {
    if (!isOpen) {
      setIsOpen(true);
      setOpenDropdown(menuName);
    } else {
      setOpenDropdown(openDropdown === menuName ? null : menuName);
    }
  };

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

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4 custom-scrollbar">
        {menuItems.map((item) => {
          if (item.subItems) {
            const isDropdownOpen = openDropdown === item.name;
            const isChildActive = item.subItems.some((sub) =>
              location.pathname.includes(sub.path),
            );

            return (
              <div key={item.name} className="flex flex-col">
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className={`flex items-center justify-between px-3 py-3 rounded-xl transition-all font-medium cursor-pointer ${
                    isChildActive || isDropdownOpen
                      ? "bg-blue-50 text-[#0D80F2]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-[#0D80F2]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span
                      className={`whitespace-nowrap transition-all duration-300 ${
                        isOpen ? "opacity-100 block" : "opacity-0 hidden"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                  {isOpen && (
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isDropdownOpen && isOpen
                      ? " opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                  }`}
                  // max-h-40
                >
                  <div className="flex flex-col gap-1 pl-11 pr-2">
                    {item.subItems.map((sub) => (
                      <NavLink
                        key={sub.name}
                        to={sub.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            isActive
                              ? "bg-[#0D80F2] text-white shadow-md shadow-blue-200"
                              : "text-gray-500 hover:text-[#0D80F2] hover:bg-gray-100"
                          }`
                        }
                      >
                        <span className="whitespace-nowrap">{sub.name}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          return (
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
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
