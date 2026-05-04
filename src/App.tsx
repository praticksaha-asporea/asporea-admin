import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./route/ProtectedRoute";
import BranchList from "./pages/Branches/BranchList";
import ShiftList from "./pages/Shifts/ShiftList";
import ShiftForm from "./pages/Shifts/ShiftForm";
import BranchForm from "./pages/Branches/BranchForm";
import AdminLayout from "./layout/AdminLayout";
import UserList from "./pages/UserManagement/UserList";
import UserForm from "./pages/UserManagement/UserForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/add" element={<UserForm />} />
             <Route path="/branches" element={<BranchList />} 
             />
             <Route path="/branches/add" element={<BranchForm />} />
            <Route path="/shifts" element={<ShiftList />} />
            
<Route path="/shifts/add" element={<ShiftForm />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
