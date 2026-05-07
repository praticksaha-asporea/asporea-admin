import { useState, useEffect, useRef } from "react";
import {
  Menu,
  Search,
  Bell,
  User,
  LogOut,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChangePasswordModal from "../components/modals/ChangePasswordModal";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (path: string) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  return (
    <>
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 lg:px-8 z-30 sticky top-0">
      <div className="flex items-center gap-6">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-400 hover:text-[#0054a6] bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden md:flex items-center relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-4" />
          <input
            type="text"
            placeholder="Search records..."
            className="pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-[#0D80F2]/30 border-2 rounded-xl outline-none transition-all text-sm w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-[#fc7728] transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#fc7728] border-2 border-white rounded-full animate-pulse"></span>
        </button>

        <div className="w-px h-8 bg-gray-200 mx-2"></div>

        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 cursor-pointer group p-1 pr-2 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0054a6] to-[#fc7728] p-0.5 shadow-md">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-gray-700 group-hover:text-[#0054a6] transition-colors">
                Anil Yadav
              </p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                Super Admin
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </div>

          {/* THE DROPDOWN MENU */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-14 w-64 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden flex flex-col z-50"
              >
                {/* Dropdown Header */}
                <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                  <p className="text-sm font-black text-gray-800">Anil Yadav</p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    anil@asporea.com
                  </p>
                </div>

                {/* Dropdown Links */}
                <div className="p-2 flex flex-col gap-1">
                  <button
                    onClick={() => handleNavigation("/profile")}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 hover:text-[#0D80F2] hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </button>

                 <button 
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);  
                        setIsPasswordModalOpen(true); 
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 hover:text-[#fc7728] hover:bg-orange-50 rounded-xl transition-all cursor-pointer w-full text-left"
                    >
                      <ShieldCheck className="w-4 h-4" /> Change Password
                    </button>
                </div>

                <div className="p-2 border-t border-gray-50">
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
    <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </>
  );
};

export default Header;
