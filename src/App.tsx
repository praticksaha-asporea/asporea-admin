import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import AssignmentForm from "./pages/Employees/AssignmentForm";
import ProfileForm from "./pages/Profile/ProfileForm";
import { Toaster } from "react-hot-toast";
import TypesList from "./pages/Document/Types/TypesList";
import TypeForm from "./pages/Document/Types/TypeForm";
import PositionsList from "./pages/Positions/PositionsList";
import PositionForm from "./pages/Positions/PositionForm";
import GeneralSettings from "./pages/GeneralSettings/GeneralSettings";
import QuestionList from "./pages/Assessment/Questions/QuestionList";
import QuestionForm from "./pages/Assessment/Questions/QuestionForm";
import NotFound from "./pages/NotFound/NotFound"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
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
            <Route path="/employees/add" element={<AssignmentForm />} />
            <Route path="/employees/edit/:id" element={<AssignmentForm />} />
            <Route path="/document-types" element={<TypesList />} />
            <Route path="/document-types/add" element={<TypeForm />} />
            <Route path="/document-types/edit/:id" element={<TypeForm />} />
            <Route path="/positions" element={<PositionsList />} />
            <Route path="/positions/add" element={<PositionForm />} />
            <Route path="/positions/edit/:id" element={<PositionForm />} />
            <Route path="/questions" element={<QuestionList />} />
            <Route path="/profile" element={<ProfileForm />} />
            <Route path="/general-settings" element={<GeneralSettings />} />
            <Route path="/questions" element={<QuestionList />} />
            <Route path="/questions/add" element={<QuestionForm />} />
            <Route path="/questions/edit/:id" element={<QuestionForm />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;
