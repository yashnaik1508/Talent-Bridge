// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import UserInfo from "./pages/auth/UserInfo";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/layout/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

// Employee Pages
import EmployeeList from "./pages/employees/EmployeeList";
import InactiveEmployeeList from "./pages/employees/InactiveEmployeeList";
import AddEmployee from "./pages/employees/AddEmployee";
import EditEmployee from "./pages/employees/EditEmployee";
import EmployeeStrength from "./pages/employees/EmployeeStrength";

// Skill Pages
import SkillList from "./pages/skills/SkillList";
import AddSkill from "./pages/skills/AddSkill";
import EditSkill from "./pages/skills/EditSkill";
import SkillStrength from "./pages/skills/SkillStrength";

// Employee Skill Pages
import EmployeeSkills from "./pages/employees/EmployeeSkills";
import AddEmployeeSkill from "./pages/employees/AddEmployeeSkill";
import EditEmployeeSkill from "./pages/employees/EditEmployeeSkill";
import MyAssignments from "./pages/employees/MyAssignments";

// Project Pages
import ProjectList from "./pages/projects/ProjectList";
import AddProject from "./pages/projects/AddProject";
import EditProject from "./pages/projects/EditProject";
import ProjectRequirements from "./pages/projects/ProjectRequirements";
import ProjectRequirementAnalysis from "./pages/projects/ProjectRequirementAnalysis";

import ProjectModules from "./pages/projects/ProjectModules";
import ProjectProgress from "./pages/projects/ProjectProgress";

// Matching Pages
import MatchCandidates from "./pages/matching/MatchCandidates";
import AssignEmployee from "./pages/matching/AssignEmployee";
import ReassignmentDashboard from "./pages/matching/ReassignmentDashboard";

// Analytics & Settings
import Reports from "./pages/analytics/Reports";

import Settings from "./pages/settings/Settings";
import Updates from "./pages/Updates";
import NotesPage from "./pages/NotesPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ---------------- PUBLIC ---------------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ---------------- DASHBOARD ---------------- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR", "PM", "EMPLOYEE"]}>
              <MainLayout><Dashboard /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-assignments"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN", "HR"]}>
              <MainLayout>
                <MyAssignments />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-skills/add"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN", "HR"]}>
              <MainLayout><AddEmployeeSkill /></MainLayout>
            </ProtectedRoute>
          }
        />


        {/* ========================================================= */}
        {/*                    EMPLOYEE MANAGEMENT                    */}
        {/* ========================================================= */}

        {/* HR + ADMIN only */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
              <MainLayout><EmployeeList /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/add"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
              <MainLayout><AddEmployee /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
              <MainLayout><EditEmployee /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/strength"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
              <MainLayout><EmployeeStrength /></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* EMPLOYEE SKILLS MANAGEMENT (Admin + HR Only) */}
        <Route
          path="/employees/:id/skills"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
              <MainLayout><EmployeeSkills /></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* EMPLOYEE (self) + ADMIN + HR */}
        <Route
          path="/my-skills"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN", "HR"]}>
              <MainLayout><EmployeeSkills /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-skills/add"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR", "EMPLOYEE"]}>
              <MainLayout><AddEmployeeSkill /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-skills/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
              <MainLayout><EditEmployeeSkill /></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ========================================================= */}
        {/*                         SKILLS                            */}
        {/* ========================================================= */}

        {/* HR + ADMIN */}
        <Route
          path="/skills"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
              <MainLayout><SkillList /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/skills/strength"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
              <MainLayout><SkillStrength /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/skills/add"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR", "PM"]}>
              <MainLayout><AddSkill /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/skills/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
              <MainLayout><EditSkill /></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ========================================================= */}
        {/*                         PROJECTS                          */}
        {/* ========================================================= */}

        {/* ADMIN + PM */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "PM"]}>
              <MainLayout><ProjectList /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/add"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "PM"]}>
              <MainLayout><AddProject /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "PM"]}>
              <MainLayout><EditProject /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:id/requirements"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "PM"]}>
              <MainLayout><ProjectRequirements /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:id/analysis"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "PM"]}>
              <MainLayout><ProjectRequirementAnalysis /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:id/modules"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "PM"]}>
              <MainLayout><ProjectModules /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/progress"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "PM"]}>
              <MainLayout><ProjectProgress /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-info"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR", "PM", "EMPLOYEE"]}>
              <MainLayout><UserInfo /></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ========================================================= */}
        {/*                         MATCHING                          */}
        {/* ========================================================= */}

        {/* Only ADMIN + PM */}
        <Route
          path="/matching/find/:projectId"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "PM"]}>
              <MainLayout><MatchCandidates /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/matching/assign"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "PM"]}>
              <MainLayout><AssignEmployee /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/matching/reassignment"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "PM"]}>
              <MainLayout><ReassignmentDashboard /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/employees/inactive" element={
          <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
            <MainLayout><InactiveEmployeeList /></MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/matching" element={<Navigate to="/matching/reassignment" replace />} />

        {/* ========================================================= */}
        {/*                  ANALYTICS + SETTINGS                     */}
        {/* ========================================================= */}

        {/* ADMIN + HR + PM */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR", "PM"]}>
              <MainLayout><Reports /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/updates"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR", "PM", "EMPLOYEE"]}>
              <MainLayout><Updates /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR", "PM", "EMPLOYEE"]}>
              <MainLayout><NotesPage /></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN only */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <MainLayout><Settings /></MainLayout>
            </ProtectedRoute>
          }
        />



        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
