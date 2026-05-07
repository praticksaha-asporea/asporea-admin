import { useState, useEffect } from "react";
import { Search, Filter, Plus, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

 
const defaultUsers = [
  { id: 1, firstName: "Anil", lastName: "Yadav", email: "anil@asporea.com", role: "admin", status: "active", joinDate: "12 Jan 2026" },
  { id: 2, firstName: "Rameshwar", lastName: "", email: "ramesh@asporea.com", role: "branch_head", status: "active", joinDate: "15 Feb 2026" },
  { id: 3, firstName: "Priya", lastName: "Sharma", email: "priya@asporea.com", role: "institute", status: "inactive", joinDate: "20 Mar 2026" },
  { id: 4, firstName: "Vikram", lastName: "Singh", email: "vikram@asporea.com", role: "user", status: "active", joinDate: "05 Apr 2026" },
];

const UserList = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("asporea_users");
    return savedUsers ? JSON.parse(savedUsers) : defaultUsers;
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
 
  useEffect(() => {
    localStorage.setItem("asporea_users", JSON.stringify(users));
  }, [users]);
 
  const filteredUsers = users.filter((user: any) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u: any) => u.id !== id));
    }
  };

   
  const formatRole = (role: string) => {
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-widest text-gray-700">User Management</h1>
          <p className="text-sm text-gray-500 mt-3 font-medium">Manage your team members and their account permissions.</p>
        </div>
        <button 
          onClick={() => navigate("/users/add")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0D80F2] text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:scale-[1.02] transition-all whitespace-nowrap"
        >
          <Plus className="w-5 h-5" /> Add New User
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}  
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent focus:bg-white focus:border-[#0D80F2]/30 border-2 rounded-xl outline-none text-sm transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">
            <Filter className="w-4 h-4" /> Filters
          </button>
       
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}  
            className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm outline-none cursor-pointer"
          >
            <option value="All Roles">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="tac">TAC</option>
            <option value="tac_head">TAC Head</option>
            <option value="reception">Reception</option>
            <option value="finance">Finance</option>
            <option value="coordinator">Coordinator</option>
            <option value="pca">PCA</option>
            <option value="sub_pca">Sub PCA</option>
            <option value="pcra">PCRA</option>
            <option value="institute">Institute</option>
            <option value="branch_head">Branch Head</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">User Details</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Joined Date</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              
              {filteredUsers.length > 0 ? filteredUsers.map((user: any) => (
                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-[#0054a6] font-bold text-sm uppercase">
                        {user.firstName ? user.firstName.charAt(0) : "U"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                      {formatRole(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : user.status === 'deleted' ? 'bg-red-500' : 'bg-orange-400'}`}></span>
                      <span className={`text-xs font-bold ${user.status === 'active' ? 'text-green-600' : user.status === 'deleted' ? 'text-red-600' : 'text-orange-500'} uppercase`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">{user.joinDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-[#0D80F2] hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)} 
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500 font-bold">No users found matching your search/filter.</td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default UserList;