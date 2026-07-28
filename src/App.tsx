import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { lazy } from "react";

import ProtectedRoute from "./route/ProtectedRoute";

import Login from "./pages/Login";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const BranchList = lazy(() => import("./pages/Branches/BranchList"));
const ShiftList = lazy(() => import("./pages/Shifts/ShiftList"));
const ShiftForm = lazy(() => import("./pages/Shifts/ShiftForm"));
const BranchForm = lazy(() => import("./pages/Branches/BranchForm"));
const AdminLayout = lazy(() => import("./layout/AdminLayout"));
const UserList = lazy(() => import("./pages/UserManagement/UserList"));
const UserForm = lazy(() => import("./pages/UserManagement/UserForm"));
const EmployeeAssignment = lazy(() => import("./pages/Employees/EmployeeAssignment"));
const AssignmentForm = lazy(() => import("./pages/Employees/AssignmentForm"));
const ProfileForm = lazy(() => import("./pages/Profile/ProfileForm"));
const TypesList = lazy(() => import("./pages/Document/Types/TypesList"));
const TypeForm = lazy(() => import("./pages/Document/Types/TypeForm"));
const PositionsList = lazy(() => import("./pages/Positions/PositionsList"));
const PositionForm = lazy(() => import("./pages/Positions/PositionForm"));
const GeneralSettings = lazy(() => import("./pages/GeneralSettings/GeneralSettings"));
const QuestionList = lazy(() => import("./pages/Assessment/Questions/QuestionList"));
const QuestionForm = lazy(() => import("./pages/Assessment/Questions/QuestionForm"));
const SectionForm = lazy(() => import("./pages/Assessment/Sections/SectionForm"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"))
const Uploads = lazy(() => import("./pages/uploads/uploads"));
const SectionList = lazy(() => import("./pages/Assessment/Sections/SectionList"));
const EditSection = lazy(() => import("./pages/Assessment/Sections/EditSection"));
const ExternalSources = lazy(() => import("./pages/ExternalSources"));
const SourceForm = lazy(() => import("./pages/ExternalSources/SourceForm"));
const AllInquiriesList = lazy(() => import("./pages/Inquiries/AllInquiriesList"));
const AdminCandidateDetail = lazy(() => import("./pages/Inquiries/AdminCandidateDetail"));

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
            <Route path="/all-inquiries" element={<AllInquiriesList />} />
             <Route path="/all-inquiries/:id" element={<AdminCandidateDetail />} />
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
            <Route path="/assessment-sections/add" element={<SectionForm />} />
            <Route path="/assessment-sections/edit/:id" element={<EditSection />} />
            <Route path="/assessment-sections" element={<SectionList />} />
            <Route path="/questions/add" element={<QuestionForm />} />
            <Route path="/questions/edit/:id" element={<QuestionForm />} />
            <Route path="/uploads" element={<Uploads />} />
            <Route path="/external-sources" element={<ExternalSources />} />
            <Route path="/external-sources/add" element={<SourceForm />} />
            <Route path="/external-sources/edit/:id" element={<SourceForm />} />



          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;
