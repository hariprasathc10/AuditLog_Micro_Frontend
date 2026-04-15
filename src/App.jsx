import { Navigate, Route, Routes } from "react-router-dom"
 
// Auth Pages
import LoginPage from "./pages/auth/LoginPage"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
 
// Layouts
import AdminLayout from "./layouts/AdminLayout"
import ManagerLayout from "./layouts/ManagerLayout"
import EmployeeLayout from "./layouts/EmployeeLayout"
import AuditorLayout from "./layouts/AuditorLayout"
 
// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard"
import UsersPage from "./pages/admin/UsersPage"           // ✅ was UserPage
import CreateUserDialog from "./pages/admin/CreateUserDialog"
import RolesPage from "./pages/admin/RolesPage"           // ✅ was RolePage
 
// Manager Pages
import ManagerDashboard from "./pages/manager/ManagerDashboard"
import ProjectsPage from "./pages/manager/ProjectsPage"
import ProjectDialog from "./pages/manager/ProjectDialog"
import IssuesPage from "./pages/manager/IssuesPage"       // ✅ was IssuePage
import IssueDialog from "./pages/manager/IssueDialog"
import AssignEmployeePage from "./pages/manager/AssignEmployeePage"
import AssignEmployeeDialog from "./pages/manager/AssignEmployeeDialog"
 
// Employee Pages
import EmployeeDashboard from "./pages/employee/EmployeeDashboard"  // ✅ was missing
import MyIssuesPage from "./pages/employee/MyIssuesPage"            // ✅ was missing
import IssueStatusDialog from "./pages/employee/IssueStatusDialog"  // ✅ was missing
 
// Auditor Pages
import AuditorDashboard from "./pages/auditor/AuditorDashboard"
import AuditLogsPage from "./pages/auditor/AuditLogsPage"   // ✅ was AuditLogPage
 
// Route Guards
import ProtectedRoute from "./routes/ProtectedRoute"
import RoleRoute from "./routes/RoleRoute"
 
function App() {
  return (
    <Routes>
 
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
 
      {/* Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users"     element={<UsersPage />} />
            <Route path="/admin/roles"     element={<RolesPage />} />
          </Route>
        </Route>
      </Route>
 
      {/* Manager Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['MANAGER']} />}>
          <Route element={<ManagerLayout />}>
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/manager/projects"  element={<ProjectsPage />} />
            <Route path="/manager/issues"    element={<IssuesPage />} />
            <Route path="/manager/assign"    element={<AssignEmployeePage />} />
          </Route>
        </Route>
      </Route>
 
      {/* Employee Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['EMPLOYEE']} />}>
          <Route element={<EmployeeLayout />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/issues"    element={<MyIssuesPage />} />
          </Route>
        </Route>
      </Route>
 
      {/* Auditor Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['AUDITOR']} />}>
          <Route element={<AuditorLayout />}>
            <Route path="/auditor/dashboard" element={<AuditorDashboard />} />
            <Route path="/auditor/logs"      element={<AuditLogsPage />} />
          </Route>
        </Route>
      </Route>
 
      {/* Fallback */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
 
    </Routes>
  )
}
 
export default App