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
import EmployeeAssignment from "./pages/Employees/EmployeeAssignment";
import { Bounce, ToastContainer } from 'react-toastify';

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
            <Route path="/users/edit/:id" element={<UserForm />} />
            <Route path="/branches" element={<BranchList />} />
            <Route path="/branches/add" element={<BranchForm />} />
            <Route path="/branches/edit/:id" element={<BranchForm />} />
            <Route path="/shifts" element={<ShiftList />} />
            <Route path="/shifts/add" element={<ShiftForm />} />
            <Route path="/shifts/edit/:id" element={<ShiftForm />} />
            <Route path="/employees" element={<EmployeeAssignment />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </BrowserRouter>
  );
}

export default App;
